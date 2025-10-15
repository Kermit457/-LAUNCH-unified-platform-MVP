"use client"

import { PrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
import { ReactNode, useEffect, useState } from 'react'
import { SolanaWalletManager } from '@/components/SolanaWalletManager'
import { createSolanaRpc } from '@solana/rpc'
import { createSolanaRpcSubscriptions } from '@solana/rpc-subscriptions'

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
        // Solana and Ethereum embedded wallets
        embeddedWallets: {
          createOnLogin: 'all-users',
          chains: ['solana', 'ethereum'],
        },
        // External wallet connectors
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors({
              // Only enable Phantom for external wallet detection
              shouldAutoConnect: false,
            }),
          },
        },
        // Solana RPC configuration using @solana/rpc and @solana/rpc-subscriptions
        solana: {
          defaultChain: 'solana:devnet',
          rpcs: {
            'solana:devnet': {
              rpc: createSolanaRpc('https://api.devnet.solana.com'),
              rpcSubscriptions: createSolanaRpcSubscriptions('wss://api.devnet.solana.com'),
            },
            'solana:testnet': {
              rpc: createSolanaRpc('https://api.testnet.solana.com'),
              rpcSubscriptions: createSolanaRpcSubscriptions('wss://api.testnet.solana.com'),
            },
            'solana:mainnet': {
              rpc: createSolanaRpc('https://api.mainnet-beta.solana.com'),
              rpcSubscriptions: createSolanaRpcSubscriptions('wss://api.mainnet-beta.solana.com'),
            },
          },
        },
      }}
    >
      <SolanaWalletManager>
        {children}
      </SolanaWalletManager>
    </PrivyProvider>
  )
}
