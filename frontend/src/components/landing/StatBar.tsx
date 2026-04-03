'use client'

import React from 'react'

export default function StatBar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-[10px] mb-6">
      <div className="bg-s1 border border-b1 rounded-[var(--r10)] p-[14px_16px]">
        <div className="text-[10px] uppercase tracking-[0.8px] text-t3 font-bold mb-1.5">Active Clients</div>
        <div className="font-display text-[22px] font-bold tracking-[-0.5px] text-acc">38</div>
        <div className="text-[11px] text-t3 mt-0.5">↑ 3 this month</div>
      </div>
      
      <div className="bg-s1 border border-b1 rounded-[var(--r10)] p-[14px_16px]">
        <div className="text-[10px] uppercase tracking-[0.8px] text-t3 font-bold mb-1.5">Total Monthly Spend</div>
        <div className="font-display text-[22px] font-bold tracking-[-0.5px] text-grn">₹48.2L</div>
        <div className="text-[11px] text-t3 mt-0.5">Across all accounts</div>
      </div>

      <div className="bg-s1 border border-b1 rounded-[var(--r10)] p-[14px_16px]">
        <div className="text-[10px] uppercase tracking-[0.8px] text-t3 font-bold mb-1.5">Alerts Today</div>
        <div className="font-display text-[22px] font-bold tracking-[-0.5px] text-orn">7</div>
        <div className="text-[11px] text-t3 mt-0.5">3 critical, 4 warnings</div>
      </div>

      <div className="bg-s1 border border-b1 rounded-[var(--r10)] p-[14px_16px]">
        <div className="text-[10px] uppercase tracking-[0.8px] text-t3 font-bold mb-1.5">Avg ROAS</div>
        <div className="font-display text-[22px] font-bold tracking-[-0.5px] text-blu">5.8×</div>
        <div className="text-[11px] text-t3 mt-0.5">↑ 0.4× vs last month</div>
      </div>
    </div>
  )
}
