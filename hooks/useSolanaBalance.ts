/**
 * Hook to fetch Solana wallet balance
 */

import { useState, useEffect } from 'react'
import { useWallets } from '@privy-io/react-auth/solana'
import { PublicKey, Connection } from '@solana/web3.js'
import { connection } from '@/lib/solana/config'

export function useSolanaBalance() {
  const { wallets } = useWallets()
  const [balance, setBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBalance() {
      if (!wallets || wallets.length === 0) {
        setBalance(0)
        return
      }

      const wallet = wallets[0]
      if (!wallet?.address) {
        setBalance(0)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const publicKey = new PublicKey(wallet.address)
        const balanceInLamports = await connection.getBalance(publicKey)
        const balanceInSOL = balanceInLamports / 1e9 // Convert lamports to SOL
        setBalance(balanceInSOL)
      } catch (err) {
        console.error('Failed to fetch SOL balance:', err)
        setError('Failed to fetch balance')
        setBalance(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()

    // Set up interval to refresh balance every 30 seconds
    const intervalId = setInterval(fetchBalance, 30000)

    return () => clearInterval(intervalId)
  }, [wallets])

  return { balance, isLoading, error }
}
