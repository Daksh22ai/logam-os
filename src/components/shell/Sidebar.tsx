'use client'

import React from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { Plus, ChevronDown, Hash, Sparkles, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RAIL_BRANDS } from '@/lib/data/brands'

interface NavItemProps {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: { count: number; color: string }
  active?: boolean
}

const NavItem = ({ label, href, icon, badge, active }: NavItemProps) => {
  const router = useRouter()
  return (
    <button 
      onClick={() => router.push(href)}
      className={cn(
        "w-full flex items-center gap-[7px] px-2 py-[5px] rounded-[var(--r6)] cursor-pointer text-t3 text-[13px] font-medium transition-all duration-120 relative select-none hover:bg-s2 hover:text-t1",
        active && "bg-acc2 text-acc hover:bg-acc2 hover:text-acc"
      )}
    >
      <span className="w-3.5 text-center shrink-0">
        {icon || <span className="text-t4 text-sm font-normal">#</span>}
      </span>
      {label}
      {badge && (
        <span className={cn(
          "ml-auto text-white text-[9.5px] font-bold px-[5px] py-px rounded-[9px] min-w-[16px] text-center leading-[1.4]",
          badge.color === 'red' ? "bg-red" : badge.color === 'orange' ? "bg-orn" : "bg-blu"
        )}>
          {badge.count}
        </span>
      )}
    </button>
  )
}

export default function Sidebar() {
  const params = useParams()
  const pathname = usePathname()
  const brandId = params?.brandId as string
  const brand = RAIL_BRANDS.find(b => b.id === brandId) || RAIL_BRANDS[0]

  const isRoute = (route: string) => pathname?.includes(`/${brandId}/${route}`)

  return (
    <div className="w-side bg-s1 border-r border-b1 flex flex-col shrink-0 overflow-hidden">
      <div className="p-[10px_12px] border-b border-b1 flex items-center gap-2 cursor-pointer transition-colors duration-150 hover:bg-s2 shrink-0">
        <div 
          className="w-[26px] h-[26px] rounded-[var(--r6)] flex items-center justify-center font-bold text-[10px] shrink-0 font-display"
          style={{ backgroundColor: brand.bg, color: brand.color }}
        >
          {brand.short}
        </div>
        <span className="text-[13px] font-semibold flex-1 truncate">{brand.name}</span>
        <ChevronDown size={10} className="text-t3 ml-auto" />
      </div>

      <div className="flex-1 overflow-y-auto p-[6px_6px_60px]">
        {/* Performance Section */}
        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-[1.1px] text-t3 font-bold p-[12px_8px_4px] flex items-center justify-between">
            Performance
            <button className="text-t3 text-base cursor-pointer hover:text-t1"><Plus size={14} /></button>
          </div>
          <NavItem label="reporting" href={`/${brandId}/reporting`} active={isRoute('reporting')} />
          <NavItem 
            label="alerts" 
            href={`/${brandId}/alerts`} 
            active={isRoute('alerts')} 
            badge={{ count: 3, color: 'red' }} 
          />
          <NavItem label="creative-studio" href={`/${brandId}/creative`} active={isRoute('creative')} />
        </div>

        {/* Client Section */}
        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-[1.1px] text-t3 font-bold p-[12px_8px_4px] flex items-center justify-between">
            Client
            <button className="text-t3 text-base cursor-pointer hover:text-t1"><Plus size={14} /></button>
          </div>
          <NavItem label="campaign-notes" href={`/${brandId}/notes`} active={isRoute('notes')} />
          <NavItem 
            label="client-updates" 
            href={`/${brandId}/updates`} 
            active={isRoute('updates')} 
            badge={{ count: 1, color: 'blue' }} 
          />
          <NavItem label="onboarding" href={`/${brandId}/onboarding`} active={isRoute('onboarding')} />
        </div>

        {/* Team Section */}
        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-[1.1px] text-t3 font-bold p-[12px_8px_4px] flex items-center justify-between">
            Team
            <button className="text-t3 text-base cursor-pointer hover:text-t1"><Plus size={14} /></button>
          </div>
          <NavItem label="general" href={`/${brandId}/general`} active={isRoute('general')} badge={{ count: 2, color: 'red' }} />
          <NavItem label="creative-team" href={`/${brandId}/creative-team`} active={isRoute('creative-team')} />
          <NavItem label="media-buyers" href={`/${brandId}/media-buyers`} active={isRoute('media-buyers')} />
        </div>

        {/* Finance Section */}
        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-[1.1px] text-t3 font-bold p-[12px_8px_4px] flex items-center justify-between">
            Finance
          </div>
          <NavItem label="scope-tracker" href={`/${brandId}/scope`} active={isRoute('scope')} />
        </div>

        {/* Workspace Section */}
        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-[1.1px] text-t3 font-bold p-[12px_8px_4px] flex items-center justify-between">
            Workspace
          </div>
          <NavItem label="ai-assistant" href={`/${brandId}/ai`} icon={<Sparkles size={13} />} active={isRoute('ai')} />
          <NavItem label="files" href={`/${brandId}/files`} icon={<Folder size={13} />} active={isRoute('files')} />
        </div>
      </div>
    </div>
  )
}
