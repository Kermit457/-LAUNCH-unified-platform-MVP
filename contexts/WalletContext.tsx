"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useSolanaWalletsContext } from '@/components/SolanaWalletManager'

interface WalletContextType {
  connected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, login, logout } = usePrivy()
  const { wallets, ready: walletsReady } = useSolanaWalletsContext()
  const [address, setAddress] = useState<string | null>(null)

  // Get Solana wallet address using exportPublicKey()
  useEffect(() => {
    async function fetchAddress() {
      if (!walletsReady || wallets.length === 0) {
        setAddress(null)
        return
      }
      try {
        const addr = await wallets[0].exportPublicKey()
        setAddress(addr || null)
      } catch {
        setAddress(null)
      }
    }
    fetchAddress()
  }, [wallets, walletsReady])

  const connected = ready && authenticated && walletsReady && !!address

  async function connect() {
    try {
      login()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  async function disconnect() {
    try {
      logout()
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
