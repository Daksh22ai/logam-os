'use client'

import React from 'react'
import { AlertCircle, Clock, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScopeCardProps {
  name: string
  type: string
  margin: number
  hoursActual: number
  hoursContract: number
  budgetSpent: string
}

export default function ScopeCard({ 
  name, type, margin, hoursActual, hoursContract, budgetSpent 
}: ScopeCardProps) {
  const overScope = hoursActual > hoursContract
  const marginStatus = margin < 12 ? 'bad' : margin < 18 ? 'warn' : 'good'
  
  const hourPct = Math.min((hoursActual / hoursContract) * 100, 100)
  const budgetPct = 65 // Mocked for UI

  return (
    <div className="bg-s1 border border-b1 rounded-[var(--r10)] p-4 group transition-all hover:border-b2 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[13px] font-bold text-t1 group-hover:text-acc transition-colors">{name}</div>
          <div className="text-[11px] text-t3 mt-0.5">{type}</div>
        </div>
        <div className={cn(
          "font-display text-[18px] font-bold",
          marginStatus === 'good' ? "text-grn" : marginStatus === 'warn' ? "text-orn" : "text-red"
        )}>
          {margin}% margin
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Hours Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-t3 font-medium px-0.5">
            <span className="flex items-center gap-1.5"><Clock size={11} className="text-t4" /> Hours Logged</span>
            <span className={cn("font-mono", overScope ? "text-red" : "text-t2")}>{hoursActual}/{hoursContract}h</span>
          </div>
          <div className="h-1.5 bg-s3 rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-500", overScope ? "bg-red" : "bg-grn")} 
              style={{ width: `${hourPct}%` }} 
            />
          </div>
        </div>

        {/* Budget Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-t3 font-medium px-0.5">
            <span className="flex items-center gap-1.5"><Wallet size={11} className="text-t4" /> Budget Used</span>
            <span className="font-mono text-t2">{budgetSpent}</span>
          </div>
          <div className="h-1.5 bg-s3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blu transition-all duration-500" 
              style={{ width: `${budgetPct}%` }} 
            />
          </div>
        </div>
      </div>

      {overScope && (
        <div className="mt-3.5 flex items-center gap-1.5 p-2 bg-red2 border border-red/20 rounded-[var(--r6)] text-[11px] text-red animate-pulse">
          <AlertCircle size={12} strokeWidth={2.5} />
          ⚠ {hoursActual - hoursContract}h over scope — review with client
        </div>
      )}
    </div>
  )
}
