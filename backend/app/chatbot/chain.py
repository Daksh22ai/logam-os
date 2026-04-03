import logging
from langchain_groq import ChatGroq
from app.config import settings

logger = logging.getLogger(__name__)

# Cache the LLM instance
_llm_cache = None


def get_chat_chain():
    """
    Return a raw ChatGroq LLM instance.
    We pass messages directly (via build_prompt_messages) so we do NOT
    wrap in LCEL here — that lets us support multi-turn history cleanly.
    Returns None if GROQ_API_KEY is missing/mock.
    """
    global _llm_cache
    if _llm_cache is not None:
        return _llm_cache

    if not settings.GROQ_API_KEY or "mock" in settings.GROQ_API_KEY.lower():
        logger.warning("GROQ_API_KEY is not set or is mock. Using smart mock responses.")
        return None

    logger.info(f"Initializing ChatGroq with model: {settings.GROQ_MODEL_NAME}")
    _llm_cache = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model_name=settings.GROQ_MODEL_NAME,
        temperature=0.3,
        streaming=True,
    )
    return _llm_cache
