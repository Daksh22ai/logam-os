'use client'

import React from 'react'
import ScopeCard from '@/components/finance/ScopeCard'

const BRANDS = [
  {id:'hobby',name:'Hobby India',type:'E-Commerce',margin:24,hrs:18,contract:30,spend:'₹2.4L'},
  {id:'fitness',name:'Fitness Fox',type:'E-Commerce · NZ',margin:11,hrs:32,contract:30,spend:'$3.9K'},
  {id:'nova',name:'Nova Jewels',type:'Jewellery · LA',margin:18,hrs:15,contract:20,spend:'$1.8K'},
  {id:'sahajanand',name:'Sahajanand Elite',type:'Real Estate',margin:21,hrs:22,contract:30,spend:'₹1.8L'},
  {id:'bodyleaf',name:'Bodyleaf',type:'Health · D2C',margin:14,hrs:12,contract:15,spend:'₹85K'},
  {id:'ecotrip',name:'EcoTrip',type:'Travel',margin:9,hrs:24,contract:20,spend:'₹60K'},
  {id:'zoyalty',name:'Zoyalty',type:'Real Estate',margin:19,hrs:14,contract:25,spend:'₹1.4L'},
  {id:'casa',name:'Casa Amplio',type:'Real Estate',margin:16,hrs:28,contract:30,spend:'₹2.2L'},
]

export default function ScopeTrackerPage() {
  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-display mb-1.5">Scope & Margin Tracker</h2>
        <p className="text-t3 text-[13px]">Real-time visibility into client profitability and team capacity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-10">
        {BRANDS.map((b) => (
          <ScopeCard 
            key={b.id}
            name={b.name}
            type={b.type}
            margin={b.margin}
            hoursActual={b.hrs}
            hoursContract={b.contract}
            budgetSpent={b.spend}
            budgetTotal={b.spend} // Mocked
          />
        ))}
      </div>
    </div>
  )
}
