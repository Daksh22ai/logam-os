import React, { memo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Bot, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RAIL_BRANDS } from '@/lib/data/brands'

function Rail() {
  const params = useParams()
  const router = useRouter()
  const brandId = params?.brandId as string

  return (
    <div className="w-rail bg-bg border-r border-b1 flex flex-col items-center py-[12px] gap-2 flex-shrink-0 z-50 h-full">
      <Link 
        href="/dashboard" 
        className="w-[38px] h-[38px] bg-acc rounded-[var(--r10)] flex items-center justify-center text-black font-extrabold text-[14px] cursor-pointer mb-2 group relative transition-all duration-300 ease-[var(--transition-premium)] hover:rounded-[var(--r12)] hover:scale-105 active:scale-95 shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-hover)]"
      >
        L
        <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-s3/90 backdrop-blur-md text-t1 text-[11.5px] px-[10px] py-1.5 rounded-[var(--r6)] whitespace-nowrap pointer-events-none opacity-0 z-[200] border border-b2 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0">
          Dashboard
        </div>
      </Link>

      <div className="w-[28px] h-[1px] bg-b1 my-1 shrink-0 opacity-50" />

      <div className="overflow-y-auto overflow-x-hidden flex flex-col items-center gap-2 flex-1 w-full pb-2 scrollbar-none px-2">
        {RAIL_BRANDS.map((brand) => (
          <button
            key={brand.id}
            onClick={() => router.push(`/${brand.id}/reporting`)}
            className={cn(
              "group w-[38px] h-[38px] rounded-[var(--r10)] flex items-center justify-center font-bold text-[12.5px] cursor-pointer relative shrink-0 transition-all duration-300 ease-[var(--transition-premium)] hover:rounded-[var(--r12)] hover:scale-110 active:scale-95",
              brandId === brand.id 
                ? "outline outline-2 outline-acc outline-offset-2 rounded-[var(--r12)] bg-acc2" 
                : "hover:bg-s2/50"
            )}
            style={{ 
              backgroundColor: brandId === brand.id ? `${brand.color}33` : `${brand.color}1a`,
              color: brand.color 
            }}
          >
            {brand.short}
            {brand.alert && (
              <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 rounded-full bg-red border-2 border-bg shadow-sm" />
            )}
            <div className={cn(
              "absolute bottom-0.5 right-0.5 w-[7px] h-[7px] rounded-full border-[1.5px] border-bg",
              brand.alert === 'critical' ? "bg-orn" : "bg-grn"
            )} />
            <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-s3/90 backdrop-blur-md text-t1 text-[11.5px] px-[10px] py-1.5 rounded-[var(--r6)] whitespace-nowrap pointer-events-none opacity-0 z-[200] border border-b2 group-hover:opacity-100 font-medium transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0">
              {brand.name}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-2 pt-2 pb-1">
        <div className="w-[28px] h-[1px] bg-b1 my-1 shrink-0 opacity-50" />
        
        <Link 
          href="/chat"
          className="w-[38px] h-[38px] rounded-[var(--r10)] flex items-center justify-center text-t3 cursor-pointer transition-all duration-300 ease-[var(--transition-premium)] hover:bg-acc/15 hover:text-acc hover:scale-110 active:scale-95 group relative"
        >
          <Bot size={18} />
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-s3/90 backdrop-blur-md text-t1 text-[11.5px] px-[10px] py-1.5 rounded-[var(--r6)] whitespace-nowrap pointer-events-none opacity-0 z-[200] border border-b2 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0">
            Logam AI
          </div>
        </Link>

        <button className="w-[38px] h-[38px] rounded-[var(--r10)] flex items-center justify-center text-t3 cursor-pointer transition-all duration-300 ease-[var(--transition-premium)] hover:bg-s2 hover:text-t1 hover:scale-110 active:scale-95 group relative">
          <Settings size={18} />
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-s3/90 backdrop-blur-md text-t1 text-[11.5px] px-[10px] py-1.5 rounded-[var(--r6)] whitespace-nowrap pointer-events-none opacity-0 z-[200] border border-b2 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0">
            Settings
          </div>
        </button>

        <div className="w-[34px] h-[34px] rounded-full bg-acc2 border-[1.5px] border-acc3 flex items-center justify-center font-bold text-[12px] text-acc cursor-pointer group relative transition-transform hover:scale-105 active:scale-95 shadow-sm">
          R
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-s3/90 backdrop-blur-md text-t1 text-[11.5px] px-[10px] py-1.5 rounded-[var(--r6)] whitespace-nowrap pointer-events-none opacity-0 transition-all duration-200 z-[200] border border-b2 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0">
            Rishi — Admin
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Rail)
