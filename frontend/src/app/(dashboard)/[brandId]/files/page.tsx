'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { Folder, Upload } from 'lucide-react'

const MOCK_BRANDS = [
  { id: 'hobby', name: 'Hobby India' },
  { id: 'fitness', name: 'Fitness Fox' },
  { id: 'sahajanand', name: 'Sahajanand Elite' },
]

export default function FilesPage() {
  const params = useParams()
  const brandId = params?.brandId as string
  const brand = MOCK_BRANDS.find(b => b.id === brandId) || MOCK_BRANDS[0]

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-300">
      <div className="w-20 h-20 bg-s2 rounded-full border border-b1 flex items-center justify-center text-t3 mb-6">
        <Folder size={40} />
      </div>
      
      <h2 className="text-lg font-bold font-display mb-2 text-t1">Files & Assets — {brand.name}</h2>
      <p className="text-t3 text-[13px] max-w-[320px] leading-relaxed mb-8">
        Brand guidelines, creative assets, reports, and client documents. 
        All in one place, shared with the team.
      </p>

      <button className="flex items-center gap-2 px-6 py-2.5 rounded-[var(--r8)] bg-acc text-black text-[13px] font-bold hover:bg-[#ffd235] transition-all">
        <Upload size={16} strokeWidth={2.5} />
        Upload Files
      </button>
    </div>
  )
}
