"use client"

import { PrivyProvider } from '@privy-io/react-auth'
import { ReactNode, useEffect, useState } from 'react'

export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // In client components, access env vars directly from process.env with the full name
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''

  // Don't render on server or if not mounted
  if (!mounted) {
    return <>{children}</>
  }

  // Graceful fallback during dev - don't crash the entire app
  if (!appId || appId.trim() === '') {
    console.warn('⚠️ NEXT_PUBLIC_PRIVY_APP_ID not found - running without auth')
    return <>{children}</>
  }

  // Additional validation to prevent invalid app ID errors
  if (appId.length < 20) {
    console.error('⚠️ Invalid NEXT_PUBLIC_PRIVY_APP_ID format - running without auth')
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#8B5CF6',
        },
        loginMethods: ['email', 'twitter', 'wallet'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
