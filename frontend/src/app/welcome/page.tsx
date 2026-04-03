'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, BarChart3, Bell, Zap, Users, TrendingUp, Shield } from 'lucide-react'
import LaserFlow from './LaserFlow'

// ─── PARTICLE CANVAS ────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    // Particle system
    const COUNT = Math.min(Math.floor(W * H / 14000), 90)
    interface Particle {
      x: number; y: number; vx: number; vy: number
      size: number; opacity: number; pulse: number; pulseSpeed: number
    }

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.015,
    }))

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', onMouse)
    window.addEventListener('resize', onResize)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      particles.forEach((p, i) => {
        // Subtle mouse repulsion
        const dx = mx - p.x
        const dy = my - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.4
          p.vx -= (dx / dist) * force
          p.vy -= (dy / dist) * force
        }

        // Damping + drift
        p.vx *= 0.97
        p.vy *= 0.97
        p.vx += (Math.random() - 0.5) * 0.02
        p.vy += (Math.random() - 0.5) * 0.02

        p.x += p.vx
        p.y += p.vy
        p.pulse += p.pulseSpeed

        // Wrap around
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        // Draw particle
        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245,197,24,${alpha * 0.6})`
        ctx.fill()

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const cdx = p.x - q.x
          const cdy = p.y - q.y
          const d = Math.sqrt(cdx * cdx + cdy * cdy)
          if (d < 110) {
            const lineAlpha = (1 - d / 110) * 0.12
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(245,197,24,${lineAlpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.8 }}
    />
  )
}

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
function MagneticBtn({
  children, onClick, className = '', variant = 'primary'
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'ghost'
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setPos({ x: (e.clientX - cx) * 0.28, y: (e.clientY - cy) * 0.28 })
  }

  const base = `relative font-bold text-[14px] rounded-[12px] flex items-center gap-2 px-6 py-3
    transition-[box-shadow] duration-200 select-none cursor-pointer`
  const styles = variant === 'primary'
    ? 'bg-acc text-black hover:bg-[#ffd235] shadow-[0_0_0_0_rgba(245,197,24,0)] hover:shadow-[0_8px_32px_rgba(245,197,24,0.25)]'
    : 'bg-s2 border border-b2 text-t1 hover:bg-s3 hover:border-b3'

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      className={`${base} ${styles} ${className}`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.15s cubic-bezier(0.23,1,0.32,1), box-shadow 0.2s'
      }}
    >
      {children}
    </button>
  )
}

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
function useCounter(end: number, duration: number = 2000, active: boolean = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * end))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration, active])
  return count
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── FEATURE CARD ────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, color, delay = 0 }: {
  icon: React.ElementType; title: string; desc: string; color: string; delay?: number
}) {
  const { ref, visible } = useScrollReveal()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-s1 border border-b1 rounded-[14px] p-5 cursor-pointer relative overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.98)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, border-color 0.2s, box-shadow 0.2s`,
        borderColor: hovered ? `${color}40` : undefined,
        boxShadow: hovered ? `0 0 40px ${color}10, 0 8px 24px rgba(0,0,0,0.3)` : undefined,
      }}
    >
      {/* Glow orb on hover */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[14px] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${color}08 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-3 relative"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <h3 className="text-[14px] font-semibold mb-1.5 relative">{title}</h3>
      <p className="text-[12.5px] text-t3 leading-relaxed relative">{desc}</p>
    </div>
  )
}

