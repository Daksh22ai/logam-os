import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

load_dotenv()

class Settings(BaseSettings):
    # API Keys
    GROQ_API_KEY: str = "mock-key-for-now"
    GROQ_MODEL_NAME: str = "llama-3.3-70b-versatile"
    
    PINECONE_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    
    @property
    def HAS_PINECONE(self) -> bool:
        return bool(self.PINECONE_API_KEY)
    
    @property
    def HAS_GEMINI(self) -> bool:
        return bool(self.GOOGLE_API_KEY)
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    LOG_LEVEL: str = "info"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

settings = Settings()
