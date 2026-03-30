'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import { useUI } from '@/stores/ui'
import { cn } from '@/lib/utils'

interface AIInsightCardProps {
  content: string
  severity: 'good' | 'warning' | 'critical' | 'info'
  brandName?: string
  brandType?: string
}

export default function AIInsightCard({ content, severity, brandName = 'the client', brandType = '' }: AIInsightCardProps) {
  const { toggleAIPanel, setAIPrompt } = useUI()

  const handleCreativeBrief = () => {
    const prompt = `Create a detailed creative brief for ${brandName}.\n\nUse the following campaign performance data:\n- CTR: 3.8%\n- ROAS: 7.2x\n- Frequency: 2.8x\n- Top Hook: "Do kids get bored?" (+34% vs benchmark)\n- Fatigued Set: "DIY Canvas" (CTR dropped 4.1% -> 1.8%)\n\nGoal:\nGenerate a creative brief for the next ad iteration.\n\nInclude:\n- Hook suggestions\n- Opening frame ideas\n- Messaging angle\n- Format recommendation\n- Target audience\n- CTA suggestions`
    
    const response = `Here is a data-driven creative brief for ${brandName}:\n\n**1. Hook Suggestions**\n- "Still buying expensive toys they play with once?" (Pain point)\n- "The 10-minute activity that keeps kids busy for hours." (Curiosity)\n\n**2. Opening Frame Ideas**\n- Show a messy room full of untouched plastic toys, cut quickly to a child deeply engaged with the product.\n- Fast-paced 3-second montage of kids painting/building.\n\n**3. Messaging Angle**\nShift from "DIY Canvas" (which is fatiguing) to "Screen-free Development". Focus on the educational/developmental benefits rather than just the craft aspect.\n\n**4. Format Recommendation**\n- User Generated Content (UGC) Reel style.\n- Under 30 seconds.\n- Native text overlays.\n\n**5. Target Audience**\n- Broad audience focusing on parents 25-45.\n- Exclude recent purchasers (30 days).\n\n**6. CTA Suggestions**\n- "Shop the ultimate boredom buster"\n- "Get 15% off your first kit"`
    
    setAIPrompt(prompt, response)
  }

  const handleClientSummary = () => {
    const metricLabel = brandType.toLowerCase().includes('ecommerce') ? 'ROAS' : 'CPL'
    const metricValue = brandType.toLowerCase().includes('ecommerce') ? '7.2x' : '₹380'
    
    const prompt = `Prepare a client-ready performance summary for ${brandName}.\n\nUse the following data:\n- ${metricLabel}: ${metricValue}\n- Spend: ₹2,40,000\n- CTR: 3.8%\n\nWrite a short professional summary that explains:\n- What worked this week\n- What changed\n- Any risks\n- Recommended actions\n\nTone:\nProfessional but simple for non-technical clients.`
    
    const response = `**Weekly Performance Summary: ${brandName}**\n\n**What Worked This Week**\nPerformance has been exceptionally strong this week. Our primary metric (${metricLabel}) is holding steady at a highly profitable ${metricValue}. The standout performer was our new video hook, which is driving a 3.8% CTR—performing 34% better than our historical account average.\n\n**What Changed**\nWe maintained an efficient spend of ₹2,40,000 while successfully scaling the new retargeting cohorts we launched last Thursday.\n\n**Risks to Monitor**\nWe are noticing early signs of creative fatigue on the older "DIY Canvas" ad set. The frequency has reached 4.8x, and engagement has steadily dropped over the last 6 days.\n\n**Recommended Actions**\n1. We recommend pausing the fatigued "DIY Canvas" creative by tomorrow.\n2. We have already generated a new creative brief and our production team is preparing a fresh batch of UGC-style videos to launch on Wednesday to replace it and maintain our current ${metricLabel}.`
    
    setAIPrompt(prompt, response)
  }

  return (
    <div className="bg-s1 border border-acc/25 rounded-[var(--r12)] p-4 mb-4 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(245,197,24,0.05)_0%,transparent_55%)] pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-2.5 relative z-10">
        <div className="flex items-center gap-[5px] bg-acc2 border border-acc/20 color-acc text-[10.5px] font-bold px-[9px] py-[3px] rounded-[14px] uppercase tracking-[0.6px] text-acc">
          <div className="w-[5px] h-[5px] rounded-full bg-acc animate-pulse" />
          ✦ AI INSIGHT
        </div>
        <div className={cn(
          "flex items-center gap-1.25 text-[11px] px-2 py-0.5 rounded-[10px]",
          severity === 'good' ? "bg-grn2 text-grn" : 
          severity === 'warning' ? "bg-orn2 text-orn" : 
          severity === 'critical' ? "bg-red2 text-red" : "bg-blu2 text-blu"
        )}>
          {severity === 'good' ? '✓ Performing Well' : severity === 'warning' ? '⚠ Needs Attention' : severity === 'critical' ? '⚡ Critical Deviation' : 'ℹ Informational'}
        </div>
        <span className="text-[11px] text-t3 ml-auto">Generated just now</span>
      </div>

      <div 
        className="text-[13.5px] text-t1 leading-relaxed mb-3 relative z-10"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="flex gap-1.5 flex-wrap relative z-10">
        <button 
          onClick={toggleAIPanel}
          className="px-[11px] py-[5px] rounded-[var(--r6)] bg-acc text-black text-[12px] font-bold transition-all duration-150 hover:bg-[#ffd235]"
        >
          Ask AI Follow-up
        </button>
        <button 
          onClick={handleCreativeBrief}
          className="px-[11px] py-[5px] rounded-[var(--r6)] border border-b1 bg-s2 text-t2 text-[12px] font-medium transition-all duration-150 hover:bg-s3 hover:text-t1 hover:border-b2"
        >
          Create Creative Brief
        </button>
        <button 
          onClick={handleClientSummary}
          className="px-[11px] py-[5px] rounded-[var(--r6)] border border-b1 bg-s2 text-t2 text-[12px] font-medium transition-all duration-150 hover:bg-s3 hover:text-t1 hover:border-b2"
        >
          Prepare Client Summary
        </button>
      </div>
    </div>
  )
}
