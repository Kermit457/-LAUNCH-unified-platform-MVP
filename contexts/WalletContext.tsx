"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletContextType {
  connected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing wallet connection from localStorage
    const savedAddress = localStorage.getItem('wallet_address')
    if (savedAddress) {
      setAddress(savedAddress)
      setConnected(true)
    }
  }, [])

  async function connect() {
    try {
      // For now, simulate wallet connection
      // In production, integrate with Privy, wallet-adapter, or similar
      // Example: await privy.login() or await wallet.connect()

      // Simulated connection
      const mockAddress = `${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 6)}`
      setAddress(mockAddress)
      setConnected(true)
      localStorage.setItem('wallet_address', mockAddress)

      // TODO: Replace with actual wallet integration
      // if (window.solana) {
      //   const response = await window.solana.connect()
      //   setAddress(response.publicKey.toString())
      //   setConnected(true)
      // }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  function disconnect() {
    setAddress(null)
    setConnected(false)
    localStorage.removeItem('wallet_address')
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
