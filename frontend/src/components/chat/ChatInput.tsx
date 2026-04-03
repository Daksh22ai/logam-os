'use client'

import React from 'react'
import { Paperclip, Smile, Send } from 'lucide-react'

interface ChatInputProps {
  placeholder: string
}

export default function ChatInput({ placeholder }: ChatInputProps) {
  return (
    <div className="p-[8px_0_0] shrink-0 border-t border-b1">
      <div className="bg-s2 border border-b1 rounded-[var(--r10)] p-[8px_12px] flex items-end gap-2 transition-colors focus-within:border-b2">
        <div className="flex gap-1 items-center mb-0.5">
          <button className="w-7 h-7 rounded-[var(--r6)] border-none bg-transparent text-t3 flex items-center justify-center transition-all hover:bg-s3 hover:text-t1">
            <Paperclip size={14} />
          </button>
          <button className="w-7 h-7 rounded-[var(--r6)] border-none bg-transparent text-t3 flex items-center justify-center transition-all hover:bg-s3 hover:text-t1">
            <Smile size={14} />
          </button>
        </div>
        
        <textarea 
          rows={1} 
          placeholder={`Message ${placeholder}...`} 
          className="flex-1 bg-transparent border-none outline-none text-t1 text-[13.5px] resize-none max-h-[100px] leading-relaxed p-[2px_0]"
        />

        <button className="w-[30px] h-[30px] rounded-[var(--r8)] bg-acc flex items-center justify-center shrink-0 transition-colors hover:bg-[#ffd235]">
          <Send size={13} color="black" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
