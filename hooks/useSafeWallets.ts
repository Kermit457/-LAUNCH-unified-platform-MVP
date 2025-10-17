/**
 * Safe wrapper around useWallets that handles the case where
 * Privy provider might not be initialized yet
 */

import { useState, useEffect } from 'react'
import { useWallets } from '@privy-io/react-auth/solana'
import { PublicKey } from '@solana/web3.js'

export function useSafeWallets() {
  const [mounted, setMounted] = useState(false)
  const [walletPubkey, setWalletPubkey] = useState<PublicKey | null>(null)

  // Only access useWallets after component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Call useWallets conditionally based on mounted state
  let wallets: any[] = []
  if (mounted) {
    try {
      const walletsResult = useWallets()
      wallets = walletsResult.wallets || []
    } catch (e) {
      // Privy not ready yet, return empty
      console.log('Privy useWallets not ready yet')
    }
  }

  useEffect(() => {
    if (mounted && wallets && wallets.length > 0 && wallets[0]?.address) {
      try {
        setWalletPubkey(new PublicKey(wallets[0].address))
      } catch (e) {
        console.error('Invalid wallet address:', e)
        setWalletPubkey(null)
      }
    } else {
      setWalletPubkey(null)
    }
  }, [mounted, wallets])

  return { wallets, walletPubkey }
}