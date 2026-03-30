'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import OnboardingCard from '@/components/onboarding/OnboardingCard'

const MOCK_BRANDS = [
  { id: 'hobby', name: 'Hobby India' },
  { id: 'fitness', name: 'Fitness Fox' },
  { id: 'sahajanand', name: 'Sahajanand Elite' },
]

export default function OnboardingPage() {
  const params = useParams()
  const brandId = params?.brandId as string
  const brand = MOCK_BRANDS.find(b => b.id === brandId) || MOCK_BRANDS[0]

  return (
    <div className="max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-display mb-1.5">Client Onboarding Checklist</h2>
        <p className="text-t3 text-[13px]">Systematically verify all data sources and creative assets for {brand.name}.</p>
      </div>

      <OnboardingCard brandName={brand.name} />
    </div>
  )
}
