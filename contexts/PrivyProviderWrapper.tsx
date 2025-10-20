"use client"

import { PrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
import { ReactNode } from 'react'

// Import RPC creation functions from @solana/kit (web3.js 2.0)
import { createSolanaRpc } from '@solana/rpc'

export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''
  const solanaRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com'
  const solanaNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'

  // Construct the chain identifier (e.g., 'solana:devnet' or 'solana:mainnet')
  const chainId = `solana:${solanaNetwork}` as const

  console.log('🔧 Initializing Privy with app ID:', appId)

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
        // Configure Solana RPC endpoints
        solana: {
          rpcs: {
            [chainId]: {
              rpc: createSolanaRpc(solanaRpcUrl),
              rpcSubscriptions: null as any, // Optional websocket subscriptions
            },
          },
        },
        // Enable external Solana wallet connectors (Phantom, Backpack, etc.)
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
