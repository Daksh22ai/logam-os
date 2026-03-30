'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import HowItWorks from '@/components/alerts/HowItWorks'
import AlertItem from '@/components/alerts/AlertItem'

const MOCK_BRANDS = [
  { id: 'hobby', name: 'Hobby India', trend: 12 },
  { id: 'fitness', name: 'Fitness Fox', trend: -8 },
  { id: 'sahajanand', name: 'Sahajanand Elite', trend: 22 },
]

export default function AlertsPage() {
  const params = useParams()
  const brandId = params?.brandId as string
  const brand = MOCK_BRANDS.find(b => b.id === brandId) || MOCK_BRANDS[0]

  const alerts = [
    {
      id: '1',
      type: 'fatigue' as const,
      severity: 'critical' as const,
      title: 'Creative fatigue — main ad set',
      brandName: brand.name,
      description: 'CTR on "Main Offer — Broad" dropped from 4.1% → 1.8% over 6 days. Frequency reached 4.8×. Meta\'s delivery algorithm is reducing spend on fatigued creatives. Estimated ROAS impact: -1.2× if not addressed within 48 hours.',
      time: '2h ago',
      source: '⚡ AI anomaly detection · CTR threshold crossed'
    },
    {
      id: '2',
      type: 'anomaly' as const,
      severity: 'warning' as const,
      title: brand.trend < 0 ? 'ROAS below target for 5 days' : 'Budget pacing — will exhaust early',
      brandName: brand.name,
      description: brand.trend < 0 
        ? 'ROAS at 5.1× vs 6× target. Primary cause: CPC increased 18% due to competitive pressure. Shilajit ad set consuming 28% of budget at 1.1× ROAS — dragging blended performance.'
        : 'Current spend velocity projects monthly budget exhausted by day 22. Consider reducing daily cap by 15% on the broad audience campaign.',
      time: '5h ago',
      source: '📊 5-day ROAS tracking · Statistical deviation'
    },
    {
      id: '3',
      type: 'opportunity' as const,
      severity: 'info' as const,
      title: 'Opportunity — Lookalike audience expansion',
      brandName: brand.name,
      description: 'Based on your top 500 converters, a 2% lookalike shows estimated CPL 22% lower than your current broad targeting. Recommended: allocate 15% of weekly budget to a test campaign.',
      time: 'Yesterday',
      source: '✦ AI opportunity scan'
    },
    {
      id: '4',
      type: 'positive' as const,
      severity: 'success' as const,
      title: 'Weekly lead target hit 3 days early',
      brandName: brand.name,
      description: 'Target of 200 leads for the week reached on Wednesday. CPL is currently favourable at ₹245. Recommend increasing daily budget for remaining 2 days.',
      time: 'Yesterday',
      source: '✓ Goal tracking · Auto milestone'
    }
  ]

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <HowItWorks />

      <div className="flex flex-col gap-2">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} {...alert} />
        ))}
      </div>
    </div>
  )
}
