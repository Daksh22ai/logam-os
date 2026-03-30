'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ChatMessage from '@/components/chat/ChatMessage'
import ChatInput from '@/components/chat/ChatInput'

const MOCK_BRANDS = [
  { id: 'hobby', name: 'Hobby India', roas: '7.2×', cpl: null },
  { id: 'fitness', name: 'Fitness Fox', roas: '5.1×', cpl: null },
  { id: 'sahajanand', name: 'Sahajanand Elite', roas: null, cpl: '₹380' },
]

export default function ChannelPage() {
  const params = useParams()
  const brandId = params?.brandId as string
  const channel = params?.channel as string
  const brand = MOCK_BRANDS.find(b => b.id === brandId) || MOCK_BRANDS[0]

  const getChannelData = () => {
    switch(channel) {
      case 'general': return [
        {n:'Rishi',i:'R',c:'#f5c518',bg:'rgba(245,197,24,.15)',time:'10:14 AM',text:`Hobby India ROAS looking great this week 🎯 Good work on the creative refresh. Let's maintain momentum.`,reactions:['🔥 3','✅ 2']},
        {n:'Karan',i:'K',c:'#3b82f6',bg:'rgba(59,130,246,.15)',time:'10:31 AM',text:`Thanks! The "do kids get bored?" hook is really working. Should we test a similar angle for <strong>Bodyleaf</strong> — health version?`,reactions:['👀 1']},
        {n:'Priya',i:'P',c:'#a855f7',bg:'rgba(168,85,247,.15)',time:'10:45 AM',text:`Good call. I can write 3 variations. @Rishi — Fitness Fox client asking for monthly report. Thursday call work?`,reactions:[]},
        {n:'Rishi',i:'R',c:'#f5c518',bg:'rgba(245,197,24,.15)',time:'11:02 AM',text:`Thursday works. Also — everyone see the AI alert on <strong>${brand.name}</strong>? Creative fatigue on main set. Need new hooks by Wednesday EOD.`,reactions:['✅ 3']},
      ]
      case 'creative-team': return [
        {n:'Arjun',i:'A',c:'#22c55e',bg:'rgba(34,197,94,.15)',time:'9:30 AM',text:`Sharing 3 creative concepts for ${brand.name}. Angle 1: problem-agitate. Angle 2: social proof + before/after. Angle 3: limited time offer.`,images:true,reactions:['👀 4']},
        {n:'Karan',i:'K',c:'#3b82f6',bg:'rgba(59,130,246,.15)',time:'9:52 AM',text:`Angle 2 is strongest based on data — social proof drove +34% CTR last quarter for a similar ICP. Can we get video format for this one?`,reply:'Sharing 3 creative concepts…',reactions:['✅ 2']},
      ]
      case 'media-buyers': return [
        {n:'Karan',i:'K',c:'#3b82f6',bg:'rgba(59,130,246,.15)',time:'8:00 AM',text:`Morning check. ${brand.name} primary metric ${brand.roas || brand.cpl} — tracking. CTR down on Campaign 3, paused to investigate. Update by noon.`,reactions:[]},
        {n:'Rishi',i:'R',c:'#f5c518',bg:'rgba(245,197,24,.15)',time:'8:22 AM',text:`Good catch. Check for audience overlap with Campaign 1 first. Also AI flagged frequency at 4.8× on main creative — likely root cause.`,reply:'Morning check…',reactions:['✅ 1']},
      ]
      case 'updates': return [
        {n:'Priya',i:'P',c:'#a855f7',bg:'rgba(168,85,247,.15)',time:'Yesterday 5:00 PM',text:`Draft weekly update for ${brand.name} client — AI generated from campaign data. Ready to review and send.`,reactions:[]},
        {n:'AI Draft',i:'✦',c:'#f5c518',bg:'rgba(245,197,24,.15)',time:'Yesterday 5:01 PM',text:`<em>Hi [Client Name],<br><br>Quick update on this week's performance:<br>• ${brand.roas ? `ROAS at ${brand.roas}` : brand.cpl ? `CPL at ${brand.cpl}` : ''} — up from last month<br>• CTR holding across active campaigns<br>• Creative refresh launching Wednesday — expect improvement within 3–5 days<br><br>Best,<br>Logam Digital</em>`,reactions:['✅ 2']},
      ]
      case 'notes': return [
        {n:'Karan',i:'K',c:'#3b82f6',bg:'rgba(59,130,246,.15)',time:'3 days ago',text:`Strategy note: ${brand.name} client mentioned competitor launched similar offering at 20% lower price. Budget flexibility confirmed up to ₹2.5L.`,reactions:['📌 1']},
      ]
      default: return []
    }
  }

  const messages = getChannelData()

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-200">
      <div className="flex-1 overflow-y-auto p-[8px_0] flex flex-col gap-0">
        <div className="text-center text-[11px] text-t3 py-2.5 flex items-center gap-2.5 shrink-0 before:flex-1 before:h-px before:bg-b1 after:flex-1 after:h-px after:bg-b1">
          Today
        </div>
        
        <div className="flex flex-col">
          {messages.map((m, idx) => (
            <ChatMessage key={idx} {...m} />
          ))}
        </div>
      </div>
      
      <ChatInput placeholder={`#${channel}`} />
    </div>
  )
}
