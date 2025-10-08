"use client"

import { PrivyProvider } from '@privy-io/react-auth'
import { ReactNode } from 'react'

export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  // Graceful fallback during dev - don't crash the entire app
  if (!appId) {
    console.warn('⚠️ NEXT_PUBLIC_PRIVY_APP_ID not found - running without auth')
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
