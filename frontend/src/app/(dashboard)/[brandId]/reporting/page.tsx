'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import KPIGrid from '@/components/reporting/KPIGrid'
import AIInsightCard from '@/components/reporting/AIInsightCard'
import ReportingCharts from '@/components/reporting/ReportingCharts'
import CampaignTable from '@/components/reporting/CampaignTable'
import ExportCard from '@/components/reporting/ExportCard'
import { cn } from '@/lib/utils'
import { BRANDS } from '@/lib/data/brands'

// Use ALL brands, not just the first 3
const REPORTING_BRANDS = BRANDS.map((b) => ({
  id: b.id,
  name: b.name,
  type: b.type,
  roas: b.roas,
  cpl: b.cpl,
  trend: b.trend,
}))

export default function ReportingPage() {
  const params = useParams()
  const brandId = params?.brandId as string
  const brand = REPORTING_BRANDS.find(b => b.id === brandId) || REPORTING_BRANDS[0]
  const [activePlatform, setActivePlatform] = useState('meta')

  const insightContent = brand.id === 'hobby' 
    ? `**Hobby India is showing strong momentum this week.** ROAS holding at 7.2× — the "Do kids get bored?" hook continues outperforming benchmarks by 34%. However, **creative fatigue is building** on the primary "DIY Canvas" ad set: frequency reached 4.8× and CTR has dropped from 4.1% to 1.8% over 6 days.`
    : `**Performance overview for ${brand.name}.** Current ${brand.roas ? `ROAS at ${brand.roas}` : brand.cpl ? `CPL at ${brand.cpl}` : 'metrics are tracking'} — ${brand.trend > 0 ? 'trending positively this period' : 'showing areas for optimisation'}. AI is monitoring all campaigns continuously.`

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <KPIGrid brandType={brand.type} activePlatform={activePlatform} />

      <AIInsightCard 
        content={insightContent}
        severity={brand.trend > 0 ? 'good' : 'warning'}
        brandName={brand.name}
        brandType={brand.type}
      />

      <div className="flex gap-0.5 mb-3.5 bg-s1 border border-b1 rounded-[var(--r8)] p-[3px] w-fit">
        {[
          { id: 'meta', label: 'Meta Ads', color: '#1877f2' },
          { id: 'google', label: 'Google Ads', color: '#34A853' },
          { id: 'combined', label: '📊 Combined', color: null }
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePlatform(p.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-[var(--r6)] text-[12px] font-medium flex items-center gap-1.5 border-none bg-transparent transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
              activePlatform === p.id ? "bg-s3 text-t1 shadow-sm" : "text-t3 hover:text-t2 hover:bg-s2"
            )}
          >
            {p.color && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />}
            {p.label}
          </button>
        ))}
      </div>

      <ReportingCharts brandType={brand.type} activePlatform={activePlatform} />

      <CampaignTable brandType={brand.type} />

      <ExportCard />
    </div>
  )
}
