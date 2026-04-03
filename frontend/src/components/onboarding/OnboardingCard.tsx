'use client'

import React, { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingItem {
  id: number
  text: string
  tag: string
  done: boolean
}

export default function OnboardingCard({ brandName }: { brandName: string }) {
  const [items, setItems] = useState<OnboardingItem[]>([
    { id: 1, done: true, text: 'Meta Business Manager access granted', tag: 'API' },
    { id: 2, done: true, text: 'Google Ads account connected', tag: 'API' },
    { id: 3, done: true, text: 'Pixel / tracking verification completed', tag: 'Tech' },
    { id: 4, done: true, text: 'CRM integration configured', tag: 'Tech' },
    { id: 5, done: true, text: 'Brand guidelines received', tag: 'Creative' },
    { id: 6, done: false, text: 'Historical campaign data imported (90 days)', tag: 'Data' },
    { id: 7, done: false, text: 'KPI targets confirmed with client', tag: 'Strategy' },
    { id: 8, done: false, text: 'Reporting schedule agreed (weekly/monthly)', tag: 'Ops' },
    { id: 9, done: false, text: 'WhatsApp communication channel set up', tag: 'Comms' },
    { id: 10, done: false, text: 'Kickoff call completed', tag: 'Client' },
  ])

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item))
  }

  const doneCount = items.filter(i => i.done).length
  const progress = Math.round((doneCount / items.length) * 100)

  return (
    <div className="bg-s1 border border-b1 rounded-[var(--r10)] p-4 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[13px] font-semibold flex items-center gap-2">
          <CheckCircle2 size={15} className="text-acc" />
          {brandName} Onboarding — {progress}% Complete
        </h3>
        <span className="text-[11px] text-t3 font-mono">{doneCount}/{items.length}</span>
      </div>

      <div className="h-1.25 bg-s3 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-acc transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="flex items-center gap-2.5 p-2 rounded-[var(--r6)] bg-s2 border border-transparent hover:border-b1 cursor-pointer transition-all group"
          >
            <div className={cn(
              "w-4 h-4 rounded-[4px] border-1.5 flex items-center justify-center shrink-0 transition-all",
              item.done ? "bg-grn border-grn text-black" : "border-b2 group-hover:border-t3"
            )}>
              {item.done && <CheckCircle2 size={10} strokeWidth={3} />}
            </div>
            <span className={cn(
              "text-[12.5px] flex-1 truncate transition-all",
              item.done ? "text-t3 line-through" : "text-t2 group-hover:text-t1"
            )}>
              {item.text}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] bg-s3 text-t4 uppercase tracking-wider group-hover:text-t3 transition-colors">
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
