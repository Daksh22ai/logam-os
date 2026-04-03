'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CampaignRow {
  name: string
  obj: string
  v: string
  ctr: string
  freq: string
  pct: number
  st: 'active' | 'warn' | 'paused'
}

export default function CampaignTable({ brandType }: { brandType: string }) {
  const isEc = brandType.toLowerCase().includes('ecommerce')
  
  const rows: CampaignRow[] = [
    {name:'Main Offer — Broad Audience',obj:'Conversions',v:isEc?'8.1×':'₹310',ctr:'3.9%',freq:'2.4×',pct:40,st:'active'},
    {name:'Retargeting — Website Visitors',obj:'Conversions',v:isEc?'12.4×':'₹185',ctr:'5.2%',freq:'1.9×',pct:20,st:'active'},
    {name:'Creative Test — New Hook',obj:'Traffic',v:isEc?'6.8×':'₹420',ctr:'2.1%',freq:'0.9×',pct:15,st:'warn'},
    {name:'Lookalike — 2% Top Buyers',obj:'Conversions',v:isEc?'5.2×':'₹520',ctr:'2.8%',freq:'1.5×',pct:15,st:'active'},
    {name:'Awareness — Cold Interest',obj:'Reach',v:isEc?'3.9×':'₹680',ctr:'1.4%',freq:'3.2×',pct:10,st:'paused'},
  ]

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[13px] font-semibold">Campaigns</span>
        <button className="px-3 py-1 bg-acc text-black text-[12px] font-bold rounded-[var(--r6)] hover:bg-[#ffd235]">
          + New Campaign
        </button>
      </div>

      <div className="bg-s1 border border-b1 rounded-[var(--r10)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-s2 border-b border-b1">
                <th className="p-[9px_14px] text-[10.5px] uppercase tracking-[0.7px] text-t3 font-bold">Campaign Name</th>
                <th className="p-[9px_14px] text-[10.5px] uppercase tracking-[0.7px] text-t3 font-bold">Objective</th>
                <th className="p-[9px_14px] text-[10.5px] uppercase tracking-[0.7px] text-t3 font-bold">{isEc ? 'ROAS' : 'CPL'}</th>
                <th className="p-[9px_14px] text-[10.5px] uppercase tracking-[0.7px] text-t3 font-bold">CTR</th>
                <th className="p-[9px_14px] text-[10.5px] uppercase tracking-[0.7px] text-t3 font-bold">Freq</th>
                <th className="p-[9px_14px] text-[10.5px] uppercase tracking-[0.7px] text-t3 font-bold">Budget Used</th>
                <th className="p-[9px_14px] text-[10.5px] uppercase tracking-[0.7px] text-t3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-b1 last:border-none group hover:bg-white/[0.02]">
                  <td className="p-[11px_14px] text-[13px] font-medium text-t1">{r.name}</td>
                  <td className="p-[11px_14px] text-[12px] text-t3">{r.obj}</td>
                  <td className={cn(
                    "p-[11px_14px] text-[12.5px] font-mono",
                    r.st === 'active' ? "text-grn" : r.st === 'warn' ? "text-orn" : "text-t3"
                  )}>{r.v}</td>
                  <td className="p-[11px_14px] text-[12.5px] font-mono text-t2">{r.ctr}</td>
                  <td className={cn(
                    "p-[11px_14px] text-[12.5px] font-mono",
                    parseFloat(r.freq) > 3.5 ? "text-red" : parseFloat(r.freq) > 2.5 ? "text-orn" : "text-t2"
                  )}>{r.freq}</td>
                  <td className="p-[11px_14px]">
                    <div className="flex items-center gap-1.75">
                      <div className="flex-1 h-1 bg-s3 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full bg-acc", r.st === 'warn' && "bg-red")} 
                          style={{ width: `${r.pct}%` }} 
                        />
                      </div>
                      <span className="text-[11px] font-mono text-t2 min-w-[28px]">{r.pct}%</span>
                    </div>
                  </td>
                  <td className="p-[11px_14px]">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-[7px] py-[2px] rounded-[12px] text-[11px] font-semibold",
                      r.st === 'active' ? "bg-grn2 text-grn" : 
                      r.st === 'warn' ? "bg-orn2 text-orn" : "bg-s3 text-t3"
                    )}>
                      <span className="w-1 h-1 rounded-full bg-current" />
                      {r.st === 'warn' ? 'Needs attention' : r.st}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
