'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'

interface PatternRowProps {
  rank: number
  desc: string
  stat: string
}

const PatternRow = ({ rank, desc, stat }: PatternRowProps) => (
  <div className="flex items-start gap-2.5 py-2 border-b border-b1 last:border-none group">
    <div className="w-5 h-5 rounded-full bg-acc2 text-acc flex items-center justify-center text-[10px] font-bold shrink-0 font-display transition-transform group-hover:scale-110">
      {rank}
    </div>
    <div className="flex-1 text-[13px] text-t1 leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
    <div className="text-[12px] font-mono text-grn font-semibold whitespace-nowrap pt-px">{stat}</div>
  </div>
)

export default function CreativePatternCard({ brandName }: { brandName: string }) {
  return (
    <div className="bg-s1 border border-b1 rounded-[var(--r10)] p-4 mb-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-[5px] bg-acc2 border border-acc/20 color-acc text-[10.5px] font-bold px-[9px] py-[3px] rounded-[14px] uppercase tracking-[0.6px] text-acc">
          <Sparkles size={10} />
          ✦ CREATIVE INTELLIGENCE
        </div>
        <span className="text-[12px] text-t3 ml-2">Patterns from {brandName}&apos;s creative history</span>
      </div>

      <p className="text-[13px] text-t2 mb-3.5 leading-relaxed">
        AI identifies which hooks, angles, and formats work best for <strong className="text-t1">{brandName}&apos;s specific audience</strong> — eliminating guesswork for your creative team.
      </p>

      <div className="flex flex-col">
        <PatternRow 
          rank={1} 
          desc="<strong>Problem-agitate-solve hooks</strong> outperform all other types for this audience. Avg CTR 3.8% vs 2.1%." 
          stat="+81% CTR" 
        />
        <PatternRow 
          rank={2} 
          desc="<strong>Short video (8–14s)</strong> outperforms static images 2.4:1 on ROAS for this ICP." 
          stat="2.4× ROAS" 
        />
        <PatternRow 
          rank={3} 
          desc="<strong>Frequency above 4×</strong> consistently signals performance degradation within 5 days." 
          stat="Predict 5 days early" 
        />
        <PatternRow 
          rank={4} 
          desc="<strong>&apos;Order Now&apos; CTA</strong> outperforms &apos;Shop Now&apos; by 18% for purchase conversions." 
          stat="+18% conv rate" 
        />
      </div>
    </div>
  )
}
