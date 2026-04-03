'use client'

import React from 'react'
import { Search } from 'lucide-react'

export default function LandingHeader() {
  return (
    <header className="px-8 h-14 flex items-center gap-3 border-b border-b1 shrink-0 bg-bg/90 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-[9px] font-display font-bold text-[17px] tracking-[-0.4px]">
        <div className="w-[30px] h-[30px] bg-acc rounded-[7px] flex items-center justify-center text-black font-extrabold text-[13px]">
          L
        </div>
        Logam OS
      </div>
      
      <div className="flex-1 max-w-[380px] mx-auto relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-t3" />
        <input 
          type="text" 
          placeholder="Search brands, campaigns, clients…" 
          className="w-full bg-s2 border border-b1 rounded-[var(--r8)] p-[7px_12px_7px_34px] text-t1 text-[13px] outline-none transition-colors duration-150 focus:border-b2 placeholder:text-t3"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-[10px] p-[3px_9px] bg-acc2 text-acc rounded-[20px] border border-acc3 font-semibold tracking-[0.4px]">
          ✦ PREVIEW
        </span>
        <div className="w-[30px] h-[30px] rounded-full bg-acc2 border border-acc3 flex items-center justify-center font-display font-bold text-[12px] text-acc">
          R
        </div>
      </div>
    </header>
  )
}
