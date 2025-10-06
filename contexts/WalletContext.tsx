"use client"

import { createContext, useContext, ReactNode } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'

interface WalletContextType {
  connected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const { wallets } = useWallets()

  // Prioritize Solana wallet address over Ethereum
  const solanaWallet = wallets.find(w => w.walletClientType === 'solana')
  const address = solanaWallet?.address || wallets[0]?.address || user?.wallet?.address || null
  const connected = ready && authenticated && !!address

  async function connect() {
    try {
      await login()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  async function disconnect() {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      throw error
    }
  }

  return (
    <WalletContext.Provider value={{ connected, address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
