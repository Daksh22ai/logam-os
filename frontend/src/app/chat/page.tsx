'use client'

import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { ArrowLeft, Send, Paperclip, X, Loader2, MessageSquarePlus, MessageSquare, Menu } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { useRouter } from 'next/navigation'
import { useUI } from '@/stores/ui'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const ALLOWED_EXTENSIONS = ['.txt', '.pdf', '.docx', '.csv']
const MAX_FILE_MB = 10

function ChatPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const {
    sessions, activeSessionId,
    loadSessions, createNewSession, switchSession,
    messages, sendMessage, isStreaming,
    error, clearError,
    uploadFile, isUploading,
    sidebarOpen, setSidebarOpen
  } = useUI()

  const [inputVal, setInputVal] = useState('')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const msgsEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load sessions when page loads
  useEffect(() => {
    loadSessions()
    // Default mobile sidebar to closed
    if (isMobile) setSidebarOpen(false)
  }, [loadSessions, isMobile, setSidebarOpen])

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
    <div className="h-screen w-screen flex bg-bg text-t1 overflow-hidden relative">
      
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(',')}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload document"
      />

      {/* Mobile Sidebar Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── LEFT SIDEBAR (SESSIONS) ── */}
      <div className={cn(
        "bg-s1 border-r border-b1 flex flex-col shrink-0 transition-transform duration-300 ease-[var(--transition-premium)] z-[70]",
        isMobile ? "fixed left-0 top-0 h-full w-[280px]" : "w-[260px]",
        isMobile && !sidebarOpen && "-translate-x-full"
      )}>
        <div className="h-[var(--header-height)] px-4 border-b border-b1 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Link href="/dashboard" className="w-8 h-8 rounded-lg bg-acc text-black font-extrabold flex items-center justify-center text-sm transition-transform hover:scale-105 active:scale-95">L</Link>
            <span className="text-sm font-bold tracking-tight">Chats</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { createNewSession(); if (isMobile) setSidebarOpen(false) }}
              disabled={isBusy}
              className="p-2 rounded-md hover:bg-s2 text-t3 hover:text-t1 transition-all disabled:opacity-50 active:scale-95"
              title="New Chat"
            >
              <MessageSquarePlus size={18} />
            </button>
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-t3 hover:text-t1"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-none">
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => { switchSession(s.id); if (isMobile) setSidebarOpen(false) }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 transform active:scale-[0.98]",
                activeSessionId === s.id 
                  ? "bg-s2 text-t1 shadow-sm ring-1 ring-b1" 
                  : "text-t3 hover:bg-s2/40 hover:text-t2"
              )}
            >
              <MessageSquare size={14} className="shrink-0 opacity-60" />
              <span className="truncate text-[13.5px] font-medium">{s.title || "New Chat"}</span>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className="px-3 py-8 text-xs text-center text-t4 italic">
               No past chats found.
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT MAIN CONTENT (CHAT) ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-bg">
        
        {/* Top Bar */}
        <div className="h-[var(--header-height)] shrink-0 flex items-center px-4 md:px-6 border-b border-b1/50 bg-bg/80 backdrop-blur-md z-40">
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 mr-2 rounded-md text-t3 hover:bg-s2 transition-colors"
            >
              <Menu size={18} />
            </button>
          )}

          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] text-t3 hover:text-t1 transition-opacity opacity-80 hover:opacity-100 group"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            <span className={cn(isMobile && "hidden")}>Back to Dashboard</span>
            <span className={cn(!isMobile && "hidden")}>Back</span>
          </button>

          <div className="ml-auto flex items-center gap-2 bg-s1/60 border border-b1 px-3 py-1.5 rounded-full shadow-sm scale-90 md:scale-100 origin-right">
             <div className="w-1.5 h-1.5 rounded-full bg-grn animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
             <span className="text-[11.5px] text-t2 font-semibold tracking-wide uppercase">AI Active</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-24 xl:px-48 py-6 md:py-10 space-y-8 scrollbar-thin">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5 animate-in fade-in duration-700 max-w-lg mx-auto pb-20">
              <div className="w-14 h-14 rounded-2xl border border-b1 bg-s1 flex items-center justify-center text-acc shadow-lg transform hover:rotate-3 transition-transform">
                <MessageSquare size={28} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-t1 tracking-tight">How can I help you?</h2>
                <p className="text-[15px] text-t3 leading-relaxed">
                  Analyze campaign metrics, identify creative fatigue, or extract context from files.
                </p>
              </div>
              {/* Quick prompts */}
              <div className="flex flex-col w-full gap-2.5 mt-4">
                {["Why did ROAS drop this week?", "Check ad accounts for fatigue", "Summarize client performance"].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left px-4 py-3.5 text-[14px] rounded-xl border border-b1 bg-s1/40 text-t2 hover:bg-s2 hover:border-b2 hover:text-t1 transition-all duration-200 shadow-sm active:scale-[0.99]"
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
                  "flex flex-col w-full animate-in fade-in slide-in-from-bottom-1 duration-400",
                  m.role === 'user' ? "items-end" : "items-start"
                )}
              >
                <span className="text-[10px] text-t4 mb-2 font-bold select-none tracking-[1.5px] uppercase ml-1 mr-1">
                  {m.role === 'user' ? 'You' : 'Logam AI'}
                </span>
                <div className={cn(
                  "px-5 py-4 text-[15px] leading-relaxed rounded-2xl whitespace-pre-wrap break-words shadow-sm transition-all",
                  m.role === 'user'
                    ? "bg-s3 text-t1 rounded-tr-[4px] max-w-[85%] border border-b1/30"
                    : "bg-transparent text-t2 w-full max-w-4xl border-none p-0 pt-1",
                  isEmpty && isLastAssistant && isBusy && "min-w-[70px] min-h-[50px] flex items-center justify-start bg-s1/30 rounded-xl px-4 py-3"
                )}>
                  {isEmpty && isLastAssistant && isBusy ? (
                    // Typing indicator
                    <div className="flex gap-1.5 p-1">
                      <span className="w-2 h-2 bg-acc/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-acc/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-acc/60 rounded-full animate-bounce" />
                    </div>
                  ) : m.content}
                </div>
              </div>
            )
          })}

          {/* Error banner */}
          {(error || fileError) && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-red/20 bg-red2 text-[14px] text-red max-w-4xl animate-in slide-in-from-bottom-2">
              <p className="flex-1 leading-snug font-medium">{error || fileError}</p>
              <button
                onClick={() => { clearError(); setFileError(null) }}
                className="shrink-0 text-red/60 hover:text-red transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div ref={msgsEndRef} className="h-10" />
        </div>

        {/* INPUT AREA */}
        <div className="shrink-0 px-4 md:px-8 lg:px-24 xl:px-48 pb-6 md:pb-10 pt-2 bg-gradient-to-t from-bg via-bg/95 to-transparent">
           {/* PENDING FILE BADGE */}
          {pendingFile && (
            <div className="w-fit mb-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-b2 bg-s2 text-[13.5px] text-t2 animate-in slide-in-from-bottom-2 shadow-lg">
              <Paperclip size={15} className="text-t3 shrink-0" />
              <span className="truncate font-semibold max-w-[150px] md:max-w-[250px]">{pendingFile.name}</span>
              <button
                onClick={clearPendingFile}
                className="shrink-0 text-t4 hover:text-t1 transition-colors p-1 ml-1"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={cn(
              "flex flex-col border rounded-2xl overflow-hidden bg-s1/60 border-b1 backdrop-blur-md transition-all duration-300 shadow-xl",
              "focus-within:border-b3 focus-within:bg-s1/80 group"
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
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-t1 text-[15px] md:text-[16px] resize-none leading-relaxed px-5 pt-4 pb-2 placeholder:text-t4 disabled:opacity-50 scrollbar-none"
            />
            
            <div className="flex items-center justify-between px-3 pb-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="p-2.5 text-t3 hover:text-t1 hover:bg-s2 rounded-xl transition-all duration-200 shrink-0 disabled:opacity-30 active:scale-90"
                title="Upload document"
              >
                {isUploading ? (
                  <Loader2 size={18} strokeWidth={2.2} className="animate-spin" />
                ) : (
                  <Paperclip size={18} strokeWidth={2.2} />
                )}
              </button>

              <button
                type="submit"
                disabled={!canSend}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-300 shrink-0 shadow-md",
                  canSend 
                    ? "bg-acc text-black hover:bg-[#ffd235] hover:scale-105 active:scale-95 shadow-[var(--shadow-glow)]" 
                    : "bg-s2 text-t4 opacity-40 cursor-not-allowed"
                )}
              >
                {isStreaming ? (
                  <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                ) : (
                  <Send size={18} strokeWidth={2.5} className={cn(!canSend && "translate-x-[-1px] opacity-50")} />
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-[11px] text-t4 mt-4 font-medium opacity-60">
            Logam AI can make mistakes. Verify campaign metrics in Ad Manager.
          </p>
        </div>
      </div>
    </div>
  )
}

export default memo(ChatPage)
