"use client"

import { useState, useEffect } from 'react'
import { skipWaitingAndReload } from '@/lib/pwa/register'

export function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    const handleUpdateAvailable = (event: Event) => {
      const customEvent = event as CustomEvent<ServiceWorkerRegistration>
      setRegistration(customEvent.detail)
      setUpdateAvailable(true)
      console.log('PWA: Update available')
    }

    window.addEventListener('swUpdateAvailable', handleUpdateAvailable)

    return () => {
      window.removeEventListener('swUpdateAvailable', handleUpdateAvailable)
    }
  }, [])

  const applyUpdate = async () => {
    if (registration?.waiting) {
      await skipWaitingAndReload()
    }
  }

  const dismissUpdate = () => {
    setUpdateAvailable(false)
  }

  return {
    updateAvailable,
    applyUpdate,
    dismissUpdate
  }
}
