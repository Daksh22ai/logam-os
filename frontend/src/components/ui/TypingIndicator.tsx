import React from 'react'
import { cn } from '@/lib/utils'

export default function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 py-1", className)}>
      <div className="w-1.5 h-1.5 bg-acc rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <div className="w-1.5 h-1.5 bg-acc rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <div className="w-1.5 h-1.5 bg-acc rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
    </div>
  )
}
