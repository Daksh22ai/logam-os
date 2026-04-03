'use client'

import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  label: string
  value: string
  change: number
  changeType: 'up' | 'down' | 'flat'
  source: string
  color?: 'acc' | 'grn' | 'blu' | 'orn' | 'default'
}

const KPICard = ({ label, value, change, changeType, source, color = 'default' }: KPICardProps) => {
  const colorMap = {
    acc: 'text-acc',
    grn: 'text-grn',
    blu: 'text-blu',
    orn: 'text-orn',
    default: 'text-t1'
  }

  return (
    <div className="bg-s1 border border-b1 rounded-[var(--r10)] p-3.5 transition-colors duration-150 hover:border-b2 group">
      <div className="text-[10px] uppercase tracking-[0.7px] text-t3 font-semibold mb-[7px]">{label}</div>
      <div className={cn("font-display text-2xl font-bold tracking-[-0.8px] mb-[5px]", colorMap[color])}>
        {value}
      </div>
      <div className={cn(
        "text-[11.5px] font-medium flex items-center gap-[3px]",
        changeType === 'up' ? "text-grn" : changeType === 'down' ? "text-red" : "text-t3"
      )}>
        {changeType === 'up' ? <ArrowUpRight size={12} /> : changeType === 'down' ? <ArrowDownRight size={12} /> : <Minus size={12} />}
        {Math.abs(change)}% vs last month
      </div>
      <div className="text-[10px] text-t4 mt-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-150">{source}</div>
    </div>
  )
}

export default function KPIGrid({ brandType, activePlatform }: { brandType: string, activePlatform: string }) {
  const isEc = brandType.toLowerCase().includes('ecommerce')

  // Mock data sets per platform
  const data = {
    meta: {
      primaryValue: isEc ? "7.2×" : "₹380",
      primaryLabel: isEc ? "ROAS" : "Cost Per Lead",
      primarySource: "via Meta Insights API",
      ctr: "3.8%",
      impressions: "248K",
      spend: "₹2,40,000",
      frequency: "2.8×"
    },
    google: {
      primaryValue: isEc ? "11.4×" : "₹410",
      primaryLabel: isEc ? "ROAS" : "Cost Per Conversion",
      primarySource: "via Google Ads API",
      ctr: "6.2%",
      impressions: "112K",
      spend: "₹1,80,000",
      frequency: "N/A"
    },
    combined: {
      primaryValue: isEc ? "8.6×" : "₹392",
      primaryLabel: isEc ? "Blended ROAS" : "Blended CPL",
      primarySource: "Meta + Google Aggregated",
      ctr: "4.5%",
      impressions: "360K",
      spend: "₹4,20,000",
      frequency: "N/A"
    }
  }

  const d = data[activePlatform as keyof typeof data] || data.meta

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 mb-4">
      <KPICard 
        label={d.primaryLabel} 
        value={d.primaryValue} 
        change={12} 
        changeType="up" 
        source={d.primarySource}
        color="acc"
      />
      <KPICard 
        label="CTR" 
        value={d.ctr} 
        change={0.4} 
        changeType="up" 
        source="actions ÷ impressions"
        color="blu"
      />
      <KPICard 
        label="Impressions" 
        value={d.impressions} 
        change={8} 
        changeType="up" 
        source={activePlatform === 'meta' ? "reach × frequency" : "total views"}
        color="grn"
      />
      <KPICard 
        label="Total Spend" 
        value={d.spend} 
        change={0} 
        changeType="flat" 
        source="amount_spent field"
      />
      <KPICard 
        label="Frequency" 
        value={d.frequency} 
        change={activePlatform === 'meta' ? 0.6 : 0} 
        changeType={activePlatform === 'meta' ? "up" : "flat"} 
        source={activePlatform === 'meta' ? "impressions ÷ reach" : "Not applicable"}
        color={activePlatform === 'meta' ? "orn" : "default"}
      />
    </div>
  )
}
