'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Send, Paperclip, X, Loader2, MessageSquarePlus, MessageSquare } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { useUI } from '@/stores/ui'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const ALLOWED_EXTENSIONS = ['.txt', '.pdf', '.docx', '.csv']
const MAX_FILE_MB = 10

export default function ChatPage() {
  const {
    sessions, activeSessionId,
    loadSessions, createNewSession, switchSession,
    messages, sendMessage, isStreaming,
    error, clearError,
    uploadFile, isUploading,
  } = useUI()

  const [inputVal, setInputVal] = useState('')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const msgsEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load sessions when page loads
  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Message submit ──
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (pendingFile) {
      setPendingFile(null)
      await uploadFile(pendingFile)
      return
    }

    if (!inputVal.trim() || isStreaming || isUploading) return
    const userMsg = inputVal.trim()
    setInputVal('')
    sendMessage(userMsg)
  }, [inputVal, isStreaming, isUploading, pendingFile, sendMessage, uploadFile])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // ── File selection ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!e.target.files) return
    e.target.value = '' 
    if (!file) return

    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError(`Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`)
      return
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File too large. Max size: ${MAX_FILE_MB} MB`)
      return
    }

    setFileError(null)
    setPendingFile(file)
  }

  const clearPendingFile = () => {
    setPendingFile(null)
    setFileError(null)
  }

  const isBusy = isStreaming || isUploading
  const canSend = (inputVal.trim().length > 0 || pendingFile !== null) && !isBusy

  return (
    <div className="h-screen w-screen flex bg-[#090C10] text-[#E5E7EB] overflow-hidden grid grid-cols-[260px_1fr]">
      
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(',')}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload document"
      />

      {/* ── LEFT SIDEBAR (SESSIONS) ── */}
      <div className="bg-[#0D1117] border-r border-[#1F2937] flex flex-col">
        <div className="p-4 border-b border-[#1F2937] flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-[#F5C518] text-black font-extrabold flex items-center justify-center">L</div>
          </Link>
          <span className="text-sm font-semibold text-[#E5E7EB]">Chats</span>
          <button
            onClick={() => createNewSession()}
            disabled={isBusy}
            className="p-1.5 rounded-md hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors disabled:opacity-50"
            title="New Chat"
          >
            <MessageSquarePlus size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-[#1F2937] scrollbar-track-transparent">
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => switchSession(s.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200",
                activeSessionId === s.id 
                  ? "bg-[#1F2937] text-[#F3F4F6]" 
                  : "text-[#9CA3AF] hover:bg-[#161B22] hover:text-[#E5E7EB]"
              )}
            >
              <MessageSquare size={15} className="shrink-0" />
              <span className="truncate text-sm font-medium">{s.title || "New Chat"}</span>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className="px-3 py-4 text-xs text-center text-[#6B7280]">
               No past chats found.
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT MAIN CONTENT (CHAT) ── */}
      <div className="flex flex-col h-full relative">
        
        {/* Top Bar */}
        <div className="shrink-0 flex items-center px-6 py-4 border-b border-[#1F2937]/60">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[14px] text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="ml-auto flex items-center gap-2 bg-[#161B22] border border-[#1F2937] px-3 py-1.5 rounded-full">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[12px] text-[#D1D5DB] font-medium tracking-wide">Logam AI Active</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-24 xl:px-48 py-8 space-y-8 scrollbar-thin scrollbar-thumb-[#1F2937] scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 animate-in fade-in duration-500 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-xl border border-[#374151] bg-[#161B22] flex items-center justify-center text-[#F5C518]">
                <MessageSquare size={24} />
              </div>
              <div>
                <h2 className="text-xl font-medium text-[#F3F4F6] mb-2">How can I help you today?</h2>
                <p className="text-[15px] text-[#9CA3AF] leading-relaxed">
                  I'm your AI operating system. I can analyze campaign metrics, identify creative fatigue, or extract context from uploaded files.
                </p>
              </div>
              {/* Quick prompts */}
              <div className="flex flex-col w-full gap-2 mt-4">
                {["Why did ROAS drop this week?", "Check my ad accounts for creative fatigue", "Summarize client performance across the board"].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left px-4 py-3 text-[14px] rounded-lg border border-[#1F2937] bg-[#0D1117] text-[#D1D5DB] hover:bg-[#161B22] hover:border-[#374151] transition-all duration-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((m, idx) => {
            const isLastAssistant = m.role === 'assistant' && idx === messages.length - 1
            const isEmpty = m.content.length === 0

            return (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col w-full animate-in fade-in duration-300",
                  m.role === 'user' ? "items-end" : "items-start"
                )}
              >
                <span className="text-[11px] text-[#6B7280] mb-1.5 font-medium select-none tracking-wider uppercase ml-1 mr-1">
                  {m.role === 'user' ? 'You' : 'Logam AI'}
                </span>
                <div className={cn(
                  "px-5 py-4 text-[15px] leading-relaxed rounded-2xl whitespace-pre-wrap break-words shadow-sm",
                  m.role === 'user'
                    ? "bg-[#1F2937] text-[#E5E7EB] rounded-tr-sm max-w-[80%]"
                    : "bg-transparent text-[#D1D5DB] w-full max-w-4xl",
                  isEmpty && isLastAssistant && isBusy && "min-w-[64px] min-h-[48px] flex items-center justify-start bg-transparent px-2"
                )}>
                  {isEmpty && isLastAssistant && isBusy ? (
                    // Typing indicator
                    <div className="flex gap-1.5 p-3 rounded-xl bg-[#111827] border border-[#1F2937] w-fit">
                      <span className="w-2 h-2 bg-[#F5C518] rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both] [animation-delay:-0.32s]" />
                      <span className="w-2 h-2 bg-[#F5C518] rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both] [animation-delay:-0.16s]" />
                      <span className="w-2 h-2 bg-[#F5C518] rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both]" />
                    </div>
                  ) : m.content}
                </div>
              </div>
            )
          })}

          {/* Error banner */}
          {(error || fileError) && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-[14px] text-red-400 max-w-4xl animate-in slide-in-from-bottom-2">
              <p className="flex-1 leading-snug font-medium">{error || fileError}</p>
              <button
                onClick={() => { clearError(); setFileError(null) }}
                className="shrink-0 text-red-400/60 hover:text-red-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div ref={msgsEndRef} className="h-6" />
        </div>

        {/* INPUT AREA */}
        <div className="shrink-0 px-6 lg:px-24 xl:px-48 pb-8 pt-2">
           {/* PENDING FILE BADGE */}
          {pendingFile && (
            <div className="w-fit mb-3 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#374151] bg-[#161B22] text-[14px] text-[#D1D5DB] animate-in slide-in-from-bottom-2">
              <Paperclip size={16} className="text-[#9CA3AF] shrink-0" />
              <span className="truncate font-medium max-w-[200px]">{pendingFile.name}</span>
              <button
                onClick={clearPendingFile}
                className="shrink-0 text-[#6B7280] hover:text-[#F3F4F6] transition-colors p-0.5 ml-1"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={cn(
              "flex flex-col border rounded-xl overflow-hidden bg-[#0D1117] border-[#374151]",
              "transition-all duration-300 shadow-md",
              "focus-within:border-[#4B5563] focus-within:shadow-lg focus-within:bg-[#111827]"
            )}
          >
            <TextareaAutosize
              minRows={1}
              maxRows={8}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={pendingFile ? `Ask about "${pendingFile.name}"...` : "Message Logam AI..."}
              disabled={isBusy}
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-[#F3F4F6] text-[15.5px] resize-none leading-relaxed px-4 pt-4 pb-2 placeholder:text-[#6B7280] disabled:opacity-50"
            />
            
            <div className="flex items-center justify-between px-2 pb-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="p-2 text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1F2937] rounded-lg transition-all duration-150 shrink-0 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Upload document"
              >
                {isUploading ? (
                  <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                ) : (
                  <Paperclip size={18} strokeWidth={2.5} />
                )}
              </button>

              <button
                type="submit"
                disabled={!canSend}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200 shrink-0",
                  canSend 
                    ? "bg-[#F5C518] text-black hover:bg-[#E5B50A] shadow-sm transform hover:scale-[1.02] active:scale-[0.98]" 
                    : "bg-[#1F2937] text-[#6B7280] disabled:bg-[#1F2937] disabled:text-[#6B7280]/50"
                )}
              >
                {isStreaming ? (
                  <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                ) : (
                  <Send size={16} strokeWidth={2.5} className={cn(!canSend && "translate-x-[-1px] translate-y-[1px]")} />
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-[12px] text-[#6B7280] mt-3">
            Logam AI can make mistakes. Verify critical campaign metrics in Ad Manager.
          </p>
        </div>
      </div>
    </div>
  )
}
