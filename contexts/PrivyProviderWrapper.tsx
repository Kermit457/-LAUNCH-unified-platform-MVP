"use client"

import { PrivyProvider } from '@privy-io/react-auth'
import { ReactNode } from 'react'

export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  // Graceful fallback during dev - don't crash the entire app
  if (!appId || appId.trim() === '') {
    console.warn('⚠️ NEXT_PUBLIC_PRIVY_APP_ID not found - running without auth')
    return <>{children}</>
  }

  // Additional validation to prevent invalid app ID errors
  if (appId.length < 10 || !appId.match(/^[a-z0-9]+$/)) {
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
