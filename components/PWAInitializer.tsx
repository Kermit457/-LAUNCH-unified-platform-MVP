"use client"

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/pwa/register'

/**
 * PWA Initializer - Registers service worker on mount
 * Only runs in production
 */
export function PWAInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      registerServiceWorker()
    }
  }, [])

  return null
}
