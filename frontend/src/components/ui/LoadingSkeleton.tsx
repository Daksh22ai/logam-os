import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  rows?: number
}

export default function LoadingSkeleton({ className, rows = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 w-full bg-s3 rounded-md animate-pulse"
          style={{ 
            opacity: Math.max(0.2, 1 - (i * 0.15)),
            width: i === rows - 1 && rows > 1 ? '70%' : '100%'
          }} 
        />
      ))}
    </div>
  )
}
