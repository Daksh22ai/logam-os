'use client'

import React from 'react'

export default function LandingSidebar() {
  return (
    <aside className="w-[260px] border-l border-b1 p-5 overflow-y-auto shrink-0 bg-s1">
      {/* Alerts Widget */}
      <div className="bg-s2 border border-b1 rounded-[var(--r10)] p-3.5 mb-3">
        <div className="text-[10px] uppercase tracking-[0.8px] text-t3 font-bold mb-2.5">🔔 Critical Alerts</div>
        <div className="flex gap-2 items-start py-[7px] border-b border-b1">
          <div className="w-1.5 h-1.5 rounded-full bg-red shrink-0 mt-1" />
          <div>
            <div className="text-[12px] text-t2 leading-relaxed">Creative fatigue — frequency 4.8× on main ad set</div>
            <div className="text-[10px] text-t3 mt-0.5">Hobby India · 2h ago</div>
          </div>
        </div>
        <div className="flex gap-2 items-start py-[7px]">
          <div className="w-1.5 h-1.5 rounded-full bg-red shrink-0 mt-1" />
          <div>
            <div className="text-[12px] text-t2 leading-relaxed">ROAS dropped below 3× target threshold</div>
            <div className="text-[10px] text-t3 mt-0.5">Fitness Fox · 4h ago</div>
          </div>
        </div>
      </div>

      {/* Activity Widget */}
      <div className="bg-s2 border border-b1 rounded-[var(--r10)] p-3.5 mb-3">
        <div className="text-[10px] uppercase tracking-[0.8px] text-t3 font-bold mb-2.5">👥 Recent Activity</div>
        <div className="flex gap-2 items-start py-1.5 border-b border-b1">
          <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center font-display font-bold text-[9px] shrink-0 bg-acc2 text-acc">K</div>
          <div>
            <div className="text-[12px] text-t2 leading-snug">Karan launched new creative set for Sahajanand</div>
            <div className="text-[10px] text-t4 mt-0.5">20 min ago</div>
          </div>
        </div>
        <div className="flex gap-2 items-start py-1.5">
          <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center font-display font-bold text-[9px] shrink-0 bg-acc2 text-acc">P</div>
          <div>
            <div className="text-[12px] text-t2 leading-snug">Priya sent monthly report to Fitness Fox</div>
            <div className="text-[10px] text-t4 mt-0.5">1h ago</div>
          </div>
        </div>
      </div>

      {/* Schedule Widget */}
      <div className="bg-s2 border border-b1 rounded-[var(--r10)] p-3.5">
        <div className="text-[10px] uppercase tracking-[0.8px] text-t3 font-bold mb-2.5">📅 Today&apos;s Schedule</div>
        <div className="flex gap-2 items-start py-[7px] border-b border-b1">
          <div className="w-1.5 h-1.5 rounded-full bg-acc shrink-0 mt-1" />
          <div>
            <div className="text-[12px] text-t2 leading-relaxed">Client call — Sahajanand Elite review</div>
            <div className="text-[10px] text-t3 mt-0.5">2:00 PM · 45 min</div>
          </div>
        </div>
        <div className="flex gap-2 items-start py-[7px]">
          <div className="w-1.5 h-1.5 rounded-full bg-grn shrink-0 mt-1" />
          <div>
            <div className="text-[12px] text-t2 leading-relaxed">Report delivery — EcoTrip + Green Valley</div>
            <div className="text-[10px] text-t3 mt-0.5">By 6 PM</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
