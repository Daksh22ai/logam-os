'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Send, Paperclip, X, Loader2, MessageSquarePlus, MessageSquare } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { useUI } from '@/stores/ui'
import { cn } from '@/lib/utils'

const ALLOWED_EXTENSIONS = ['.txt', '.pdf', '.docx', '.csv']
const MAX_FILE_MB = 10

export default function AIPanel() {
  const {
    aiPanelOpen, setAIPanelOpen,
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

  // Load sessions when panel opens
  useEffect(() => {
    if (aiPanelOpen) {
      loadSessions()
    }
  }, [aiPanelOpen, loadSessions])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Escape key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aiPanelOpen) setAIPanelOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [aiPanelOpen, setAIPanelOpen])

  // ── Message submit ──
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()

    // If a file is queued, upload it first
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
    e.target.value = '' // Reset so same file can be reselected
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
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(',')}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload document"
      />

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          aiPanelOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setAIPanelOpen(false)}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-label="Logam AI Chat"
        aria-modal="true"
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none transition-opacity duration-300",
          aiPanelOpen ? "opacity-100" : "opacity-0"
        )}
      >
        <div className={cn(
          "w-full max-w-5xl flex pointer-events-auto",
          "bg-[#090C10] border border-[#1F2937] rounded-xl shadow-2xl overflow-hidden",
          "h-[calc(100vh-60px)] max-h-[900px]",
          "transition-transform duration-300",
          aiPanelOpen ? "scale-100" : "scale-95",
          "grid grid-cols-[260px_1fr]"
        )}>

          {/* ── LEFT SIDEBAR (SESSIONS) ── */}
          <div className="bg-[#0D1117] border-r border-[#1F2937] flex flex-col">
            <div className="p-4 border-b border-[#1F2937] flex items-center justify-between">
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
            
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
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
          <div className="flex flex-col h-full relative bg-[#090C10]">
            
            {/* Top Bar */}
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-[#1F2937]/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAIPanelOpen(false)}
                  className="flex items-center justify-center p-1.5 -ml-1.5 rounded hover:bg-[#1F2937] text-[#6B7280] hover:text-[#E5E7EB] transition-colors duration-150"
                  aria-label="Close chat"
                >
                  <ArrowLeft size={16} strokeWidth={2} />
                </button>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-[#E5E7EB]">Logam AI</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/80 animate-pulse" />
                    <span className="text-[11px] text-[#6B7280] font-medium tracking-wide uppercase">Agent Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 animate-in fade-in duration-500">
                  <div className="w-12 h-12 rounded-xl border border-[#1F2937] bg-[#141A22] flex items-center justify-center text-[#6B7280]">
                    ✦
                  </div>
                  <div>
                    <h2 className="text-[19px] font-medium text-[#F3F4F6] mb-1">How can I help you today?</h2>
                    <p className="text-[14px] text-[#6B7280] max-w-sm">
                      Connected to your campaign intelligence. Ask about metrics, or upload a document for analysis.
                    </p>
                  </div>
                  {/* Quick prompts */}
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {["Why did ROAS drop?", "Check creative fatigue", "Summarize client performance"].map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="px-3.5 py-2 text-[13px] rounded-lg border border-[#1F2937] text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#374151] hover:bg-[#161B22] transition-all duration-200"
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
                      "max-w-[85%] px-4 py-3.5 text-[15px] leading-relaxed rounded-xl whitespace-pre-wrap break-words shadow-sm",
                      m.role === 'user'
                        ? "bg-[#1F2937]/50 border border-[#374151] text-[#E5E7EB]"
                        : "bg-[#111827] border border-[#1F2937] text-[#D1D5DB]",
                      isEmpty && isLastAssistant && isBusy && "min-w-[64px] min-h-[48px] flex items-center justify-center bg-transparent border-none shadow-none px-0"
                    )}>
                      {isEmpty && isLastAssistant && isBusy ? (
                        // Typing indicator
                        <div className="flex gap-1.5 p-3 rounded-xl bg-[#111827] border border-[#1F2937]">
                          <span className="w-2 h-2 bg-[#4B5563] rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both] [animation-delay:-0.32s]" />
                          <span className="w-2 h-2 bg-[#4B5563] rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both] [animation-delay:-0.16s]" />
                          <span className="w-2 h-2 bg-[#4B5563] rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both]" />
                        </div>
                      ) : m.content}
                    </div>
                  </div>
                )
              })}

              {/* Error banner */}
              {(error || fileError) && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-[14px] text-red-400 animate-in slide-in-from-bottom-2">
                  <p className="flex-1 leading-snug font-medium">{error || fileError}</p>
                  <button
                    onClick={() => { clearError(); setFileError(null) }}
                    className="shrink-0 text-red-400/60 hover:text-red-300 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div ref={msgsEndRef} className="h-4" />
            </div>

            {/* PENDING FILE BADGE */}
            {pendingFile && (
              <div className="shrink-0 mx-6 mb-3 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#374151] bg-[#161B22] text-[14px] text-[#D1D5DB] animate-in slide-in-from-bottom-2">
                <Paperclip size={16} className="text-[#9CA3AF] shrink-0" />
                <span className="flex-1 truncate font-medium">{pendingFile.name}</span>
                <button
                  onClick={clearPendingFile}
                  className="shrink-0 text-[#6B7280] hover:text-[#F3F4F6] transition-colors p-0.5"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* INPUT */}
            <div className="shrink-0 px-6 pb-6 pt-2">
              <form
                onSubmit={handleSubmit}
                className={cn(
                  "flex items-end gap-2 border rounded-xl pl-3 pr-2.5 py-2.5",
                  "bg-[#0D1117] border-[#374151]",
                  "transition-all duration-300 shadow-sm",
                  "focus-within:border-[#4B5563] focus-within:bg-[#161B22] focus-within:shadow-md"
                )}
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isBusy}
                  className="p-2 text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1F2937] rounded-lg transition-all duration-150 shrink-0 mb-0.5 disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Upload document"
                >
                  {isUploading ? (
                    <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                  ) : (
                    <Paperclip size={18} strokeWidth={2.5} />
                  )}
                </button>

                <TextareaAutosize
                  minRows={1}
                  maxRows={6}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={pendingFile ? `Ask about "${pendingFile.name}"...` : "Message Logam AI..."}
                  disabled={isBusy}
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[#F3F4F6] text-[15px] resize-none leading-relaxed py-1.5 px-2 placeholder:text-[#6B7280] disabled:opacity-50 my-auto"
                />

                <button
                  type="submit"
                  disabled={!canSend}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200 shrink-0 mb-0.5",
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
              </form>

              <p className="text-center text-[12px] text-[#6B7280] mt-3">
                Logam AI can make mistakes. Verify critical campaign metrics in Ad Manager.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