// ─── DATA CONSTANTS ───────────────────────────────────────────────────────────
const FEATURES = [
  { icon: BarChart3, title: 'Automated Reporting', desc: 'Meta + Google → AI narrative → Client report. Get 15 hours/month back.', color: '#f5c518' },
  { icon: Bell, title: 'Anomaly Detection', desc: 'CTR dropped 40% overnight? Know before your client does. Zero missed crises.', color: '#22c55e' },
  { icon: Zap, title: 'Creative Intelligence', desc: 'Track hook angles, CTR, and fatigue onset. Brief from data, not gut feel.', color: '#a855f7' },
  { icon: Users, title: 'Team Command', desc: 'Campaign context in team chat. No more "which ad set?" in WhatsApp groups.', color: '#3b82f6' },
  { icon: TrendingUp, title: 'Client Health Score', desc: 'A 0–100 score for every client. Detect churn 3 weeks before the cancellation email.', color: '#f97316' },
  { icon: Shield, title: 'Margin Tracking', desc: 'Real profit per client after hours. Stop discovering 8% margins at month end.', color: '#ef4444' },
]

const STATS = [
  { end: 30, suffix: '+', label: 'Founders interviewed' },
  { end: 15, suffix: 'hrs', label: 'Saved per client / month' },
  { end: 50, suffix: '%', label: 'Faster report delivery' },
  { end: 3, suffix: 'wk', label: 'Earlier churn detection' },
]

const BRANDS_PREVIEW = [
  { short: 'HI', name: 'Hobby India', color: '#7c3aed', bg: 'rgba(124,58,237,.18)', metric: '7.2× ROAS', up: true },
  { short: 'FF', name: 'Fitness Fox', color: '#f97316', bg: 'rgba(249,115,22,.18)', metric: '₹380 CPL', up: false },
  { short: 'SE', name: 'Sahajanand', color: '#a855f7', bg: 'rgba(168,85,247,.18)', metric: '5.8× ROAS', up: true },
  { short: 'NJ', name: 'Nova Jewels', color: '#d4a017', bg: 'rgba(212,160,23,.18)', metric: '₹290 CPL', up: true },
  { short: 'BL', name: 'Bodyleaf', color: '#22c55e', bg: 'rgba(34,197,94,.18)', metric: '4.8× ROAS', up: true },
  { short: 'ET', name: 'EcoTrip', color: '#10b981', bg: 'rgba(16,185,129,.18)', metric: '₹310 CPL', up: false },
]

