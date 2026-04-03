'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Bot, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RAIL_BRANDS } from '@/lib/data/brands'

export default function Rail() {
  const params = useParams()
  const router = useRouter()
  const brandId = params?.brandId as string

  return (
    <div className="w-rail bg-bg border-r border-b1 flex flex-col items-center py-[10px] gap-1 flex-shrink-0 z-50">
      <Link 
        href="/dashboard" 
        className="w-[34px] h-[34px] bg-acc rounded-[var(--r8)] flex items-center justify-center text-black font-extrabold text-[13px] cursor-pointer mb-1 group relative transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[var(--r12)] hover:scale-105 active:scale-95"
      >
        L
        <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-s3 text-t1 text-[11.5px] px-[9px] py-1 rounded-[var(--r6)] whitespace-nowrap pointer-events-none opacity-0 z-[200] border border-b2 group-hover:opacity-100 transition-opacity duration-150 delay-200">
          Dashboard
        </div>
      </Link>

      <div className="w-[26px] h-[1px] bg-b1 my-1 shrink-0" />

      <div className="overflow-y-auto overflow-x-hidden flex flex-col items-center gap-1 flex-1 w-full pb-1 scrollbar-none">
        {RAIL_BRANDS.map((brand) => (
          <button
            key={brand.id}
            onClick={() => router.push(`/${brand.id}/reporting`)}
            className={cn(
              "group w-[34px] h-[34px] rounded-[var(--r8)] flex items-center justify-center font-bold text-[12px] cursor-pointer relative shrink-0 transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[var(--r12)] hover:scale-110 active:scale-95",
              brandId === brand.id && "outline outline-2 outline-acc outline-offset-2 rounded-[var(--r12)]"
            )}
            style={{ 
              backgroundColor: `${brand.color}26`,
              color: brand.color 
            }}
          >
            {brand.short}
            {brand.alert && (
              <div className="absolute -top-[2px] -right-[2px] w-2 h-2 rounded-full bg-red border-2 border-bg" />
            )}
            <div className={cn(
              "absolute bottom-0.5 right-0.5 w-[6px] h-[6px] rounded-full border-[1.5px] border-bg",
              brand.alert === 'critical' ? "bg-orn" : "bg-grn"
            )} />
            <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-s3 text-t1 text-[11.5px] px-[9px] py-1 rounded-[var(--r6)] whitespace-nowrap pointer-events-none opacity-0 z-[200] border border-b2 group-hover:opacity-100 font-medium transition-opacity duration-150 delay-200">
              {brand.name}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-1 pt-1">
        <div className="w-[26px] h-[1px] bg-b1 my-1 shrink-0" />
        
        <Link 
          href="/chat"
          className="w-[34px] h-[34px] rounded-[var(--r8)] flex items-center justify-center text-t3 cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-acc/15 hover:text-acc hover:scale-110 active:scale-95 group relative"
        >
          <Bot size={16} />
          <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-s3 text-t1 text-[11.5px] px-[9px] py-1 rounded-[var(--r6)] whitespace-nowrap pointer-events-none opacity-0 z-[200] border border-b2 group-hover:opacity-100 transition-opacity duration-150 delay-200">
            Logam AI
          </div>
        </Link>

        <button className="w-[34px] h-[34px] rounded-[var(--r8)] flex items-center justify-center text-t3 cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-s2 hover:text-t1 hover:scale-110 active:scale-95 group relative">
          <Settings size={16} />
          <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-s3 text-t1 text-[11.5px] px-[9px] py-1 rounded-[var(--r6)] whitespace-nowrap pointer-events-none opacity-0 z-[200] border border-b2 group-hover:opacity-100 transition-opacity duration-150 delay-200">
            Settings
          </div>
        </button>

        <div className="w-[30px] h-[30px] rounded-full bg-acc2 border-[1.5px] border-acc3 flex items-center justify-center font-bold text-[11px] color-acc cursor-pointer group relative">
          R
          <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-s3 text-t1 text-[11.5px] px-[9px] py-1 rounded-[var(--r6)] whitespace-nowrap pointer-events-none opacity-0 transition-opacity duration-100 z-[200] border border-b2 group-hover:opacity-100">
            Rishi — Admin
          </div>
        </div>
      </div>
    </div>
  )
}
