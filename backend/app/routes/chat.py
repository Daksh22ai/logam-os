import os
import logging
import json
from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.models.schemas import (
    ChatRequest, ChatResponse, UploadResponse, 
    SessionCreate, SessionResponse, MessageResponse
)
from app.services.chat_service import process_message, stream_message
from app.db.database import get_db
from app.db import crud

logger = logging.getLogger(__name__)
router = APIRouter()

# ── Session & Message endpoints ──────────────────────────────────────────

@router.post("/sessions", response_model=SessionResponse)
def create_chat_session(req: SessionCreate, db: Session = Depends(get_db)):
    try:
        session = crud.create_session(db, req.company_id, req.title)
        return session
    except Exception as e:
        logger.error(f"Error creating session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to create session.")

@router.get("/sessions/{company_id}", response_model=List[SessionResponse])
def get_chat_sessions(company_id: str, db: Session = Depends(get_db)):
    try:
        sessions = crud.get_sessions(db, company_id)
        return sessions
    except Exception as e:
        logger.error(f"Error getting sessions: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch sessions.")

@router.get("/messages/{session_id}", response_model=List[MessageResponse])
def get_chat_messages(session_id: str, db: Session = Depends(get_db)):
    try:
        messages = crud.get_messages(db, session_id)
        return messages
    except Exception as e:
        logger.error(f"Error getting messages: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch messages.")

# ── Chat endpoints ────────────────────────────────────────────────────────

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Standard (non-streaming) chat endpoint.
    Retrieves history from DB, queries LLM, saves user/AI messages to DB.
    """
    try:
        # Save user message
        crud.create_message(db, request.session_id, "user", request.message)

        # Get history to send to LLM
        db_messages = crud.get_messages(db, request.session_id)
        # LLM expects list of dicts: [{"role":..., "content":...}, ...]
        history = [{"role": msg.role, "content": msg.content} for msg in db_messages[:-1]] # Exclude the one we just added

        response_text = await process_message(request.message, history)

        # Save AI response
        crud.create_message(db, request.session_id, "assistant", response_text)

        # Rename session title if it's "New Chat" and this is the first exchange
        if len(db_messages) <= 2:
            new_title = request.message[:30] + "..." if len(request.message) > 30 else request.message
            crud.update_session_title(db, request.session_id, new_title)

        return ChatResponse(response=response_text)
    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to process your message. Please try again.")


@router.post("/stream")
async def chat_stream_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Streaming chat endpoint (Server-Sent Events).
    """
    try:
        # Save user message
        crud.create_message(db, request.session_id, "user", request.message)

        # Get history to send to LLM
        db_messages = crud.get_messages(db, request.session_id)
        history = [{"role": msg.role, "content": msg.content} for msg in db_messages[:-1]]

        # Async generator wrapper to save response string after streaming completes
        async def stream_and_save():
            full_response = ""
            async for chunk in stream_message(request.message, history):
                if chunk.startswith("data: "):
                    data_str = chunk[6:].strip()
                    if data_str != "[DONE]":
                        try:
                            data = json.loads(data_str)
                            if "text" in data:
                                full_response += data["text"]
                        except:
                            pass
                yield chunk
            
            # Streaming done, save AI response
            if full_response:
                crud.create_message(db, request.session_id, "assistant", full_response)
            
            # Renaming session concept
            if len(db_messages) <= 2:
                new_title = request.message[:30] + "..." if len(request.message) > 30 else request.message
                crud.update_session_title(db, request.session_id, new_title)
        
        return StreamingResponse(
            stream_and_save(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
            }
        )
    except Exception as e:
        logger.error(f"Chat streaming error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to start stream. Please try again.")

# ── File upload endpoint ──────────────────────────────────────────────────

ALLOWED_TYPES = {
    "text/plain", "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
}
MAX_FILE_SIZE_MB = 10


@router.post("/upload", response_model=UploadResponse)
async def upload_endpoint(file: UploadFile = File(...)):
    """
    File upload endpoint for RAG document ingestion.
    Currently extracts raw text from uploaded files for future Pinecone embedding.
    Supported: .txt, .pdf, .docx, .csv (≤10 MB)
    """
    # Guard: content type
    if file.content_type not in ALLOWED_TYPES and not (
        file.filename or "").lower().endswith((".txt", ".pdf", ".docx", ".csv")):
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {file.content_type}. Supported: .txt, .pdf, .docx, .csv"
        )

    try:
        contents = await file.read()

        # Guard: file size
        size_mb = len(contents) / (1024 * 1024)
        if size_mb > MAX_FILE_SIZE_MB:
            raise HTTPException(
                status_code=413,
                detail=f"File too large ({size_mb:.1f} MB). Maximum allowed: {MAX_FILE_SIZE_MB} MB."
            )

        # Extract text based on type
        extracted_text = ""
        filename = file.filename or "upload"
        ext = os.path.splitext(filename)[1].lower()

        if ext == ".txt" or file.content_type == "text/plain":
            extracted_text = contents.decode("utf-8", errors="ignore")

        elif ext == ".csv" or file.content_type == "text/csv":
            extracted_text = contents.decode("utf-8", errors="ignore")

        elif ext == ".pdf" or file.content_type == "application/pdf":
            try:
                import pypdf
                import io
                reader = pypdf.PdfReader(io.BytesIO(contents))
                extracted_text = "\n".join(page.extract_text() or "" for page in reader.pages)
            except ImportError:
                logger.warning("pypdf not installed. Install it to enable PDF parsing.")
                extracted_text = "[PDF text extraction requires pypdf: pip install pypdf]"

        elif ext == ".docx":
            try:
                import docx
                import io
                doc = docx.Document(io.BytesIO(contents))
                extracted_text = "\n".join(p.text for p in doc.paragraphs)
            except ImportError:
                logger.warning("python-docx not installed. Install it to enable DOCX parsing.")
                extracted_text = "[DOCX text extraction requires python-docx: pip install python-docx]"

        # Chunk count (rough estimate — 500 chars per chunk)
        chunks = max(1, len(extracted_text) // 500) if extracted_text else 0

        logger.info(f"Uploaded file '{filename}': {len(extracted_text)} chars, ~{chunks} chunks")

        # TODO: send chunks to Pinecone embedding pipeline
        # from app.services.vector_service import store_chunks
        # await store_chunks(filename, extracted_text)

        return UploadResponse(
            success=True,
            filename=filename,
            message=f"File processed successfully. {chunks} text chunks extracted and ready for AI context.",
            chunks_stored=chunks,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error for '{file.filename}': {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
