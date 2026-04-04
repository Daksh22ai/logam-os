'use client'

import React, { memo } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

interface BrandCardProps {
  id: string
  name: string
  short: string
  color: string
  bg: string
  type: string
  status: string
  platform: string[]
  roas?: string
  cpl?: string
  trend: number
  alert?: 'critical' | 'warn' | null
}

function BrandCard({ 
  id, name, short, color, bg, type, status, platform, roas, cpl, trend, alert 
}: BrandCardProps) {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <div 
      onClick={() => router.push(`/${id}/reporting`)}
      className={cn(
        "bg-s1/40 border border-b1 rounded-2xl p-4 cursor-pointer relative overflow-hidden group transition-all duration-400 ease-[var(--transition-premium)]",
        "hover:bg-s2 hover:border-acc/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 active:scale-[0.97]"
      )}
    >
      {/* Premium Glass Shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[14px] shadow-sm transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: bg, color: color }}
        >
          {short}
        </div>
        <div className={cn(
          "w-2.5 h-2.5 rounded-full border-2 border-bg transition-shadow duration-300",
          alert === 'critical' ? "bg-orn shadow-[0_0_10px_var(--orn)]" : 
          status !== 'active' ? "bg-t4 shadow-none" : "bg-grn shadow-[0_0_10px_var(--grn)]"
        )} />
      </div>

      <div className="space-y-0.5 mb-4 relative z-10">
        <div className="text-[14px] font-bold text-t1 truncate group-hover:text-acc transition-colors">{name}</div>
        <div className="text-[11px] text-t4 font-semibold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">{type}</div>
      </div>

      <div className="flex gap-1.5 flex-wrap relative z-10">
        {(roas || cpl) && (
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-md font-black tracking-tight",
            roas ? (trend > 0 ? "bg-grn/10 text-grn" : "bg-red/10 text-red") : "bg-acc/10 text-acc"
          )}>
            {roas ? `ROAS ${roas}` : `CPL ${cpl}`}
          </span>
        )}
        <span className={cn(
          "text-[10px] px-2 py-0.5 rounded-md font-black tracking-tight",
          trend > 0 ? "bg-grn/10 text-grn" : "bg-red/10 text-red"
        )}>
          {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
        </span>
        {alert && (
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-md font-black tracking-tight animate-pulse",
            alert === 'critical' ? "bg-red/20 text-red shadow-[0_0_8px_rgba(239,68,68,0.2)]" : "bg-orn/20 text-orn"
          )}>
            {alert.toUpperCase()}
          </span>
        )}
        {!isMobile && platform.slice(0, 2).map(p => (
          <span key={p} className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-s3/60 text-t4 border border-b1/50 transition-colors group-hover:border-b2">
            {p}
          </span>
        ))}
      </div>
      
      {/* Interactive indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-acc scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  )
}

export default memo(BrandCard)
