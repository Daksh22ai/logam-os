import os
import json
import logging
from typing import TypedDict, Annotated, List, Union, Dict
from datetime import datetime

from langchain_groq import ChatGroq
from langchain_community.tools.ddg_search.tool import DuckDuckGoSearchRun
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END, START
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

from app.config import settings
from app.chatbot.prompts import SYSTEM_TEMPLATE

logger = logging.getLogger(__name__)

# ── Environment Checks ──────────────────────────────────────────────────────
HAS_PINECONE = settings.HAS_PINECONE
HAS_GEMINI = settings.HAS_GEMINI

# ── Tools ──────────────────────────────────────────────────────────────────

@tool
def web_search(query: str):
    """Search the web for the latest information using DuckDuckGo."""
    search = DuckDuckGoSearchRun()
    return search.run(query)

@tool
def rag_tool(query: str):
    """Retrieve relevant information from uploaded files/documents. 
    Use this when the user asks about specific file-based context or uploaded documents."""
    if not HAS_PINECONE or not HAS_GEMINI:
        return "File-based analysis is not available in demo mode. Please configure PINECONE_API_KEY and GOOGLE_API_KEY."
    
    # RAG implementation logic (placeholder for Pinecone)
    # This would normally query the vector store
    return "Searching documents... (Mocked RAG response. Connect Pinecone to enable.)"

# ── Agent State ─────────────────────────────────────────────────────────────

class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], lambda x, y: x + y]

# ── Agent Logic ─────────────────────────────────────────────────────────────

def get_model():
    if not settings.GROQ_API_KEY or "mock" in settings.GROQ_API_KEY.lower():
        return None
    
    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model_name=settings.GROQ_MODEL_NAME,
        temperature=0.3,
        streaming=True,
    )

def call_model(state: AgentState):
    messages = state['messages']
    model = get_model()
    
    if model is None:
        # Fallback to mock logic if no model
        last_msg = messages[-1].content
        from app.services.chat_service import _get_mock_response
        return {"messages": [AIMessage(content=_get_mock_response(last_msg))]}
    
    # Bind tools based on availability
    tools = [web_search]
    if HAS_PINECONE:
        tools.append(rag_tool)
    
    model_with_tools = model.bind_tools(tools)
    response = model_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState):
    messages = state['messages']
    last_message = messages[-1]
    if last_message.tool_calls:
        return "tools"
    return END

# ── Graph Construction ──────────────────────────────────────────────────────

def create_agent_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("agent", call_model)
    
    # Define tool node
    tools = [web_search]
    if HAS_PINECONE:
        tools.append(rag_tool)
    
    tool_node = ToolNode(tools)
    workflow.add_node("tools", tool_node)
    
    # Set edges
    workflow.add_edge(START, "agent")
    workflow.add_conditional_edges(
        "agent",
        should_continue,
    )
    workflow.add_edge("tools", "agent")
    
    # Compile with memory
    memory = MemorySaver()
    return workflow.compile(checkpointer=memory)

# Global graph instance
app_graph = create_agent_graph()

# ── Service Wrapper ────────────────────────────────────────────────────────

async def run_agent(message: str, chat_history: List[Dict] = None, session_id: str = "default"):
    """Entry point for the LangGraph agent."""
    
    # Format messages
    history_msgs = []
    if chat_history:
        for turn in chat_history:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role == "user":
                history_msgs.append(HumanMessage(content=content))
            elif role == "assistant":
                history_msgs.append(AIMessage(content=content))
                
    messages = [SystemMessage(content=SYSTEM_TEMPLATE)] + history_msgs + [HumanMessage(content=message)]
    
    config = {"configurable": {"thread_id": session_id}}
    
    # Run the graph
    # For now we use the async version
    # Note: langgraph streaming is complex, we might want to start with non-streaming
    # or handle it in the service layer
    
    final_state = await app_graph.ainvoke({"messages": messages}, config)
    return final_state["messages"][-1].content

async def stream_agent(message: str, chat_history: List[Dict] = None, session_id: str = "default"):
    """Streaming entry point for the LangGraph agent."""
    
    # Similar to run_agent but yields chunks
    # For a production-ready streaming implementation with LangGraph tools:
    # we need to handle tool call outputs and then stream the final response.
    
    # For now, let's keep it simple and handle the logic in chat_service
    # Or implement a basic astream loop
    
    history_msgs = []
    if chat_history:
        for turn in chat_history:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role == "user":
                history_msgs.append(HumanMessage(content=content))
            elif role == "assistant":
                history_msgs.append(AIMessage(content=content))
                
    messages = [SystemMessage(content=SYSTEM_TEMPLATE)] + history_msgs + [HumanMessage(content=message)]
    config = {"configurable": {"thread_id": session_id}}
    
    # Use standard LLM streaming if no tool calls are detected initially
    # Or just use the graph and handle output events
    
    async for event in app_graph.astream_events({"messages": messages}, config, version="v2"):
        kind = event["event"]
        if kind == "on_chat_model_stream":
            content = event["data"]["chunk"].content
            if content:
                yield content
