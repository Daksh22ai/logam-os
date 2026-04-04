'use client'

import React, { memo } from 'react'
import { cn } from '@/lib/utils'

function StatCard({ label, value, sub, colorClass }: { label: string, value: string, sub: string, colorClass: string }) {
  return (
    <div className="bg-s1/60 border border-b1 rounded-xl p-3.5 md:p-4 shadow-sm hover:shadow-md hover:border-b2 transition-all duration-300 group">
      <div className="text-[10px] uppercase tracking-[1.2px] text-t4 font-black mb-2 opacity-80 group-hover:opacity-100 transition-opacity">{label}</div>
      <div className={cn("text-[20px] md:text-[24px] font-black tracking-tight leading-none mb-1", colorClass)}>
        {value}
      </div>
      <div className="text-[11px] text-t3 font-medium truncate">{sub}</div>
    </div>
  )
}

function StatBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      <StatCard 
        label="Active Clients" 
        value="38" 
        sub="↑ 3 this month" 
        colorClass="text-acc" 
      />
      <StatCard 
        label="Monthly Spend" 
        value="₹48.2L" 
        sub="Across all accounts" 
        colorClass="text-grn" 
      />
      <StatCard 
        label="Alerts Today" 
        value="7" 
        sub="3 critical, 4 warnings" 
        colorClass="text-orn" 
      />
      <StatCard 
        label="Avg ROAS" 
        value="5.8×" 
        sub="↑ 0.4× vs last month" 
        colorClass="text-blu" 
      />
    </div>
  )
}

export default memo(StatBar)
