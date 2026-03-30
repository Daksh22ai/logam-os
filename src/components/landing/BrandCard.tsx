'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

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

export default function BrandCard({ 
  id, name, short, color, bg, type, status, platform, roas, cpl, trend, alert 
}: BrandCardProps) {
  const router = useRouter()

  return (
    <div 
      onClick={() => router.push(`/${id}/reporting`)}
      className="bg-s1 border border-b1 rounded-[var(--r10)] p-4 cursor-pointer transition-all duration-180 relative overflow-hidden group hover:border-b2 hover:bg-s2 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/[0.02] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-3">
        <div 
          className="w-9 h-9 rounded-[var(--r8)] flex items-center justify-center font-display font-bold text-[13px]"
          style={{ backgroundColor: bg, color: color }}
        >
          {short}
        </div>
        <div className={cn(
          "w-[7px] h-[7px] rounded-full",
          alert === 'critical' ? "bg-orn shadow-[0_0_6px_var(--orn)]" : 
          status !== 'active' ? "bg-t4 shadow-none" : "bg-grn shadow-[0_0_6px_var(--grn)]"
        )} />
      </div>

      <div className="text-[13px] font-semibold mb-0.5 truncate">{name}</div>
      <div className="text-[11px] text-t3 mb-2.5">{type}</div>

      <div className="flex gap-1.5 flex-wrap">
        {roas && (
          <span className={cn(
            "text-[10px] px-[7px] py-[2px] rounded-0.5 font-bold",
            trend > 0 ? "bg-grn2 text-grn" : "bg-red2 text-red"
          )}>
            ROAS {roas}
          </span>
        )}
        {cpl && (
          <span className="text-[10px] px-[7px] py-[2px] rounded-0.5 font-bold bg-acc2 text-acc">
            CPL {cpl}
          </span>
        )}
        <span className={cn(
          "text-[10px] px-[7px] py-[2px] rounded-0.5 font-bold",
          trend > 0 ? "bg-grn2 text-grn" : "bg-red2 text-red"
        )}>
          {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
        </span>
        {alert && (
          <span className={cn(
            "text-[10px] px-[7px] py-[2px] rounded-0.5 font-bold",
            alert === 'critical' ? "bg-red2 text-red" : "bg-orn2 text-orn"
          )}>
            {alert}
          </span>
        )}
        {platform.map(p => (
          <span key={p} className="text-[10px] px-[7px] py-[2px] rounded-0.5 font-bold bg-s3 text-t3">
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}
