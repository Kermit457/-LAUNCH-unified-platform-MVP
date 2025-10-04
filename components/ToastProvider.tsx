'use client'

import { useState, useCallback } from 'react'
import { ToastContext, type Toast, type ToastType } from '@/hooks/useToast'
import { Toast as ToastComponent } from './Toast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: Toast = { id, type, title, description }
    setToasts((prev) => [...prev, newToast])
  }, [])

  const success = useCallback((title: string, description?: string) => {
    toast('success', title, description)
  }, [toast])

  const error = useCallback((title: string, description?: string) => {
    toast('error', title, description)
  }, [toast])

  const info = useCallback((title: string, description?: string) => {
    toast('info', title, description)
  }, [toast])

  const warning = useCallback((title: string, description?: string) => {
    toast('warning', title, description)
  }, [toast])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, info, warning, dismiss }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastComponent toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
