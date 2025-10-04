'use client'

import { useEffect } from 'react'
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Toast as ToastType } from '@/hooks/useToast'

interface ToastProps {
  toast: ToastType
  onDismiss: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const colors = {
  success: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
  error: 'from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400',
  info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
  warning: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400',
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const Icon = icons[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, 3000)

    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={cn(
        'w-80 rounded-xl border backdrop-blur-xl shadow-2xl p-4 bg-gradient-to-r animate-in slide-in-from-right-full duration-300',
        colors[toast.type]
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm">{toast.title}</p>
          {toast.description && (
            <p className="text-xs text-white/70 mt-1">{toast.description}</p>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-white/50 hover:text-white transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
