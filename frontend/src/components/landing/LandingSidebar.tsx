'use client'

import React, { memo } from 'react'
import { cn } from '@/lib/utils'

function WidgetHeader({ title, icon }: { title: string, icon: string }) {
  return (
    <div className="text-[10px] uppercase tracking-[1.5px] text-t4 font-black mb-3 opacity-70 flex items-center gap-2">
      <span>{icon}</span> {title}
    </div>
  )
}

function AlertItem({ text, sub, isLast }: { text: string, sub: string, isLast?: boolean }) {
  return (
    <div className={cn("flex gap-3 items-start py-3", !isLast && "border-b border-b1/50")}>
      <div className="w-2 h-2 rounded-full bg-red shrink-0 mt-1 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
      <div className="space-y-0.5">
        <div className="text-[12.5px] text-t1 font-semibold leading-relaxed tracking-tight group-hover:text-acc transition-colors">{text}</div>
        <div className="text-[10.5px] text-t3 font-medium opacity-80">{sub}</div>
      </div>
    </div>
  )
}

function ActivityItem({ name, text, sub, isLast }: { name: string, text: string, sub: string, isLast?: boolean }) {
  return (
    <div className={cn("flex gap-3 items-start py-2.5", !isLast && "border-b border-b1/50")}>
      <div className="w-[24px] h-[24px] rounded-lg shrink-0 bg-acc/10 text-acc flex items-center justify-center font-black text-[10px] border border-acc/20">
        {name[0]}
      </div>
      <div className="space-y-0.5">
        <div className="text-[12px] text-t2 leading-snug font-medium tracking-tight">
          <span className="font-bold text-t1">{name}</span> {text}
        </div>
        <div className="text-[10px] text-t4 font-bold opacity-60 uppercase tracking-wider">{sub}</div>
      </div>
    </div>
  )
}

function ScheduleItem({ text, sub, color, isLast }: { text: string, sub: string, color: string, isLast?: boolean }) {
  return (
    <div className={cn("flex gap-3 items-start py-3", !isLast && "border-b border-b1/50")}>
      <div className={cn("w-2 h-2 rounded-full shrink-0 mt-1 shadow-sm", color === 'acc' ? 'bg-acc' : 'bg-grn')} />
      <div className="space-y-0.5">
        <div className="text-[12.5px] text-t1 font-semibold leading-relaxed tracking-tight">{text}</div>
        <div className="text-[10.5px] text-t3 font-medium opacity-80 uppercase tracking-widest">{sub}</div>
      </div>
    </div>
  )
}

function LandingSidebar() {
  return (
    <aside className="w-[300px] border-l border-b1 p-6 overflow-y-auto shrink-0 bg-s1/30 space-y-6 scrollbar-none">
      {/* Alerts Widget */}
      <div className="bg-s1/60 border border-b1 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-all duration-300">
        <WidgetHeader title="Critical Alerts" icon="🔔" />
        <AlertItem text="Creative fatigue — frequency 4.8×" sub="Hobby India · 2h ago" />
        <AlertItem text="ROAS dropped below 3× target" sub="Fitness Fox · 4h ago" isLast />
      </div>

      {/* Activity Widget */}
      <div className="bg-s1/60 border border-b1 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-all duration-300">
        <WidgetHeader title="Recent Activity" icon="👥" />
        <ActivityItem name="Karan" text="launched new creative set" sub="20 min ago" />
        <ActivityItem name="Priya" text="sent monthly report" sub="1h ago" isLast />
      </div>

      {/* Schedule Widget */}
      <div className="bg-s1/60 border border-b1 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-all duration-300">
        <WidgetHeader title="Today's Schedule" icon="📅" />
        <ScheduleItem text="Sahajanand Elite Review" sub="2:00 PM · 45 min" color="acc" />
        <ScheduleItem text="EcoTrip + Green Valley Reports" sub="By 6:00 PM" color="grn" isLast />
      </div>
    </aside>
  )
}

export default memo(LandingSidebar)
