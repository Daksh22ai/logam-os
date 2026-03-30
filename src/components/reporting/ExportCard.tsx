'use client'

import React from 'react'
import { FileDown, Globe, Mail } from 'lucide-react'

export default function ExportCard() {
  return (
    <div className="bg-s1 border border-b1 rounded-[var(--r12)] p-6 mt-8 flex flex-col md:flex-row items-center gap-6">
      <div className="w-14 h-14 bg-s2 rounded-[var(--r10)] flex items-center justify-center text-acc shrink-0 border border-b1">
        <FileDown size={28} />
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-[16px] font-bold mb-1">Ready to deliver the results?</h3>
        <p className="text-[13px] text-t3 leading-relaxed max-w-[480px]">
          Generate a professional, white-labelled report with AI-written insights. 
          Your client will see a branded portal or a PDF summary, depending on your preference.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
        <button className="flex items-center justify-center gap-2 px-[18px] py-[9px] rounded-[var(--r8)] border border-b1 bg-s2 text-t1 text-[13px] font-semibold hover:bg-s3 transition-all">
          <Globe size={14} />
          Client Portal Link
        </button>
        <button className="flex items-center justify-center gap-2 px-[18px] py-[9px] rounded-[var(--r8)] bg-acc text-black text-[13px] font-bold hover:bg-[#ffd235] transition-all">
          <Mail size={14} />
          Send via Email
        </button>
      </div>
    </div>
  )
}
