'use client'

import React from 'react'
import { Info } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Data Pull — Every 15 Minutes",
      desc: "The system calls Meta Ads Insights API automatically using your connected ad account token. It fetches campaign, ad set, and creative metrics: impressions, clicks, spend, CTR, ROAS/CPL, frequency, hook rate.",
      code: "GET /act_{ad_account_id}/insights?fields=spend,impressions,clicks,ctr,actions,frequency&date_preset=last_7d"
    },
    {
      num: 2,
      title: "Anomaly Detection — Statistical Comparison",
      desc: "Each metric is compared against its 30-day rolling average. If CTR drops more than 35% in 5 days while frequency exceeds 3.5×, that's classified as creative fatigue."
    },
    {
      num: 3,
      title: "AI Explanation — Claude API",
      desc: "Detected anomalies are sent to Claude AI with the full metric context. Claude generates a plain-English explanation of what happened, why it likely happened, and what the recommended action is."
    },
    {
      num: 4,
      title: "Delivery — You see it here + WhatsApp/Email",
      desc: "Critical alerts appear here immediately. A WhatsApp notification is also sent to the account manager. You always know before your client does."
    }
  ]

  return (
    <div className="bg-s1 border border-b1 rounded-[var(--r12)] p-5 mb-4 animate-in fade-in duration-300">
      <div className="text-[13.5px] font-semibold mb-3.5 flex items-center gap-2">
        <Info size={16} className="text-acc" />
        How AI Alert Detection Works
        <span className="text-[11px] text-t3 font-normal ml-auto">Behind the scenes logic</span>
      </div>
      
      <div className="flex flex-col gap-2.5">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-3 items-start group">
            <div className="w-[22px] h-[22px] rounded-full bg-acc2 border border-acc3 flex items-center justify-center text-[10.5px] font-bold text-acc shrink-0 font-display">
              {step.num}
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold mb-0.5 group-hover:text-acc transition-colors">{step.title}</div>
              <div className="text-[12px] text-t2 leading-relaxed">{step.desc}</div>
              {step.code && (
                <div className="font-mono text-[11px] text-acc bg-acc2 px-1.5 py-0.5 rounded-[var(--r4)] mt-1 inline-block">
                  {step.code}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
