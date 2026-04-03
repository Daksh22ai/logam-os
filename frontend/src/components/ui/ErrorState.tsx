import React from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  className?: string
}

export default function ErrorState({ message = 'Something went wrong', onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-6 text-center gap-3 bg-red/5 border border-red/20 rounded-lg", className)}>
      <div className="w-10 h-10 rounded-full bg-red/10 flex items-center justify-center text-red">
        <AlertTriangle size={20} />
      </div>
      
      <p className="text-sm text-t2 mb-1">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-s2 border border-b2 hover:bg-s3 transition-colors text-t1"
        >
          <RefreshCcw size={12} />
          Retry action
        </button>
      )}
    </div>
  )
}
