'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CreativeCardProps {
  name: string
  hook: string
  emoji: string
  bg: string
  ctr: string
  roas: string
  freq: string
  fatigue: string
  fstatus: 'grn' | 'red' | 'blu' | 'orn'
}

export default function CreativeCard({ name, hook, emoji, bg, ctr, roas, freq, fatigue, fstatus }: CreativeCardProps) {
  return (
    <div className="bg-s1 border border-b1 rounded-[var(--r10)] overflow-hidden cursor-pointer transition-all duration-180 hover:border-b2 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
      <div 
        className="h-[130px] flex items-center justify-center text-[32px] border-b border-b1 relative"
        style={{ backgroundColor: bg }}
      >
        {emoji}
        <span className={cn(
          "absolute top-1.5 right-1.5 text-[9px] font-bold px-[7px] py-[2px] rounded-[10px]",
          fstatus === 'grn' ? "bg-grn2 text-grn" : 
          fstatus === 'red' ? "bg-red2 text-red" : 
          fstatus === 'blu' ? "bg-blu2 text-blu" : "bg-orn2 text-orn"
        )}>
          {fatigue}
        </span>
      </div>
      
      <div className="p-2.75">
        <div className="text-[12.5px] font-semibold mb-0.5 truncate">{name}</div>
        <div className="text-[11px] text-t3 mb-2 truncate">{hook}</div>
        <div className="flex gap-1.25 flex-wrap">
          <span className={cn(
            "text-[10.5px] px-[6px] py-[2px] rounded-[4px] font-bold",
            parseFloat(ctr) > 3 ? "bg-grn2 text-grn" : "bg-orn2 text-orn"
          )}>
            CTR {ctr}
          </span>
          <span className={cn(
            "text-[10.5px] px-[6px] py-[2px] rounded-[4px] font-bold",
            parseFloat(roas) > 6 ? "bg-grn2 text-grn" : parseFloat(roas) > 4 ? "bg-acc2 text-acc" : "bg-red2 text-red"
          )}>
            ROAS {roas}
          </span>
          <span className={cn(
            "text-[10.5px] px-[6px] py-[2px] rounded-[4px] font-bold",
            parseFloat(freq) > 4 ? "bg-red2 text-red" : parseFloat(freq) > 2.5 ? "bg-orn2 text-orn" : "bg-s3 text-t3"
          )}>
            Freq {freq}
          </span>
        </div>
      </div>
    </div>
  )
}
