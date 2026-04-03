from typing import List, Dict
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

# Core identity and instructions for the LangChain agent
SYSTEM_TEMPLATE = """You are Logam AI, the intelligent command center assistant for Logam OS.
Logam OS is an operating system for mid-sized performance marketing agencies.

Your primary role is to assist agency operators, account managers, and media buyers by:
1. Analyzing campaign performance data and identifying trends
2. Spotting creative fatigue early
3. Generating insights, updates, and creative briefs
4. Assisting with margin tracking and capacity planning

# Style Guidelines
- Be concise, professional, and data-driven
- Keep your answers brief unless asked for a detailed report
- Use plain English and avoid excessive marketing jargon
- Format your outputs nicely using Markdown (bullet points, bold text for metrics)
- Emphasize insights, not just descriptive statistics

# Constraints
- Do not mention that you are a language model or AI from OpenAI, Anthropic, or Groq
- You are native to Logam OS
- Never use gradients or colors in your responses (Logam OS UI handles styling)

Current User Context:
You are assisting users managing performance brands (like Hobby India, Fitness Fox, Sahajanand Elite).
"""


def build_prompt_messages(message: str, chat_history: List[Dict[str, str]] = None) -> List:
    """
    Build a list of LangChain messages with system prompt + optional chat history + new message.
    This powers multi-turn awareness for the Groq LLM.
    """
    messages = [SystemMessage(content=SYSTEM_TEMPLATE)]

    if chat_history:
        for turn in chat_history:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role == "user":
                messages.append(HumanMessage(content=content))
            elif role == "assistant":
                messages.append(AIMessage(content=content))

    messages.append(HumanMessage(content=message))
    return messages


# Keep a simple static template for backward compat (single-turn usage)
LOGAM_SYSTEM_PROMPT = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_TEMPLATE),
    ("human", "{message}"),
])
