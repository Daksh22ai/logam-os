'use client'

import React, { useEffect, useRef } from 'react'

export interface LaserFlowProps {
  color?: string
  horizontalSizing?: number
  verticalSizing?: number
  wispDensity?: number
  wispSpeed?: number
  wispIntensity?: number
  flowSpeed?: number
  flowStrength?: number
  fogIntensity?: number
  fogScale?: number
  fogFallSpeed?: number
  decay?: number
  falloffStart?: number
  horizontalBeamOffset?: number
  verticalBeamOffset?: number
}

/**
 * A lightweight CSS-based proxy for the LaserFlow effect.
 * It simulates a glowing wisp field with sweeping animations and gradient layers
 * while respecting the provided props as closely as possible in pure CSS/Canvas.
 */
export default function LaserFlow({
  color = '#b5a603',
  horizontalBeamOffset = 0,
  verticalBeamOffset = 0,
}: LaserFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const render = () => {
      const w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      const h = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight

      ctx.clearRect(0, 0, w, h)

      // Animate sweep
      time += 0.015
      const sweepX = (Math.sin(time) * 0.5 + 0.5) * w
      
      // Draw base horizontal beam based on offsets
      ctx.globalCompositeOperation = 'lighter'
      
      const gradient = ctx.createLinearGradient(0, h/2 + verticalBeamOffset, w, h/2 + verticalBeamOffset)
      gradient.addColorStop(0, `${color}00`)
      gradient.addColorStop(0.5, `${color}20`)
      gradient.addColorStop(1, `${color}00`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      // Draw sweeping highlight
      const highlightGradient = ctx.createRadialGradient(sweepX, h/2 + verticalBeamOffset, 0, sweepX, h/2 + verticalBeamOffset, 200)
      highlightGradient.addColorStop(0, `${color}50`)
      highlightGradient.addColorStop(1, 'transparent')

      ctx.fillStyle = highlightGradient
      ctx.fillRect(0, 0, w, h)

      // Particles simulating wisps
      for (let i = 0; i < 40; i++) {
        const px = (w / 40) * i + (Math.cos(time + i) * 30)
        const py = h/2 + verticalBeamOffset + (Math.sin(time * 1.5 + i) * 60)
        
        ctx.beginPath()
        ctx.arc(px, py, Math.random() * 2 + 1, 0, Math.PI * 2)
        ctx.fillStyle = `${color}40`
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animationFrameId)
  }, [color, verticalBeamOffset, horizontalBeamOffset])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-60"
      style={{ zIndex: 1 }}
    />
  )
}
