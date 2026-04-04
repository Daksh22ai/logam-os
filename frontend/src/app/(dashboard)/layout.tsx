'use client'

import React from 'react'
import Rail from '@/components/shell/Rail'
import Sidebar from '@/components/shell/Sidebar'
import MainHeader from '@/components/shell/MainHeader'
import { useIsMobile } from '@/hooks/use-mobile'
import { useUI } from '@/stores/ui'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const { sidebarOpen, setSidebarOpen } = useUI()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-t1 relative">
      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] animate-in fade-in duration-300" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Navigation (Fixed Rail + Sidebar) */}
      <div className={cn(
        "flex h-full shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] z-50",
        isMobile ? "fixed left-0 top-0 shadow-2xl" : "relative translate-x-0",
        isMobile && !sidebarOpen && "-translate-x-full"
      )}>
        {/* Fixed Navigation Rail */}
        <Rail />

        {/* Dynamic Sidebar */}
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative h-full">
        <MainHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-in fade-in duration-200 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  )
}
