'use client'

import React from 'react'
import { Zap, TrendingDown, Lightbulb, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlertItemProps {
  id: string
  type: 'fatigue' | 'anomaly' | 'opportunity' | 'positive'
  severity: 'critical' | 'warning' | 'info' | 'success'
  title: string
  brandName: string
  description: string
  time: string
  source: string
}

export default function AlertItem({ type, severity, title, brandName, description, time, source }: AlertItemProps) {
  const icons = {
    fatigue: <Zap size={14} />,
    anomaly: <TrendingDown size={14} />,
    opportunity: <Lightbulb size={14} />,
    positive: <Target size={14} />
  }

  const borderColors = {
    critical: "border-l-[3px] border-l-red",
    warning: "border-l-[3px] border-l-orn",
    info: "border-l-[3px] border-l-blu",
    success: "border-l-[3px] border-l-grn"
  }

  const bgColors = {
    critical: "bg-red2",
    warning: "bg-orn2",
    info: "bg-blu2",
    success: "bg-grn2"
  }

  const textColors = {
    critical: "text-red",
    warning: "text-orn",
    info: "text-blu",
    success: "text-grn"
  }

  return (
    <div className={cn(
      "bg-s1 border border-b1 rounded-[var(--r10)] p-[14px_16px] flex gap-3 items-start transition-all duration-180 hover:border-b2 group",
      borderColors[severity]
    )}>
      <div className={cn(
        "w-[30px] h-[30px] rounded-[var(--r8)] flex items-center justify-center shrink-0",
        bgColors[severity],
        textColors[severity]
      )}>
        {icons[type]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <div className="text-[13.5px] font-semibold text-t1">{title}</div>
          <span className="text-[10px] font-semibold p-[2px_7px] rounded-[4px] bg-s3 text-t3 uppercase tracking-[0.4px]">
            {brandName}
          </span>
          {severity === 'critical' && (
            <span className="inline-flex items-center gap-1 px-[7px] py-[2px] rounded-[12px] text-[11px] font-semibold bg-orn2 text-orn">
              <span className="w-1 h-1 rounded-full bg-current" />
              Action needed
            </span>
          )}
        </div>

        <div className="text-[13px] text-t2 leading-[1.55]">{description}</div>

        <div className="flex items-center gap-2.5 mt-[7px]">
          <span className="text-[11px] text-t4">Detected {time}</span>
          <span className="text-[11px] text-t3 flex items-center gap-1">
            <span className="opacity-60 shrink-0">{icons[type]}</span>
            {source}
          </span>
        </div>
      </div>

      <div className="flex gap-1.5 shrink-0 self-start opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="px-3 py-1 bg-acc text-black text-[12px] font-bold rounded-[var(--r6)] hover:bg-[#ffd235]">
          Analyze →
        </button>
        <button className="px-3 py-1 border border-b1 bg-s2 text-t2 text-[12px] font-medium rounded-[var(--r6)] hover:bg-s3">
          Dismiss
        </button>
      </div>
    </div>
  )
}
