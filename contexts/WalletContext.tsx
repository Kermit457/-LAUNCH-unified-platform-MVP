"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'

interface WalletContextType {
  connected: boolean
  address: string | null
  userId: string | null
  user: any
  userInfo: any
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const [address, setAddress] = useState<string | null>(null)

  // Get embedded wallet address from user object
  useEffect(() => {
    if (authenticated && user) {
      // Privy provides wallet info in the user object for embedded wallets
      const embeddedWallet = user.wallet
      if (embeddedWallet) {
        setAddress(embeddedWallet.address || null)
        console.log('Embedded wallet address:', embeddedWallet.address)
      }
    } else {
      setAddress(null)
    }
  }, [authenticated, user])

  const connected = ready && authenticated

  // Extract user ID and info
  const userId = user?.id || null
  const userInfo = user ? {
    twitter: user.twitter,
    email: user.email,
    google: user.google,
    discord: user.discord,
    linkedAccounts: user.linkedAccounts,
    wallet: user.wallet
  } : null

  async function connect() {
    try {
      login()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      // Don't throw, just log the error
    }
  }

  async function disconnect() {
    try {
      console.log('🚪 Logging out...')
      await logout()
      console.log('✅ Logged out successfully')
      // Clear local state
      setAddress(null)
      // Force page reload to clear all state
      window.location.href = '/'
    } catch (error) {
      console.error('❌ Failed to disconnect wallet:', error)
      // Don't throw, just log the error
    }
  }

  return (
    <WalletContext.Provider value={{ connected, address, userId, user, userInfo, connect, disconnect }}>
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
