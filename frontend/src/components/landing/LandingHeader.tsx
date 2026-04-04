'use client'

import React, { memo } from 'react'
import { Search } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

function LandingHeader() {
  const isMobile = useIsMobile()

  return (
    <header className="px-4 md:px-8 h-14 flex items-center gap-4 border-b border-b1 shrink-0 bg-bg/85 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-2.5 font-bold text-[17px] tracking-tight shrink-0">
        <div className="w-8 h-8 md:w-[32px] md:h-[32px] bg-acc rounded-lg flex items-center justify-center text-black font-black text-[13px] shadow-[var(--shadow-glow)]">
          L
        </div>
        <span className={cn("transition-opacity", isMobile ? "hidden" : "block")}>Logam OS</span>
      </div>
      
      <div className="flex-1 max-w-[420px] mx-auto relative group">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-t4 group-focus-within:text-acc transition-colors" />
        <input 
          type="text" 
          placeholder={isMobile ? "Search..." : "Search brands, campaigns, clients…"} 
          className="w-full bg-s2/50 border border-b1 rounded-xl py-2 pl-10 pr-4 text-t1 text-[13.5px] outline-none transition-all duration-300 focus:border-acc/40 focus:bg-s2 focus:ring-1 focus:ring-acc/10 placeholder:text-t4 shadow-sm"
        />
      </div>

      <div className="flex items-center gap-2.5 ml-auto shrink-0">
        {!isMobile && (
          <span className="text-[10px] px-2.5 py-1 bg-acc/10 text-acc rounded-full border border-acc/20 font-black tracking-widest uppercase">
            ✦ PREVIEW
          </span>
        )}
        <div className="w-8 h-8 rounded-full bg-s2 border border-b1 flex items-center justify-center font-bold text-[12px] text-acc shadow-inner transition-transform hover:scale-105 active:scale-95 cursor-pointer">
          R
        </div>
      </div>
    </header>
  )
}

export default memo(LandingHeader)
