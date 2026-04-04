'use client'

import React, { useState, useEffect, memo } from 'react'
import LandingHeader from '@/components/landing/LandingHeader'
import StatBar from '@/components/landing/StatBar'
import BrandCard from '@/components/landing/BrandCard'
import LandingSidebar from '@/components/landing/LandingSidebar'
import { LayoutGrid, List, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRANDS } from '@/lib/data/brands'
import { useIsMobile } from '@/hooks/use-mobile'

function AddBrandModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState<string[]>([])
  const [vertical, setVertical] = useState('ecommerce')
  const isMobile = useIsMobile()

  const platforms = ['Meta', 'Google', 'TikTok', 'GA4']
  const verticals = ['ecommerce', 'realestate', 'education', 'other']

  const togglePlatform = (p: string) =>
    setPlatform(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className={cn(
          "bg-s1 border border-b2 rounded-[20px] p-6 shadow-2xl relative animate-in fade-in slide-in-from-bottom-8 duration-500 ease-[var(--transition-premium)]",
          isMobile ? "w-[92%] max-h-[90vh] overflow-y-auto" : "w-[420px]"
        )}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-t3 hover:text-t1 transition-colors p-1">
          <X size={18} />
        </button>
        <h2 className="text-[18px] font-bold mb-1 tracking-tight">Add New Brand</h2>
        <p className="text-[13px] text-t3 mb-6">Connect a client to their accounts to start tracking.</p>
        
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[1px] text-t4 font-bold block ml-1">Brand Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sahajanand Elite"
              className="w-full bg-s2 border border-b1 rounded-xl px-4 py-3 text-[14px] text-t1 outline-none focus:border-acc focus:ring-1 focus:ring-acc/20 placeholder:text-t4 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[1px] text-t4 font-bold block ml-1">Platforms</label>
            <div className="flex gap-2 flex-wrap">
              {platforms.map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all duration-200",
                    platform.includes(p)
                      ? "bg-acc text-black border-acc shadow-[var(--shadow-glow)]"
                      : "bg-s2 border-b1 text-t3 hover:border-b2 hover:text-t2"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[1px] text-t4 font-bold block ml-1">Vertical</label>
            <div className="flex gap-2 flex-wrap">
              {verticals.map(v => (
                <button
                  key={v}
                  onClick={() => setVertical(v)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[13px] font-semibold border capitalize transition-all duration-200",
                    vertical === v
                      ? "bg-acc text-black border-acc shadow-[var(--shadow-glow)]"
                      : "bg-s2 border-b1 text-t3 hover:border-b2 hover:text-t2"
                  )}
                >
                  {v === 'realestate' ? 'Real Estate' : v === 'ecommerce' ? 'E-Commerce' : v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-s2 border border-b1 text-t2 text-[14px] font-bold rounded-xl hover:bg-s3 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!name.trim()) return
                onClose()
              }}
              className="flex-1 py-3 bg-acc text-black text-[14px] font-bold rounded-xl hover:bg-[#ffd235] hover:scale-105 transition-all shadow-[var(--shadow-glow)] active:scale-95"
            >
              Add Brand
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardHomePage() {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAddModal, setShowAddModal] = useState(false)
  const isMobile = useIsMobile()

  const filteredBrands = BRANDS.filter(b => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return b.status === 'active'
    return b.cat === activeTab
  })

  return (
    <div className="h-full flex flex-col bg-bg overflow-hidden text-t1">
      {showAddModal && <AddBrandModal onClose={() => setShowAddModal(false)} />}

      <LandingHeader />

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Category Tabs */}
        <nav className="px-4 md:px-8 flex gap-0.5 border-b border-b1 shrink-0 bg-s1 overflow-x-auto scrollbar-none">
          {['all', 'active', 'realestate', 'ecommerce', 'education', 'other'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "p-[12px_16px] text-[13px] font-bold transition-all duration-200 capitalize whitespace-nowrap",
                activeTab === tab ? "text-acc shadow-[inset_0_-2.5px_0_0_#f5c518]" : "text-t3 hover:text-t2"
              )}
            >
              {tab === 'all' ? 'All Brands' : tab === 'realestate' ? 'Real Estate' : tab === 'ecommerce' ? 'E-Commerce' : tab}
              {tab === 'all' && <span className="text-[10px] p-[1.5px_6px] rounded-[10px] bg-s3 text-t3 ml-2 font-black">{BRANDS.length}</span>}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-hidden flex">
          <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <StatBar />

            <div className="flex items-center justify-between mb-4 mt-2">
              <span className="text-[11px] uppercase tracking-[1.5px] text-t4 font-black">Brands</span>
              <div className="flex items-center gap-3">
                <div className="flex gap-1 bg-s2/60 border border-b1 rounded-xl p-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-[6px_12px] rounded-lg text-[12px] font-bold transition-all duration-200",
                      viewMode === 'grid' ? "bg-s3 text-t1 shadow-sm" : "text-t3 hover:text-t2"
                    )}
                  >
                    <LayoutGrid size={14} className={cn("inline", !isMobile && "mr-1.5")} /> 
                    <span className={cn(isMobile && "hidden")}>Grid</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-[6px_12px] rounded-lg text-[12px] font-bold transition-all duration-200",
                      viewMode === 'list' ? "bg-s3 text-t1 shadow-sm" : "text-t3 hover:text-t2"
                    )}
                  >
                    <List size={14} className={cn("inline", !isMobile && "mr-1.5")} /> 
                    <span className={cn(isMobile && "hidden")}>List</span>
                  </button>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 p-[8px_14px] bg-acc/10 text-acc rounded-xl text-[12px] font-bold hover:bg-acc/20 transition-all active:scale-95 border border-acc/20"
                >
                  <Plus size={14} /> 
                  <span className={cn(isMobile && "hidden")}>Add Brand</span>
                </button>
              </div>
            </div>

            <div className={cn(
              "grid gap-3 md:gap-4 pb-12",
              filteredBrands.length > 0 
                ? (viewMode === 'grid' ? "grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" : "grid-cols-1")
                : "grid-cols-1"
            )}>
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
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
                    alert={brand.alert}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center border border-dashed border-b2 rounded-2xl bg-s2/20">
                  <div className="w-14 h-14 rounded-2xl bg-s3 flex items-center justify-center mb-4 shadow-sm">
                    <LayoutGrid size={24} className="text-t3" />
                  </div>
                  <h3 className="text-[16px] font-bold text-t1 mb-2">No brands found</h3>
                  <p className="text-[14px] text-t4 max-w-[280px] leading-relaxed">
                    Adjust your filters or connect a new brand to see them here.
                  </p>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="mt-6 px-6 py-2.5 bg-acc text-black hover:bg-[#ffd235] text-[13px] font-bold rounded-xl transition-all shadow-[var(--shadow-glow)] hover:scale-105 active:scale-95"
                  >
                    Add Brand
                  </button>
                </div>
              )}
            </div>
          </main>

          {!isMobile && <LandingSidebar />}
        </div>
      </div>
    </div>
  )
}

export default memo(DashboardHomePage)
