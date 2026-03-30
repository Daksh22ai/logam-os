'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import CreativePatternCard from '@/components/creative/CreativePatternCard'
import CreativeCard from '@/components/creative/CreativeCard'

const MOCK_BRANDS = [
  { id: 'hobby', name: 'Hobby India' },
  { id: 'fitness', name: 'Fitness Fox' },
  { id: 'sahajanand', name: 'Sahajanand Elite' },
]

export default function CreativeStudioPage() {
  const params = useParams()
  const brandId = params?.brandId as string
  const brand = MOCK_BRANDS.find(b => b.id === brandId) || MOCK_BRANDS[0]

  const creatives = [
    {name:'"Do kids get bored quickly?"',hook:'Problem → Agitate → Solve',emoji:'🎨',bg:'rgba(124,58,237,.08)',ctr:'4.1%',roas:'9.2×',freq:'4.8×',fatigue:'Fatigued',fstatus:'red' as const},
    {name:'Educational: DIY Benefits Grid',hook:'Informational + USP',emoji:'📐',bg:'rgba(34,197,94,.08)',ctr:'3.2%',roas:'7.1×',freq:'2.1×',fatigue:'Healthy',fstatus:'grn' as const},
    {name:'Mega Sale — 10% Off Offer',hook:'Urgency + Discount',emoji:'💥',bg:'rgba(245,197,24,.08)',ctr:'2.8%',roas:'6.8×',freq:'1.8×',fatigue:'Healthy',fstatus:'grn' as const},
    {name:'UGC: Customer Unboxing Video',hook:'Social Proof',emoji:'🎬',bg:'rgba(59,130,246,.08)',ctr:'1.9%',roas:'4.2×',freq:'1.2×',fatigue:'Testing',fstatus:'blu' as const},
    {name:'Us vs Them Comparison',hook:'Competitive differentiation',emoji:'⚡',bg:'rgba(249,115,22,.08)',ctr:'3.7%',roas:'8.4×',freq:'3.1×',fatigue:'Healthy',fstatus:'grn' as const},
    {name:'New Hook — Testing Phase',hook:'Curiosity gap open',emoji:'🔬',bg:'rgba(168,85,247,.08)',ctr:'1.4%',roas:'3.1×',freq:'0.8×',fatigue:'Testing',fstatus:'blu' as const},
  ]

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CreativePatternCard brandName={brand.name} />

      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[13px] font-semibold">Creative Library</span>
        <button className="px-3.5 py-1.5 bg-acc text-black text-[12px] font-bold rounded-[var(--r6)] transition-all hover:bg-[#ffd235]">
          + Add Creative
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
        {creatives.map((c, i) => (
          <CreativeCard key={i} {...c} />
        ))}
      </div>
    </div>
  )
}
