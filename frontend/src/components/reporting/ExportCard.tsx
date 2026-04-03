'use client'

import React, { useState } from 'react'
import { FileDown, Globe, Mail, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ExportCard() {
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSend = () => {
    setSent(true)
    setTimeout(() => setSent(false), 2000)
  }
  return (
    <div className="bg-s1 border border-b1 rounded-[var(--r12)] p-6 mt-8 flex flex-col md:flex-row items-center gap-6">
      <div className="w-14 h-14 bg-s2 rounded-[var(--r10)] flex items-center justify-center text-acc shrink-0 border border-b1">
        <FileDown size={28} />
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-[16px] font-bold mb-1">Ready to deliver the results?</h3>
        <p className="text-[13px] text-t3 leading-relaxed max-w-[480px]">
          Generate a professional, white-labelled report with AI-written insights. 
          Your client will see a branded portal or a PDF summary, depending on your preference.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
        <button 
          onClick={handleCopy}
          className={cn(
            "flex items-center justify-center gap-2 px-[18px] py-[9px] rounded-[var(--r8)] border border-b1 text-[13px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 active:scale-95",
            copied ? "bg-grn/10 text-grn border-grn/30" : "bg-s2 text-t1 hover:bg-s3 hover:border-b2"
          )}
        >
          {copied ? <Check size={14} /> : <Globe size={14} />}
          {copied ? 'Link Copied!' : 'Client Portal Link'}
        </button>
        <button 
          onClick={handleSend}
          className={cn(
            "flex items-center justify-center gap-2 px-[18px] py-[9px] rounded-[var(--r8)] text-[13px] font-bold transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 active:scale-95",
            sent ? "bg-grn text-black hover:bg-grn" : "bg-acc text-black hover:bg-[#ffd235]"
          )}
        >
          {sent ? <Check size={14} /> : <Mail size={14} />}
          {sent ? 'Sent successfully' : 'Send via Email'}
        </button>
      </div>
    </div>
  )
}
