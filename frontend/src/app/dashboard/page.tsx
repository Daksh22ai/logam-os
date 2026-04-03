'use client'

import React, { useState, useEffect } from 'react'
import LandingHeader from '@/components/landing/LandingHeader'
import StatBar from '@/components/landing/StatBar'
import BrandCard from '@/components/landing/BrandCard'
import LandingSidebar from '@/components/landing/LandingSidebar'
import { LayoutGrid, List, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRANDS } from '@/lib/data/brands'

function AddBrandModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState<string[]>([])
  const [vertical, setVertical] = useState('ecommerce')

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" onClick={onClose}>
      <div 
        className="bg-s1 border border-b2 rounded-[16px] p-6 w-[420px] shadow-2xl relative animate-in fade-in slide-in-from-bottom-8 duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-t3 hover:text-t1 transition-colors">
          <X size={16} />
        </button>
        <h2 className="text-[16px] font-bold mb-1">Add New Brand</h2>
        <p className="text-[12px] text-t3 mb-5">Connect a client to their ad accounts to start tracking performance.</p>
        
        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-[11px] uppercase tracking-[0.6px] text-t3 font-semibold block mb-1.5">Brand / Client Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sahajanand Elite"
              className="w-full bg-s2 border border-b1 rounded-[8px] px-3 py-2 text-[13px] text-t1 outline-none focus:border-b2 placeholder:text-t4 transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.6px] text-t3 font-semibold block mb-1.5">Platforms</label>
            <div className="flex gap-2 flex-wrap">
              {platforms.map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-[8px] text-[12px] font-medium border transition-all duration-150",
                    platform.includes(p)
                      ? "bg-acc/15 border-acc/40 text-acc"
                      : "bg-s2 border-b1 text-t3 hover:border-b2 hover:text-t2"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.6px] text-t3 font-semibold block mb-1.5">Vertical</label>
            <div className="flex gap-2 flex-wrap">
              {verticals.map(v => (
                <button
                  key={v}
                  onClick={() => setVertical(v)}
                  className={cn(
                    "px-3 py-1.5 rounded-[8px] text-[12px] font-medium border capitalize transition-all duration-150",
                    vertical === v
                      ? "bg-acc/15 border-acc/40 text-acc"
                      : "bg-s2 border-b1 text-t3 hover:border-b2 hover:text-t2"
                  )}
                >
                  {v === 'realestate' ? 'Real Estate' : v === 'ecommerce' ? 'E-Commerce' : v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-s2 border border-b1 text-t2 text-[13px] font-medium rounded-[8px] hover:bg-s3 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!name.trim()) return
                alert(`Brand "${name}" added! In production this would connect to Meta/Google OAuth.`)
                onClose()
              }}
              className="flex-1 py-2 bg-acc text-black text-[13px] font-bold rounded-[8px] hover:bg-[#ffd235] transition-colors"
            >
              Add Brand →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardHomePage() {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredBrands = BRANDS.filter(b => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return b.status === 'active'
    return b.cat === activeTab
  })

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden text-t1">
      {showAddModal && <AddBrandModal onClose={() => setShowAddModal(false)} />}

      <LandingHeader />

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Category Tabs */}
        <nav className="px-8 flex gap-0.5 border-b border-b1 shrink-0 bg-s1">
          {['all', 'active', 'realestate', 'ecommerce', 'education', 'other'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "p-[10px_14px] text-[12.5px] font-medium transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] capitalize box-border",
                activeTab === tab ? "text-acc shadow-[inset_0_-2px_0_0_#f5c518]" : "text-t3 hover:text-t2"
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
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1 text-[11px] text-acc font-semibold hover:underline transition-colors"
                >
                  <Plus size={12} /> Add Brand
                </button>
              </div>
            </div>

            <div className={cn(
              "grid gap-2.5",
              filteredBrands.length > 0 
                ? (viewMode === 'grid' ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" : "grid-cols-1")
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
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-b2 rounded-xl bg-s2/30">
                  <div className="w-12 h-12 rounded-full bg-s3 flex items-center justify-center mb-3">
                    <LayoutGrid size={20} className="text-t3" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-t1 mb-1">No brands found</h3>
                  <p className="text-[12px] text-t3 max-w-[250px]">
                    None of your connected brands match this filter. Try changing categories or add a new brand.
                  </p>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 px-4 py-2 bg-s3 text-t1 hover:bg-s4 text-[12px] font-medium rounded-lg transition-colors ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Add Brand
                  </button>
                </div>
              )}
            </div>
          </main>

          <LandingSidebar />
        </div>
      </div>
    </div>
  )
}
