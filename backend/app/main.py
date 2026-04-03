from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.routes import health, chat
from app.config import settings
from app.utils.logger import setup_logging
from app.db import models
from app.db.database import engine
import logging

# Ensure logging is set up before doing much else
setup_logging()

app = FastAPI(
    title="Logam OS API",
    description="Backend API for Logam OS AI Features",
    version="1.0.0"
)

# CORS — allow all origins in dev; tighten in production
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,   # must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Global unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

# Register routers
app.include_router(health.router, tags=["health"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
# /api/chat/stream  → streaming chat (SSE)
# /api/chat/upload  → file upload (RAG)

@app.on_event("startup")
async def startup_event():
    # Create tables
    models.Base.metadata.create_all(bind=engine)
    logging.info("Logam OS Backend startup complete. Database initialized.")
