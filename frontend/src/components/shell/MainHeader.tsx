'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { Sparkles, BarChart3, Bell, Palette, FileText, CheckCircle2, MessageSquare, Briefcase, FileDigit, Layout } from 'lucide-react'
import { BRANDS } from '@/lib/data/brands'

export default function MainHeader() {
  const params = useParams()
  const pathname = usePathname()
  const brandId = params?.brandId as string
  const brand = BRANDS.find(b => b.id === brandId) || BRANDS[0]

  const getSectionData = () => {
    if (pathname?.includes('/reporting')) return { icon: <BarChart3 size={14} />, title: 'reporting', sub: 'Meta + Google · Last 30 days', showPlatforms: true, showExport: true }
    if (pathname?.includes('/alerts')) return { icon: <Bell size={14} />, title: 'alerts', sub: '3 items need attention', showPlatforms: false, showExport: false }
    if (pathname?.includes('/creative')) return { icon: <Palette size={14} />, title: 'creative-studio', sub: 'Ad creative intelligence library', showPlatforms: false, showExport: false }
    if (pathname?.includes('/notes')) return { icon: <FileText size={14} />, title: 'campaign-notes', sub: 'Strategy & context', showPlatforms: false, showExport: false }
    if (pathname?.includes('/updates')) return { icon: <MessageSquare size={14} />, title: 'client-updates', sub: 'Outbound communication', showPlatforms: false, showExport: false }
    if (pathname?.includes('/onboarding')) return { icon: <CheckCircle2 size={14} />, title: 'onboarding', sub: 'Client setup checklist', showPlatforms: false, showExport: false }
    if (pathname?.includes('/general')) return { icon: <MessageSquare size={14} />, title: 'general', sub: 'Team channel', showPlatforms: false, showExport: false }
    if (pathname?.includes('/creative-team')) return { icon: <Palette size={14} />, title: 'creative-team', sub: 'Design & copy', showPlatforms: false, showExport: false }
    if (pathname?.includes('/media-buyers')) return { icon: <BarChart3 size={14} />, title: 'media-buyers', sub: 'Campaign operations', showPlatforms: false, showExport: false }
    if (pathname?.includes('/scope')) return { icon: <Briefcase size={14} />, title: 'scope-tracker', sub: 'Margin & scope visibility', showPlatforms: false, showExport: false }
    if (pathname?.includes('/files')) return { icon: <FileDigit size={14} />, title: 'files', sub: 'Shared assets', showPlatforms: false, showExport: false }
    return { icon: <Layout size={14} />, title: 'dashboard', sub: 'Overview', showPlatforms: false, showExport: false }
  }

  const { icon, title, sub, showPlatforms, showExport } = getSectionData()

  return (
    <div className="h-[46px] px-4 border-b border-b1 flex items-center gap-2.5 shrink-0 bg-bg/85 backdrop-blur-md z-40">
      <span className="text-t3 shrink-0">{icon}</span>
      <span className="font-display text-[14.5px] font-semibold">{title}</span>
      <span className="w-px h-3.5 bg-b2 shrink-0" />
      <span className="text-[11.5px] text-t3 truncate">{sub}</span>

      <div className="ml-auto flex items-center gap-1.5">
        {showPlatforms && brand.platform.map(p => (
          <div key={p} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-grn2 text-grn border border-grn/20">
            <div className="w-[5px] h-[5px] rounded-full bg-current" />
            {p}
          </div>
        ))}
        
        <Link 
          href="/chat"
          className="flex items-center gap-1 px-[11px] py-[5px] rounded-[var(--r6)] border border-transparent bg-transparent text-t3 text-[12px] font-medium transition-all duration-150 hover:bg-s2 hover:text-t1 hover:border-b1"
        >
          <Sparkles size={13} />
          ✦ Ask AI
        </Link>

        {showExport && (
          <button className="flex items-center gap-1 px-[11px] py-[5px] rounded-[var(--r6)] border border-acc bg-acc text-black text-[12px] font-bold transition-all duration-150 hover:bg-[#ffd235]">
            Export Report →
          </button>
        )}
      </div>
    </div>
  )
}
