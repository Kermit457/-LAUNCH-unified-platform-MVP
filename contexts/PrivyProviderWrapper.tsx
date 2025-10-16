"use client"

import { PrivyProvider } from '@privy-io/react-auth'
import { ReactNode, useEffect, useState } from 'react'

export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''

  if (!mounted) {
    return <>{children}</>
  }

  if (!appId || appId.trim() === '') {
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
          solana: {
            createOnLogin: 'all-users',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
