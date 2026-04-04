import React, { memo } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { Plus, ChevronDown, Sparkles, Folder, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RAIL_BRANDS } from '@/lib/data/brands'
import { useIsMobile } from '@/hooks/use-mobile'
import { useUI } from '@/stores/ui'

interface NavItemProps {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: { count: number; color: string }
  active?: boolean
}

const NavItem = memo(({ label, href, icon, badge, active }: NavItemProps) => {
  const router = useRouter()
  return (
    <button 
      onClick={() => router.push(href)}
      className={cn(
        "w-full flex items-center gap-[9px] px-2.5 py-[6px] rounded-[var(--r6)] cursor-pointer text-t3 text-[13.5px] font-medium relative select-none transition-all duration-300 ease-[var(--transition-premium)] hover:bg-s2 hover:text-t1 transform active:scale-[0.97] group",
        active && "bg-acc2 text-acc hover:bg-acc2 hover:text-acc shadow-[var(--shadow-glow)]"
      )}
    >
      <span className="w-3.5 text-center shrink-0 transition-transform group-hover:scale-110">
        {icon || <span className="text-t4 text-sm font-normal">#</span>}
      </span>
      {label}
      {badge && (
        <span className={cn(
          "ml-auto text-white text-[9.5px] font-bold px-[5px] py-px rounded-[9px] min-w-[16px] text-center leading-[1.4] transition-transform group-hover:translate-x-0.5",
          badge.color === 'red' ? "bg-red" : badge.color === 'orange' ? "bg-orn" : "bg-acc text-black"
        )}>
          {badge.count}
        </span>
      )}
    </button>
  )
})

NavItem.displayName = 'NavItem'

function Sidebar() {
  const params = useParams()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { setSidebarOpen } = useUI()
  
  const brandId = params?.brandId as string
  const brand = RAIL_BRANDS.find(b => b.id === brandId) || RAIL_BRANDS[0]

  const isRoute = (route: string) => pathname?.includes(`/${brandId}/${route}`)

  return (
    <div className="w-side bg-s1 border-r border-b1 flex flex-col shrink-0 overflow-hidden h-full">
      <div className="h-[var(--header-height)] px-3 border-b border-b1 flex items-center gap-2 shrink-0 bg-s1/50 backdrop-blur-sm">
        <div 
          className="w-[26px] h-[26px] rounded-[var(--r6)] flex items-center justify-center font-bold text-[10px] shrink-0 font-display transition-transform hover:scale-110"
          style={{ backgroundColor: brand.bg, color: brand.color }}
        >
          {brand.short}
        </div>
        <span className="text-[13px] font-semibold flex-1 truncate">{brand.name}</span>
        
        {isMobile ? (
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md text-t3 hover:bg-s2 hover:text-t1 transition-colors"
          >
            <X size={16} />
          </button>
        ) : (
          <ChevronDown size={10} className="text-t3 ml-auto opacity-50" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-[8px_8px_60px] scrollbar-none">
        {/* Performance Section */}
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-[1.5px] text-t3 font-bold p-[12px_8px_6px] flex items-center justify-between opacity-60">
            Performance
            <button className="text-t3 text-base cursor-pointer hover:text-t1 transition-transform hover:scale-125"><Plus size={14} /></button>
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
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-[1.5px] text-t3 font-bold p-[12px_8px_6px] flex items-center justify-between opacity-60">
            Client
            <button className="text-t3 text-base cursor-pointer hover:text-t1 transition-transform hover:scale-125"><Plus size={14} /></button>
          </div>
          <NavItem label="campaign-notes" href={`/${brandId}/notes`} active={isRoute('notes')} />
          <NavItem 
            label="client-updates" 
            href={`/${brandId}/updates`} 
            active={isRoute('updates')} 
            badge={{ count: 1, color: 'acc' }} 
          />
          <NavItem label="onboarding" href={`/${brandId}/onboarding`} active={isRoute('onboarding')} />
        </div>

        {/* Team Section */}
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-[1.5px] text-t3 font-bold p-[12px_8px_6px] flex items-center justify-between opacity-60">
            Team
            <button className="text-t3 text-base cursor-pointer hover:text-t1 transition-transform hover:scale-125"><Plus size={14} /></button>
          </div>
          <NavItem label="general" href={`/${brandId}/general`} active={isRoute('general')} badge={{ count: 2, color: 'red' }} />
          <NavItem label="creative-team" href={`/${brandId}/creative-team`} active={isRoute('creative-team')} />
          <NavItem label="media-buyers" href={`/${brandId}/media-buyers`} active={isRoute('media-buyers')} />
        </div>

        {/* Finance Section */}
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-[1.5px] text-t3 font-bold p-[12px_8px_6px] flex items-center justify-between opacity-60">
            Finance
          </div>
          <NavItem label="scope-tracker" href={`/${brandId}/scope`} active={isRoute('scope')} />
        </div>

        {/* Workspace Section */}
        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-[1.5px] text-t3 font-bold p-[12px_8px_6px] flex items-center justify-between opacity-60">
            Workspace
          </div>
          <NavItem label="ai-assistant" href={`/${brandId}/ai`} icon={<Sparkles size={13} />} active={isRoute('ai')} />
          <NavItem label="files" href={`/${brandId}/files`} icon={<Folder size={13} />} active={isRoute('files')} />
        </div>
      </div>
    </div>
  )
}

export default memo(Sidebar)
