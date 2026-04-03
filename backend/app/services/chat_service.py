import json
import logging
import asyncio
from typing import List, Dict, Optional

from app.chatbot.chain import get_chat_chain
from app.chatbot.prompts import build_prompt_messages
from app.config import settings

logger = logging.getLogger(__name__)


# ── Mock responses ──────────────────────────────────────────────────────────

def _get_mock_response(message: str) -> str:
    msg = message.lower()
    if any(w in msg for w in ['roas', 'return', 'revenue']):
        return (
            "Based on the campaign data I can see, **ROAS is holding at 7.2×** this week — "
            "above the 5.5× account benchmark. The primary driver is the 'Do kids get bored?' hook "
            "which is converting at 34% above average. However, I'm detecting early fatigue signals "
            "on the 'DIY Canvas' ad set: frequency has crossed 4.8× and CTR dropped from 4.1% to 1.8% "
            "over the last 6 days. I'd recommend launching a fresh creative hook by Wednesday to "
            "sustain the current ROAS trajectory.\n\n"
            "> 💡 *Add your Groq API key to `backend/.env` to enable real AI analysis.*"
        )
    elif any(w in msg for w in ['cpl', 'lead', 'cost per']):
        return (
            "**CPL is currently at ₹380** — up 12% vs last month. The retargeting audience "
            "is performing best at ₹185 CPL, while the broad audience traffic campaign is "
            "pulling the average up at ₹680 CPL. I'd suggest pausing the 'Awareness — Cold "
            "Interest' campaign and reallocating that 10% budget to the retargeting pool.\n\n"
            "> 💡 *Add your Groq API key to `backend/.env` to enable real AI analysis.*"
        )
    elif any(w in msg for w in ['fatigue', 'frequency', 'creative']):
        return (
            "**Creative fatigue detected on 2 active ad sets.** The 'DIY Canvas' set has hit "
            "frequency 4.8× with CTR declining 56% over 6 days — classic fatigue pattern. "
            "The 'Main Offer — Broad Audience' set is at 2.4×, still healthy. "
            "My recommendation: pause DIY Canvas immediately, brief a new hook variant "
            "using the 'curiosity' angle (historically your best CTR driver at this ICP), "
            "and launch by Wednesday to avoid a ROAS dip before the month-end report.\n\n"
            "> 💡 *Add your Groq API key to `backend/.env` to enable real AI analysis.*"
        )
    elif any(w in msg for w in ['report', 'client', 'summary', 'send']):
        return (
            "Here's a **client-ready performance summary** for Hobby India:\n\n"
            "This week's performance has been strong — ROAS is holding at 7.2×, "
            "well above our 5.5× target. Total spend was ₹2.4L with 248K impressions "
            "and a 3.8% CTR. The 'Do kids get bored?' hook is outperforming all "
            "previous creatives by 34%.\n\n"
            "One area to flag: we're seeing early fatigue on one of the older ad sets "
            "and we're already preparing fresh creatives to launch this week. "
            "This is a normal part of proactive campaign management — no action needed from your side.\n\n"
            "> 💡 *Add your Groq API key to `backend/.env` for fully AI-generated client summaries.*"
        )
    elif any(w in msg for w in ['alert', 'warning', 'problem', 'issue', 'down', 'drop']):
        return (
            "I'm currently tracking **2 active alerts** across your accounts:\n\n"
            "🔴 **Critical — Hobby India**: Creative fatigue on 'DIY Canvas' ad set. "
            "Frequency at 4.8×, CTR dropped 56% in 6 days. Action required by Wednesday.\n\n"
            "🟡 **Warning — Fitness Fox**: ROAS dropped from 5.8× to 5.1× week-over-week. "
            "Best hypothesis: iOS 14 attribution window mismatch. Recommend checking "
            "campaign attribution settings and comparing 7-day click vs 1-day view.\n\n"
            "> 💡 *Add your Groq API key to `backend/.env` for real-time AI monitoring.*"
        )
    else:
        return (
            f"I'm Logam AI, connected to your agency dashboard. "
            f"You asked: *\"{message}\"*\n\n"
            f"I can help you with campaign performance analysis, creative fatigue detection, "
            f"client health scoring, report generation, and team insights. "
            f"Try asking me: 'Why did ROAS drop?', 'Check for creative fatigue', "
            f"or 'Prepare the client summary for Hobby India'.\n\n"
            f"> 💡 *Add your Groq API key to `backend/.env` for full LangChain + Groq AI capabilities.*"
        )


# ── Main service functions ────────────────────────────────────────────────

async def process_message(message: str, chat_history: Optional[List[Dict]] = None) -> str:
    """Non-streaming: process a chat message, respecting chat_history for multi-turn context."""
    use_mock = not settings.GROQ_API_KEY or "mock" in settings.GROQ_API_KEY.lower()

    if use_mock:
        logger.info("Using smart mock AI response.")
        return _get_mock_response(message)

    llm = get_chat_chain()
    if llm is None:
        return _get_mock_response(message)

    try:
        msgs = build_prompt_messages(message, chat_history or [])
        result = await llm.ainvoke(msgs)
        # AIMessage → extract .content
        return result.content if hasattr(result, "content") else str(result)
    except Exception as e:
        logger.warning(f"LLM call failed, falling back to mock: {e}")
        return _get_mock_response(message)


async def stream_message(message: str, chat_history: Optional[List[Dict]] = None):
    """Streaming: yields SSE-formatted data events, respecting chat_history."""
    use_mock = not settings.GROQ_API_KEY or "mock" in settings.GROQ_API_KEY.lower()

    # ── Mock path ──
    if use_mock:
        logger.info("Using smart mock AI streaming response.")
        mock_response = _get_mock_response(message)
        words = mock_response.split(" ")
        for i, word in enumerate(words):
            sep = " " if i < len(words) - 1 else ""
            yield f"data: {json.dumps({'text': word + sep})}\n\n"
            delay = 0.06 if any(c in word for c in '.!?,\n') else 0.03
            await asyncio.sleep(delay)
        yield "data: [DONE]\n\n"
        return

    # ── Real LLM path ──
    llm = get_chat_chain()
    if llm is None:
        logger.info("No valid chain, using mock streaming.")
        async for event in _mock_stream(_get_mock_response(message)):
            yield event
        return

    try:
        msgs = build_prompt_messages(message, chat_history or [])
        async for chunk in llm.astream(msgs):
            # AIMessageChunk → .content is the token text
            text = chunk.content if hasattr(chunk, "content") else str(chunk)
            if text:
                yield f"data: {json.dumps({'text': text})}\n\n"
        yield "data: [DONE]\n\n"
    except Exception as e:
        logger.warning(f"LLM stream failed, falling back to mock: {e}")
        async for event in _mock_stream(_get_mock_response(message)):
            yield event


async def _mock_stream(mock_response: str):
    """Helper: stream a pre-built string as SSE word-by-word."""
    words = mock_response.split(" ")
    for i, word in enumerate(words):
        sep = " " if i < len(words) - 1 else ""
        yield f"data: {json.dumps({'text': word + sep})}\n\n"
        await asyncio.sleep(0.03)
    yield "data: [DONE]\n\n"
