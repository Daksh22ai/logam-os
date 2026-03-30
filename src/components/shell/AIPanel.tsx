'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Maximize2, Send, Sparkles } from 'lucide-react'
import { useUI } from '@/stores/ui'
import { cn } from '@/lib/utils'

export default function AIPanel() {
  const { aiPanelOpen, aiPanelFS, setAIPanelOpen, toggleAIFS, messages, addMessage, setAIPrompt, selectedWeek } = useUI()
  const [inputVal, setInputVal] = useState('')
  const msgsEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    if (msgsEndRef.current) {
      msgsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputVal.trim()) return

    const userMsg = inputVal.trim()
    setInputVal('')
    
    // Use simulated response for custom questions too
    setAIPrompt(
      userMsg,
      `I've analyzed the data regarding "${userMsg}". Current performance indicates stable trends, though you may want to monitor the latest ad set frequencies. Is there specific timeframe data you need?`
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestionClick = (promptText: string) => {
    setAIPrompt(
      promptText,
      `Analyzing Week ${selectedWeek || ''}... Based on the data, the deviation in Week ${selectedWeek || ''} was primarily driven by a drop in click-through rates on broad audiences. We recommend pausing fatigued creatives.`
    )
  }

  return (
    <div className={cn(
      "fixed right-0 top-0 bottom-0 bg-s1 border-l border-b1 flex flex-col transition-transform duration-200 ease-in-out z-50",
      aiPanelOpen ? "translate-x-0" : "translate-x-full",
      aiPanelFS ? "w-full" : "w-[340px]"
    )}>
      <div className="p-[12px_14px] border-b border-b1 flex items-center gap-[9px] shrink-0">
        <div className="w-[26px] h-[26px] bg-acc rounded-[var(--r6)] flex items-center justify-center text-[13px] shrink-0">✦</div>
        <div className="flex-1">
          <div className="font-display font-bold text-[13.5px]">Logam AI</div>
          <div className="text-[11px] text-grn flex items-center gap-1">
            <span className="w-[5px] h-[5px] rounded-full bg-grn inline-block" />
            Connected · Live data
          </div>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={toggleAIFS}
            className="w-[26px] h-[26px] rounded-[var(--r6)] border border-b1 bg-s2 text-t3 flex items-center justify-center transition-all duration-150 hover:bg-s3 hover:text-t1"
          >
            <Maximize2 size={12} />
          </button>
          <button 
            onClick={() => setAIPanelOpen(false)}
            className="w-[26px] h-[26px] rounded-[var(--r6)] border border-b1 bg-s2 text-t3 flex items-center justify-center transition-all duration-150 hover:bg-s3 hover:text-t1"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-4">
        <div className="flex flex-col gap-1 items-start">
          <span className="text-[10px] text-t4 px-1">Logam AI</span>
          <div className="max-w-[92%] p-[10px_14px] bg-s2 border border-b1 text-t1 rounded-[12px_12px_12px_3px] text-[13px] leading-relaxed">
            Hi Rishi 👋 I'm connected to your live campaign data. What would you like to know?
          </div>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={cn(
            "flex flex-col gap-1",
            m.role === 'user' ? "items-end" : "items-start"
          )}>
            <span className="text-[10px] text-t4 px-1">{m.role === 'user' ? 'You' : 'Logam AI'}</span>
            <div className={cn(
              "max-w-[92%] p-[10px_14px] rounded-[12px] text-[13px] leading-relaxed whitespace-pre-wrap",
              m.role === 'user' 
                ? "bg-s3 text-t1 rounded-tr-[3px]" 
                : "bg-s2 border border-b1 text-t1 rounded-tl-[3px]"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={msgsEndRef} />
      </div>

      <div className="p-[0_14px_8px] flex flex-wrap gap-1.5 shrink-0">
        {selectedWeek !== null ? (
          <>
            <button 
              onClick={() => handleSuggestionClick(`Why did performance change in Week ${selectedWeek}?`)}
              className="px-2.5 py-1 rounded-full border border-b1 bg-acc/10 text-acc text-[11.5px] font-medium transition-all duration-150 hover:border-acc/50 hover:bg-acc/20"
            >
              Analyze Week {selectedWeek} 🎯
            </button>
            <button 
              onClick={() => handleSuggestionClick(`Suggest optimizations for Week ${selectedWeek} performance.`)}
              className="px-2.5 py-1 rounded-full border border-b1 bg-s2 text-t2 text-[11.5px] transition-all duration-150 hover:border-acc3 hover:text-acc hover:bg-acc2"
            >
              Optimizations for Week {selectedWeek}
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => handleSuggestionClick('Why did ROAS drop?')}
              className="px-2.5 py-1 rounded-full border border-b1 bg-s2 text-t2 text-[11.5px] transition-all duration-150 hover:border-acc3 hover:text-acc hover:bg-acc2"
            >
              Why did ROAS drop?
            </button>
            <button 
              onClick={() => handleSuggestionClick('Creative fatigue check')}
              className="px-2.5 py-1 rounded-full border border-b1 bg-s2 text-t2 text-[11.5px] transition-all duration-150 hover:border-acc3 hover:text-acc hover:bg-acc2"
            >
              Creative fatigue check
            </button>
          </>
        )}
      </div>

      <div className="p-[10px_14px_14px] border-t border-b1 shrink-0 bg-s1 relative z-10">
        <form 
          onSubmit={handleSubmit}
          className="bg-s2 border border-b1 rounded-[var(--r10)] p-[9px_12px] flex items-end gap-2 focus-within:border-acc/35 transition-colors"
        >
          <textarea 
            rows={1} 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..." 
            className="flex-1 bg-transparent border-none outline-none text-t1 text-[13px] resize-none max-h-20 leading-relaxed py-1"
          />
          <button 
            type="submit"
            disabled={!inputVal.trim()}
            className="w-[30px] h-[30px] rounded-[var(--r8)] bg-acc flex items-center justify-center shrink-0 hover:bg-[#ffd235] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={13} color="black" strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  )
}
