import React from 'react'
import Rail from '@/components/shell/Rail'
import Sidebar from '@/components/shell/Sidebar'
import MainHeader from '@/components/shell/MainHeader'
import AIPanel from '@/components/shell/AIPanel'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-t1">
      {/* Fixed Navigation Rail */}
      <Rail />

      {/* Dynamic Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <MainHeader />
        
        <main className="flex-1 overflow-y-auto p-5 animate-in fade-in duration-200">
          {children}
        </main>

        {/* AI Slide-in Panel */}
        <AIPanel />
      </div>
    </div>
  )
}
