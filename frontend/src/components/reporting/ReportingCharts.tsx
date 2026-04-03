'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useUI } from '@/stores/ui'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ChartCardProps {
  title: string
  children: React.ReactNode
}

const ChartCard = ({ title, children }: ChartCardProps) => (
  <div className="bg-s1 border border-b1 rounded-[var(--r10)] p-4 flex flex-col h-full">
    <div className="text-[11px] font-semibold text-t3 uppercase tracking-[0.6px] mb-3.5 shrink-0">{title}</div>
    <div className="flex-1 min-h-0 flex flex-col">
      {children}
    </div>
  </div>
)

export default function ReportingCharts({ brandType, activePlatform }: { brandType: string, activePlatform: string }) {
  const isEc = brandType.toLowerCase().includes('ecommerce')
  const { selectedWeek, setSelectedWeek } = useUI()

  // Trend Chart Data
  const getTrendData = () => {
    switch(activePlatform) {
      case 'google': return {
        label: isEc ? "ROAS" : "Cost Per Conversion",
        values: [48, 52, 49, 61, 58, 66, 71, 75],
        spend: [70000, 75000, 72000, 85000, 81000, 92000, 98000, 102000],
        convs: [145, 144, 146, 139, 139, 139, 138, 136]
      }
      case 'combined': return {
        label: isEc ? "Blended ROAS" : "Blended CPL",
        values: [45, 51, 47, 59, 56, 65, 69, 73],
        spend: [150000, 160000, 155000, 180000, 175000, 200000, 215000, 225000],
        convs: [333, 313, 329, 305, 312, 307, 311, 308]
      }
      default: return {
        label: isEc ? "ROAS" : "CPL",
        values: [42, 50, 46, 58, 55, 64, 68, 72],
        spend: [80000, 85000, 83000, 95000, 94000, 108000, 117000, 123000],
        convs: [190, 170, 180, 163, 170, 168, 172, 170]
      }
    }
  }

  const pd = getTrendData()
  const maxVal = Math.max(...pd.values)

  // Chart.js Data — reactive to activePlatform
  const getSpendData = () => {
    switch(activePlatform) {
      case 'meta':   return { labels: ['Meta Ads'], data: [240000], colors: ['#f5c518'], total: '₹2.4L' }
      case 'google': return { labels: ['Google Ads'], data: [180000], colors: ['#34A853'], total: '₹1.8L' }
      default:       return { labels: ['Meta Ads', 'Google Ads'], data: [240000, 180000], colors: ['#f5c518', '#34A853'], total: '₹4.2L' }
    }
  }
  const sd = getSpendData()
  const spendData = {
    labels: sd.labels,
    datasets: [{
      data: sd.data,
      backgroundColor: sd.colors,
      borderWidth: 0,
      hoverOffset: 2,
    }],
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-2.5 mb-4 items-stretch">
      {/* Trend Chart */}
      <ChartCard title={`${pd.label} Trend — Last 8 Weeks`}>
        <div className="flex items-end gap-1.25 flex-1 mt-auto relative pt-8">
          {pd.values.map((v, idx) => {
            const isSelected = selectedWeek === idx + 1;
            const isLastButNoSelection = selectedWeek === null && idx === pd.values.length - 1;
            const highlighted = isSelected || isLastButNoSelection;
            
            return (
              <div 
                key={idx} 
                className="flex-1 flex flex-col items-center gap-0.75 h-full justify-end group cursor-pointer relative"
                onClick={() => setSelectedWeek(isSelected ? null : idx + 1)}
              >
                {/* Tooltip */}
                {isSelected && (
                  <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-s2 border border-b1 rounded-[8px] p-2.5 shadow-lg z-20 min-w-[120px] pointer-events-none">
                    <div className="text-[10px] font-bold text-t3 uppercase mb-1.5 flex justify-between">
                      Week {idx + 1}
                      <span className="text-acc">🎯</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                      <span className="text-t3">{isEc ? 'ROAS' : 'CPL'}:</span>
                      <span className="text-t1 font-mono font-medium text-right">{isEc ? `${(v/10).toFixed(1)}×` : `₹${v * 5}`}</span>
                      <span className="text-t3">Spend:</span>
                      <span className="text-t1 font-mono text-right">₹{(pd.spend[idx]/1000).toFixed(0)}k</span>
                      <span className="text-t3">Convs:</span>
                      <span className="text-t1 font-mono text-right">{pd.convs[idx]}</span>
                    </div>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-s2 border-r border-b border-b1 rotate-45" />
                  </div>
                )}

                <div className={cn(
                  "text-[9px] text-t3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono",
                  highlighted && "opacity-100"
                )}>
                  {isEc ? `${(v/10).toFixed(1)}×` : `₹${v * 5}`}
                </div>
                <div 
                  className={cn(
                    "w-full rounded-[var(--r4)] transition-all duration-200 min-h-[4px]",
                    highlighted ? "bg-acc shadow-[0_0_10px_rgba(245,197,24,0.3)]" : "bg-s4 group-hover:bg-s3"
                  )}
                  style={{ height: `${Math.round((v / maxVal) * 100)}%` }}
                />
                <div className={cn(
                  "text-[9px] whitespace-nowrap mt-1 transition-colors",
                  highlighted ? "text-t1 font-medium" : "text-t4"
                )}>
                  W{idx + 1}
                </div>
              </div>
            )
          })}
        </div>
      </ChartCard>

      {/* Spend Donut */}
      <ChartCard title="Spend by Platform">
        <div className="flex flex-col items-center justify-center gap-3.5 flex-1">
          <div className="relative w-24 h-24">
            <Doughnut 
              data={spendData} 
              options={{
                cutout: '75%',
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                maintainAspectRatio: false
              }} 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-t3 uppercase tracking-[0.5px]">Total</span>
              <span className="text-[13px] font-bold font-mono">{sd.total}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
            {sd.labels.map((label, i) => (
              <div key={label} className="flex items-center gap-1.5 text-[11px] text-t2">
                <div className="w-[7px] h-[7px] rounded-full" style={{ backgroundColor: sd.colors[i] }} />
                {label}
                <div className="ml-auto font-semibold text-t1 font-mono">
                  {sd.data[i] >= 100000 ? `₹${(sd.data[i]/100000).toFixed(1)}L` : `₹${(sd.data[i]/1000).toFixed(0)}K`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      {/* Hook Rate Trend */}
      <ChartCard title="Hook Rate Trend">
        <div className="flex flex-col h-full">
          <div className="text-center py-2.5 shrink-0">
            <div className="font-display text-[30px] font-bold tracking-[-1px] text-acc leading-none">38%</div>
            <div className="text-[11px] text-t3 mt-1">3-sec views / impressions</div>
          </div>
          <div className="flex items-end gap-0.5 mt-auto h-12">
            {[28, 32, 35, 30, 38, 36, 40, 38].map((v, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex-1 rounded-[2px] min-h-[3px]",
                  i === 7 ? "bg-acc" : "bg-s4"
                )}
                style={{ height: `${Math.round((v / 40) * 100)}%` }}
              />
            ))}
          </div>
        </div>
      </ChartCard>
    </div>
  )
}
