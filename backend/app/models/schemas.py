from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime

class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True

class SessionResponse(BaseModel):
    id: str
    company_id: str
    title: str
    created_at: datetime
    messages: Optional[List[MessageResponse]] = []

    class Config:
        from_attributes = True

class SessionCreate(BaseModel):
    company_id: str
    title: Optional[str] = "New Chat"

class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's message or prompt")
    session_id: str = Field(..., description="Session ID to persist context in SQLite")
    
class ChatResponse(BaseModel):
    response: str = Field(..., description="The AI's response")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class UploadResponse(BaseModel):
    success: bool
    filename: str
    message: str
    chunks_stored: int = 0

class HealthResponse(BaseModel):
    status: str = "ok"
    timestamp: str
    version: str = "1.0.0"

class ErrorResponse(BaseModel):
    error: str
    code: str
