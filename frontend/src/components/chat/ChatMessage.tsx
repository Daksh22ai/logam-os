'use client'

import React from 'react'
import { MoreHorizontal, Reply, Pin } from 'lucide-react'

interface ChatMessageProps {
  n: string
  i: string
  c: string
  bg: string
  time: string
  text: string
  reply?: string
  reactions?: string[]
  images?: boolean
}

export default function ChatMessage({ n, i, c, bg, time, text, reply, reactions, images }: ChatMessageProps) {
  return (
    <div className="flex gap-2.5 py-1 rounded-[var(--r6)] transition-colors duration-100 relative group hover:bg-white/[0.015]">
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 font-display"
        style={{ backgroundColor: bg, color: c }}
      >
        {i}
      </div>
      
      <div className="flex-1 min-w-0 pr-9">
        <div className="flex items-baseline gap-1.75 mb-0.5">
          <span className="text-[13.5px] font-semibold" style={{ color: c }}>{n}</span>
          <span className="text-[11px] text-t3">{time}</span>
        </div>

        {reply && (
          <div className="text-[11px] text-t3 p-[3px_0_3px_12px] border-l-2 border-b2 mb-1 truncate">
            {reply}
          </div>
        )}

        <div className="text-[13.5px] text-t2 leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />

        {images && (
          <div className="flex gap-1.75 mt-1.75">
            <div className="w-[100px] h-[68px] rounded-[var(--r8)] bg-s3 border border-b1 flex items-center justify-center text-[22px]">🎨</div>
            <div className="w-[100px] h-[68px] rounded-[var(--r8)] bg-s3 border border-b1 flex items-center justify-center text-[22px]">📱</div>
            <div className="w-[100px] h-[68px] rounded-[var(--r8)] bg-s3 border border-b1 flex items-center justify-center text-[22px]">🖼️</div>
          </div>
        )}

        {reactions && reactions.length > 0 && (
          <div className="flex gap-1 mt-1.25 flex-wrap">
            {reactions.map((r, idx) => (
              <div key={idx} className="flex items-center gap-0.75 bg-s3 border border-b2 rounded-[10px] p-[1px_7px] text-[12px] cursor-pointer transition-all hover:border-acc3 hover:bg-acc2 group/react">
                {r.split(' ')[0]}
                <span className="text-[11.5px] text-t2 font-semibold group-hover/react:text-acc">{r.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute right-0 -top-2 bg-s2 border border-b1 rounded-[var(--r6)] flex gap-0.5 p-0.75 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button className="w-6.5 h-6.5 rounded-[var(--r4)] text-t3 flex items-center justify-center hover:bg-s3 hover:text-t1 transition-all"><Reply size={12} /></button>
        <button className="w-6.5 h-6.5 rounded-[var(--r4)] text-t3 flex items-center justify-center hover:bg-s3 hover:text-t1 transition-all"><Pin size={12} /></button>
        <button className="w-6.5 h-6.5 rounded-[var(--r4)] text-t3 flex items-center justify-center hover:bg-s3 hover:text-t1 transition-all"><MoreHorizontal size={12} /></button>
      </div>
    </div>
  )
}