// ─── HERO DASHBOARD PREVIEW ──────────────────────────────────────────────────
function DashboardPreview() {
  const { ref: scrollRef, visible } = useScrollReveal(0.05)
  const revealImgRef = useRef<HTMLImageElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // LaserFlow mask logic
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const el = revealImgRef.current
    if (el) {
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y + rect.height * 0.5}px`)
    }

    // 3D Tilt logic
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setTilt({
      x: ((e.clientY - cy) / rect.height) * -6,
      y: ((e.clientX - cx) / rect.width) * 6,
    })
  }, [])

  const handleLeave = useCallback(() => {
    const el = revealImgRef.current
    if (el) {
      el.style.setProperty('--mx', '-9999px')
      el.style.setProperty('--my', '-9999px')
    }
    setTilt({ x: 0, y: 0 })
  }, [])

  return (
    <div
      ref={scrollRef}
      className="px-6 max-w-5xl mx-auto mb-20 relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
        perspective: '1200px',
      }}
    >
      <div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s cubic-bezier(0.23,1,0.32,1)',
          transformStyle: 'preserve-3d',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '18px',
          boxShadow: '0 48px 100px rgba(0,0,0,0.7)'
        }}
      >
        {/* User's exact LaserFlow Implementation mapping */}
        <LaserFlow
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0.0}
          color="#f5c518" 
          horizontalSizing={0.5}
          verticalSizing={2}
          wispDensity={1}
          wispSpeed={15}
          wispIntensity={5}
          flowSpeed={0.35}
          flowStrength={0.25}
          fogIntensity={0.45}
          fogScale={0.3}
          fogFallSpeed={0.6}
          decay={1.1}
          falloffStart={1.2}
        />

        <img
          ref={revealImgRef}
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Reveal effect"
          style={{
            position: 'absolute',
            width: '100%',
            top: '-50%',
            zIndex: 5,
            mixBlendMode: 'lighten',
            opacity: 0.2, // Subtle so we don't break the layout legibility
            pointerEvents: 'none',
            '--mx': '-9999px',
            '--my': '-9999px',
            WebkitMaskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
            maskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat'
          } as React.CSSProperties}
        />

        {/* Glow under card */}
        <div
          className="absolute inset-x-8 -bottom-6 h-20 blur-2xl rounded-full pointer-events-none"
          style={{ background: 'rgba(245,197,24,0.07)', zIndex: -1 }}
        />

        <div className="bg-[#0c0c10]/95 backdrop-blur-md border border-[#2a2a38] relative z-10 h-full w-full">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#111118] border-b border-[#1e1e2a]">
            <div className="flex gap-1.5">
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} className="w-[11px] h-[11px] rounded-full" style={{ backgroundColor: c, opacity: 0.85 }} />
              ))}
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-[#1a1a24] border border-[#2a2a38] rounded-[6px] px-3 py-1 text-[11px] text-[#4a4a65] text-center max-w-[220px] mx-auto flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                app.logamos.io
              </div>
            </div>
          </div>

          {/* App shell */}
          <div className="flex" style={{ height: '400px' }}>
            {/* Rail */}
            <div className="w-[50px] bg-[#08080d] border-r border-[#1a1a24] flex flex-col items-center py-3 gap-1.5 shrink-0">
              <div className="w-7 h-7 bg-acc rounded-[7px] flex items-center justify-center text-black font-extrabold text-[10px] mb-1.5">L</div>
              <div className="w-5 h-px bg-[#1e1e2a] my-0.5" />
              {BRANDS_PREVIEW.map((b) => (
                <div key={b.short} className="w-6 h-6 rounded-[5px] flex items-center justify-center text-[9px] font-bold"
                  style={{ backgroundColor: b.bg, color: b.color }}>
                  {b.short}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="w-[160px] bg-[#0a0a0f] border-r border-[#1a1a24] flex flex-col py-3 px-2.5 gap-0.5 shrink-0">
              <div className="text-[8px] uppercase tracking-[0.8px] text-[#3a3a55] font-bold px-1.5 mb-1">Performance</div>
              <div className="px-2 py-1.5 rounded-[5px] bg-[#16161f] text-[10px] font-semibold text-[#e8e8f0] flex items-center gap-1.5">
                <BarChart3 size={10} /> reporting
              </div>
              {['alerts (3)', 'creative-studio'].map(item => (
                <div key={item} className="px-2 py-1.5 text-[10px] text-[#3a3a55] flex items-center gap-1.5">
                  <span className="text-[#2a2a40]">#</span> {item}
                </div>
              ))}
              <div className="text-[8px] uppercase tracking-[0.8px] text-[#3a3a55] font-bold px-1.5 mb-1 mt-2">Client</div>
              {['campaign-notes', 'updates (1)'].map(item => (
                <div key={item} className="px-2 py-1.5 text-[10px] text-[#3a3a55] flex items-center gap-1.5">
                  <span className="text-[#2a2a40]">#</span> {item}
                </div>
              ))}
            </div>

            {/* Main */}
            <div className="flex-1 bg-[#07070b] overflow-hidden p-3">
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#1a1a24]">
                <BarChart3 size={11} className="text-[#3a3a55]" />
                <span className="text-[11px] font-semibold text-[#c8c8e0]">reporting</span>
                <div className="w-px h-3 bg-[#2a2a38] mx-1" />
                <span className="text-[9px] text-[#3a3a55]">Meta + Google · 30 days</span>
                <div className="ml-auto flex gap-1.5">
                  <div className="px-2 py-0.5 rounded-full bg-[#0f2a18] border border-[#22c55e30] text-[#22c55e] text-[8px] font-bold flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-current" /> Meta
                  </div>
                  <div className="px-2 py-0.5 rounded-full border border-[#f5c51830] bg-[#f5c51808] text-acc text-[9px] font-bold">
                    ✦ Ask AI
                  </div>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-5 gap-1.5 mb-2">
                {[
                  { l: 'ROAS', v: '7.2×', c: '#f5c518', d: '+12%', up: true },
                  { l: 'CTR', v: '3.8%', c: '#3b82f6', d: '+0.4%', up: true },
                  { l: 'Impr.', v: '248K', c: '#22c55e', d: '+8%', up: true },
                  { l: 'Spend', v: '₹2.4L', c: '#9898b0', d: '—', up: null },
                  { l: 'Freq.', v: '2.8×', c: '#f97316', d: '+0.6', up: true },
                ].map((k) => (
                  <div key={k.l} className="bg-[#0e0e16] border border-[#1e1e2a] rounded-[7px] p-2">
                    <div className="text-[7px] uppercase tracking-[0.5px] text-[#3a3a55] mb-1">{k.l}</div>
                    <div className="text-[12px] font-bold" style={{ color: k.c }}>{k.v}</div>
                    <div className={`text-[7px] mt-0.5 ${k.up === null ? 'text-[#3a3a55]' : k.up ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{k.d}</div>
                  </div>
                ))}
              </div>

              {/* AI insight pill */}
              <div className="bg-[#0e0e16] border border-[#f5c51820] rounded-[8px] p-2.5 mb-2 flex items-start gap-2">
                <div className="shrink-0 bg-[#f5c51810] border border-[#f5c51825] text-acc text-[7px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-[0.4px]">✦ AI</div>
                <p className="text-[9px] text-[#7878a0] leading-relaxed">
                  <span className="text-[#c8c8e0] font-semibold">ROAS at 7.2× — strong.</span> Creative fatigue building on "DIY Canvas" ad set, frequency 4.8×. Recommend new hook by Wednesday.
                </p>
              </div>

              {/* Sparkline bars */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'ROAS Trend', bars: [42,50,46,58,55,64,68,72] },
                  { label: 'Spend Split', bars: [60,60,60,60,60,60,60,60], donut: true },
                  { label: 'Hook Rate', bars: [28,32,35,30,38,36,40,38] },
                ].map(({ label, bars, donut }, ci) => (
                  <div key={label} className="bg-[#0e0e16] border border-[#1e1e2a] rounded-[7px] p-2">
                    <div className="text-[7px] text-[#3a3a55] uppercase tracking-[0.5px] mb-1.5">{label}</div>
                    <div className="flex items-end gap-0.5 h-9">
                      {bars.map((v, i) => {
                        const max = Math.max(...bars)
                        const isLast = i === bars.length - 1
                        return (
                          <div
                            key={i}
                            className="flex-1 rounded-[2px] transition-all duration-500"
                            style={{
                              height: `${Math.round((v / max) * 100)}%`,
                              backgroundColor: isLast ? '#f5c518' : donut && i < 5 ? '#f5c51830' : '#1a1a28',
                              transitionDelay: `${i * 40}ms`,
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ANIMATED TEXT REVEAL ─────────────────────────────────────────────────────
function TextReveal({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal(0.1)
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          opacity: visible ? 1 : 0,
          transition: `transform 0.7s cubic-bezier(0.23,1,0.32,1) ${delay}ms, opacity 0.5s ease ${delay}ms`,
        }}
      >
        {text}
      </div>
    </div>
  )
}

// ─── BRAND PREVIEW CARD (separate component to use hooks) ─────────────────────
function BrandPreviewCard({ b, index, onClick }: { b: typeof BRANDS_PREVIEW[0]; index: number; onClick: () => void }) {
  const { ref, visible } = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      onClick={onClick}
      className="bg-s1 border border-b1 rounded-[12px] p-3.5 text-center hover:border-b2 hover:bg-s2 cursor-pointer group relative overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.4s ease ${index * 50}ms, transform 0.4s ease ${index * 50}ms, border-color 0.2s`,
      }}
    >
      <div
        className="w-10 h-10 rounded-[10px] flex items-center justify-center font-bold text-[14px] mx-auto mb-2.5 group-hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: b.bg, color: b.color }}
      >
        {b.short}
      </div>
      <div className="text-[11px] font-semibold mb-0.5 truncate">{b.name}</div>
      <div className={`text-[10px] font-bold ${b.up ? 'text-grn' : 'text-red'}`}>{b.metric}</div>
    </div>
  )
}

// ─── QUOTE SECTION ────────────────────────────────────────────────────────────
function QuoteSection() {
  const { ref, visible } = useScrollReveal()
  return (
    <section className="py-14 px-6 max-w-3xl mx-auto text-center">
      <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
        <div className="text-acc text-[32px] mb-4 leading-none">"</div>
        <p className="text-[18px] text-[#a0a0c0] leading-relaxed italic mb-5">
          Every month same struggle. We pull data from Meta, Google, merge it manually and someone spends 3–4 hours building a deck. By the time the client sees it, numbers are 2 days old.
        </p>
        <div className="text-[12px] text-[#4a4a65]">— Performance agency founder, Bangalore</div>
      </div>
    </section>
  )
}

// ─── CTA SECTION ──────────────────────────────────────────────────────────────
function CTASection({ onNavigate }: { onNavigate: () => void }) {
  const { ref, visible } = useScrollReveal()
  return (
    <section className="py-20 px-6 text-center" style={{ borderTop: '1px solid #1a1a24', background: 'linear-gradient(to bottom, transparent, rgba(245,197,24,0.02) 50%, transparent)' }}>
      <div ref={ref} className="max-w-[440px] mx-auto" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
        <div className="w-14 h-14 bg-acc rounded-[14px] flex items-center justify-center text-black font-extrabold text-[22px] mx-auto mb-6">L</div>
        <h2 className="text-[30px] font-bold tracking-[-1px] mb-3">Ready to run differently?</h2>
        <p className="text-[14px] text-[#5a5a80] mb-8 leading-relaxed">
          Join our pilot program. 6 months free for founding agencies in exchange for feedback + introductions.
        </p>
        <MagneticBtn onClick={onNavigate} className="w-full justify-center text-[15px] py-3.5">
          Open Dashboard <ArrowRight size={16} />
        </MagneticBtn>
        <p className="text-[11px] text-[#3a3a55] mt-4">No credit card · No setup · Cancel anytime</p>
      </div>
    </section>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function WelcomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [statsOn, setStatsOn] = useState(false)
  const statsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsOn(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const counts = [
    useCounter(30, 2000, statsOn),
    useCounter(15, 2000, statsOn),
    useCounter(50, 2200, statsOn),
    useCounter(3, 1800, statsOn),
  ]

  const heroAnim = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
  })

  return (
    <div className="min-h-screen bg-bg text-t1 overflow-x-hidden relative" style={{ scrollBehavior: 'smooth' }}>
      {/* Ambient particle field */}
      <ParticleCanvas />

      {/* Ambient glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,197,24,0.04) 0%, transparent 70%)', top: '-10%', right: '-5%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,197,24,0.03) 0%, transparent 70%)', bottom: '20%', left: '-10%' }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ── NAV ── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-8 backdrop-blur-md border-b"
          style={{ backgroundColor: 'rgba(7,7,11,0.85)', borderColor: '#1a1a24' }}
        >
          <div className="flex items-center gap-2.5 font-bold text-[15px] tracking-[-0.3px]">
            <div className="w-[26px] h-[26px] bg-acc rounded-[7px] flex items-center justify-center text-black font-extrabold text-[11px]">L</div>
            <span>Logam OS</span>
            <span className="text-[10px] font-normal text-[#3a3a55] ml-0.5">by Logam Digital</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-[#4a4a65] hidden sm:block">Built for 15–50 client agencies</span>
            <MagneticBtn onClick={() => router.push('/dashboard')} className="text-[13px] px-4 py-1.5">
              Get Started <ArrowRight size={14} />
            </MagneticBtn>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="pt-32 pb-10 px-6 max-w-5xl mx-auto text-center">
          <div style={heroAnim(0)}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-acc text-[12px] font-semibold mb-7"
              style={{ borderColor: 'rgba(245,197,24,0.25)', backgroundColor: 'rgba(245,197,24,0.06)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-acc animate-pulse" />
              Pilot program open · India-first
            </div>
          </div>

          <div style={heroAnim(80)}>
            <h1 className="text-[52px] sm:text-[68px] font-bold tracking-[-2.5px] leading-[1.03] mb-5">
              The command centre<br />
              <span className="text-acc">agencies actually need</span>
            </h1>
          </div>

          <div style={heroAnim(160)}>
            <p className="text-[17px] text-[#7878a0] max-w-[520px] mx-auto mb-9 leading-relaxed">
              Real-time campaign intelligence, AI-written insights, and team coordination — for agencies running Meta and Google for 15–50 clients.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-4" style={heroAnim(240)}>
            <MagneticBtn onClick={() => router.push('/dashboard')}>
              Open Dashboard <ArrowRight size={15} />
            </MagneticBtn>
            <MagneticBtn variant="ghost">
              Watch 2-min demo
            </MagneticBtn>
          </div>
          <div className="text-[11px] text-[#3a3a55]" style={heroAnim(300)}>
            No credit card · No setup · Free for pilot agencies
          </div>
        </section>

        {/* ── DASHBOARD 3D PREVIEW ── */}
        <DashboardPreview />

        {/* ── STATS ── */}
        <section ref={statsRef} className="py-14 border-y" style={{ borderColor: '#1a1a24', backgroundColor: '#0a0a10' }}>
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s, i) => (
              <div key={i} style={{ opacity: statsOn ? 1 : 0, transform: statsOn ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms` }}>
                <div className="text-[38px] font-bold tracking-[-1.5px] text-acc mb-1 font-mono">
                  {counts[i]}{s.suffix}
                </div>
                <div className="text-[12px] text-[#4a4a65]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-16 px-6 max-w-5xl mx-auto mb-4">
          <div className="text-center mb-10">
            <TextReveal text="Everything you need. One screen." className="text-[32px] font-bold tracking-[-1px] mb-3" />
            <TextReveal text="Each module builds on the same API data. No new integrations. No extra tabs." className="text-[13.5px] text-[#5a5a80] max-w-[420px] mx-auto" delay={80} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 60} />
            ))}
          </div>
        </section>

        {/* ── BRAND GRID ── */}
        <section className="py-12 px-6 max-w-5xl mx-auto mb-4">
          <div className="text-center mb-8">
            <TextReveal text="Your clients. All in one view." className="text-[28px] font-bold tracking-[-0.8px] mb-2" />
            <TextReveal text="One place for every account, metric, and conversation." className="text-[13px] text-[#5a5a80]" delay={60} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {BRANDS_PREVIEW.map((b, i) => (
              <BrandPreviewCard key={b.short} b={b} index={i} onClick={() => router.push('/dashboard')} />
            ))}
          </div>
        </section>

        {/* ── QUOTE ── */}
        <QuoteSection />

        {/* ── CTA ── */}
        <CTASection onNavigate={() => router.push('/dashboard')} />

        {/* ── FOOTER ── */}
        <footer className="border-t px-8 py-5 flex items-center justify-between" style={{ borderColor: '#1a1a24' }}>
          <div className="flex items-center gap-2 text-[12px] font-semibold">
            <div className="w-5 h-5 bg-acc rounded-[4px] flex items-center justify-center text-black font-extrabold text-[9px]">L</div>
            Logam OS
          </div>
          <div className="text-[11px] text-[#3a3a55]">Built for performance agencies · 2025</div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#3a3a55]">
            <span className="w-1.5 h-1.5 rounded-full bg-grn animate-pulse" />
            All systems operational
          </div>
        </footer>
      </div>
    </div>
  )
}
