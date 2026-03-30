'use client'

import React, { useState } from 'react'
import LandingHeader from '@/components/landing/LandingHeader'
import StatBar from '@/components/landing/StatBar'
import BrandCard from '@/components/landing/BrandCard'
import LandingSidebar from '@/components/landing/LandingSidebar'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRANDS } from '@/lib/data/brands'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredBrands = BRANDS.filter(b => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return b.status === 'active'
    return b.cat === activeTab
  })

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden text-t1">
      <LandingHeader />

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Category Tabs */}
        <nav className="px-8 flex gap-0.5 border-b border-b1 shrink-0 bg-s1">
          {['all', 'active', 'realestate', 'ecommerce', 'education', 'other'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "p-[10px_14px] text-[12.5px] font-medium transition-all duration-150 border-b-2 capitalize",
                activeTab === tab ? "text-acc border-acc" : "text-t3 border-transparent hover:text-t2"
              )}
            >
              {tab === 'all' ? 'All Brands' : tab === 'realestate' ? 'Real Estate' : tab === 'ecommerce' ? 'E-Commerce' : tab}
              {tab === 'all' && <span className="text-[10px] p-[1px_6px] rounded-[10px] bg-s3 text-t3 ml-1.5">{BRANDS.length}</span>}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-hidden flex">
          <main className="flex-1 overflow-y-auto p-[24px_32px]">
            <StatBar />

            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-[1px] text-t3 font-bold">Brands</span>
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1 bg-s2 border border-b1 rounded-[var(--r6)] p-0.5">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-[4px_10px] rounded-[var(--r4)] text-[12px] transition-all duration-150",
                      viewMode === 'grid' ? "bg-s3 text-t1" : "text-t3 hover:text-t2"
                    )}
                  >
                    <LayoutGrid size={13} className="inline mr-1" /> Grid
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-[4px_10px] rounded-[var(--r4)] text-[12px] transition-all duration-150",
                      viewMode === 'list' ? "bg-s3 text-t1" : "text-t3 hover:text-t2"
                    )}
                  >
                    <List size={13} className="inline mr-1" /> List
                  </button>
                </div>
                <span className="text-[11px] text-acc font-semibold cursor-pointer hover:underline">+ Add Brand</span>
              </div>
            </div>

            <div className={cn(
              "grid gap-2.5",
              viewMode === 'grid' ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" : "grid-cols-1"
            )}>
              {filteredBrands.map((brand) => (
                <BrandCard 
                  key={brand.id}
                  id={brand.id}
                  name={brand.name}
                  short={brand.short}
                  color={brand.color}
                  bg={brand.bg}
                  type={brand.type}
                  status={brand.status}
                  platform={brand.platform}
                  roas={brand.roas || undefined}
                  cpl={brand.cpl || undefined}
                  trend={brand.trend}
                  alert={brand.alert as any}
                />
              ))}
            </div>
          </main>

          <LandingSidebar />
        </div>
      </div>
    </div>
  )
}
