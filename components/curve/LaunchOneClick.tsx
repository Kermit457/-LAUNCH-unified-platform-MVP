'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Rocket,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  ExternalLink,
  Copy,
  Gift
} from 'lucide-react'
import { Button, DexScreenerChart } from '@/components/design-system'
import type { Curve } from '@/types/curve'

interface LaunchOneClickProps {
  curve: Curve
  isOwner: boolean
  userId?: string
  onLaunch?: (p0: number) => Promise<void>
}

const MIN_SUPPLY = 100
const MIN_HOLDERS = 4
const MIN_RESERVE = 10

export const LaunchOneClick = ({
  curve,
  isOwner,
  userId,
  onLaunch
}: LaunchOneClickProps) => {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [p0, setP0] = useState(curve.price.toFixed(6))
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)

  // Check thresholds
  const meetsSupply = curve.supply >= MIN_SUPPLY
  const meetsHolders = curve.holders >= MIN_HOLDERS
  const meetsReserve = curve.reserve >= MIN_RESERVE
  const canLaunch = meetsSupply && meetsHolders && meetsReserve && isOwner && curve.state === 'active'

  const handleLaunch = async () => {
    if (!canLaunch || !onLaunch) return

    setIsProcessing(true)
    setError(null)

    try {
      await onLaunch(parseFloat(p0))
      setShowConfirm(false)

      // Show success popup
      setShowSuccess(true)

      // Redirect to discover page after 3 seconds
      setTimeout(() => {
        router.push('/discover')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Launch failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClaimAirdrop = async () => {
    if (!userId || !curve.tokenMint) return

    setIsClaiming(true)
    setError(null)

    try {
      // Mock wallet address - in production, get from connected wallet
      const walletAddress = `wallet-${userId}`

      const response = await fetch(`/api/curve/${curve.id}/airdrop/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, walletAddress })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Claim failed')
      }

      const data = await response.json()
      console.log('Airdrop claimed:', data)
      setClaimSuccess(true)

      // Show success for 3 seconds
      setTimeout(() => setClaimSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim airdrop')
    } finally {
      setIsClaiming(false)
    }
  }

  // Non-owner view
  if (!isOwner) {
    if (curve.state === 'launched') {
      const [copied, setCopied] = useState(false)

      const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }

      return (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 space-y-4">
          {/* Success Banner */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Rocket className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">🎉 Token Launched!</h3>
              <p className="text-sm text-gray-400">This curve has been converted to a live token</p>
            </div>
          </div>

          {curve.tokenMint && (
            <>
              {/* Token Contract */}
              <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">Token Contract:</p>
                  <button
                    onClick={() => copyToClipboard(curve.tokenMint!)}
                    className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <code className="text-xs text-purple-400 break-all block font-mono">
                  {curve.tokenMint}
                </code>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://pump.fun/${curve.tokenMint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 rounded-xl transition-all group"
                >
                  <Rocket className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-white">Trade Now</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>

                <a
                  href={`https://solscan.io/token/${curve.tokenMint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all group"
                >
                  <TrendingUp className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-white">View Token</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </div>

              {/* Airdrop Status */}
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-green-400">Tokens Airdropped</h4>
                    <p className="text-xs text-gray-400">
                      Holders automatically received tokens in their wallets
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )
    }

    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="font-bold text-white">Active Trading</h3>
            <p className="text-sm text-gray-400">Keys can be bought and sold</p>
          </div>
        </div>
      </div>
    )
  }

  // Owner view - launched state
  if (curve.state === 'launched') {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 space-y-4">
        {/* Success Banner */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">🎉 Successfully Launched!</h3>
            <p className="text-sm text-gray-400">Your token is live on Solana</p>
          </div>
        </div>

        {curve.tokenMint && (
          <>
            {/* Token Contract */}
            <div className="p-4 bg-black/30 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Token Contract Address:</p>
                <button
                  onClick={() => copyToClipboard(curve.tokenMint!)}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <code className="text-sm text-purple-400 break-all block p-2 bg-black/20 rounded font-mono">
                {curve.tokenMint}
              </code>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3">
              {/* Pump.fun Link */}
              <a
                href={`https://pump.fun/${curve.tokenMint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 rounded-xl transition-all group"
              >
                <Rocket className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white">Trade on Pump.fun</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>

              {/* Solscan Link */}
              <a
                href={`https://solscan.io/token/${curve.tokenMint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all group"
              >
                <TrendingUp className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white">View on Solscan</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>

            {/* Launch Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-black/30 rounded-lg border border-white/10 text-center">
                <p className="text-xs text-gray-500 mb-1">LP Reserve</p>
                <p className="text-lg font-bold text-white">{curve.reserve.toFixed(2)} SOL</p>
              </div>
              <div className="p-3 bg-black/30 rounded-lg border border-white/10 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Supply</p>
                <p className="text-lg font-bold text-white">{curve.supply.toFixed(0)} keys</p>
              </div>
              <div className="p-3 bg-black/30 rounded-lg border border-white/10 text-center">
                <p className="text-xs text-gray-500 mb-1">Holders</p>
                <p className="text-lg font-bold text-white">{curve.holders}</p>
              </div>
            </div>

            {/* Airdrop Info */}
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-green-400 mb-1">Tokens Airdropped!</h4>
                  <p className="text-xs text-gray-400 mb-2">
                    All {curve.holders} holders automatically received their tokens pro-rata based on their key holdings at launch.
                  </p>
                  <div className="p-2 bg-black/20 rounded-lg">
                    <p className="text-xs text-green-300">
                      ✓ Tokens sent directly to your connected wallet
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      1,000,000 tokens per key held
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* DEX Screener Chart */}
            <DexScreenerChart tokenMint={curve.tokenMint} height={400} />
          </>
        )}

        {!curve.tokenMint && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-sm text-amber-400">
              ⚠️ Token mint address not available. The launch may still be processing.
            </p>
          </div>
        )}
      </div>
    )
  }

  // Owner view - active/frozen state
  return (
    <>
      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Rocket className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Launch Token</h3>
            <p className="text-sm text-gray-400">
              Freeze + Snapshot + Create token + Seed LP + Airdrop
            </p>
          </div>
        </div>

        {/* Thresholds */}
        <div className="space-y-3 mb-6">
          <div className={`flex items-center justify-between p-3 rounded-lg border ${
            meetsSupply
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center gap-3">
              {meetsSupply ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <div className="text-sm font-medium text-white">Supply</div>
                <div className="text-xs text-gray-400">
                  {curve.supply.toFixed(0)} / {MIN_SUPPLY} keys
                </div>
              </div>
            </div>
            <TrendingUp className={`w-5 h-5 ${meetsSupply ? 'text-green-400' : 'text-gray-600'}`} />
          </div>

          <div className={`flex items-center justify-between p-3 rounded-lg border ${
            meetsHolders
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center gap-3">
              {meetsHolders ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <div className="text-sm font-medium text-white">Holders</div>
                <div className="text-xs text-gray-400">
                  {curve.holders} / {MIN_HOLDERS} holders
                </div>
              </div>
            </div>
            <Users className={`w-5 h-5 ${meetsHolders ? 'text-green-400' : 'text-gray-600'}`} />
          </div>

          <div className={`flex items-center justify-between p-3 rounded-lg border ${
            meetsReserve
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center gap-3">
              {meetsReserve ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <div className="text-sm font-medium text-white">Reserve</div>
                <div className="text-xs text-gray-400">
                  {curve.reserve.toFixed(2)} / {MIN_RESERVE} SOL
                </div>
              </div>
            </div>
            <DollarSign className={`w-5 h-5 ${meetsReserve ? 'text-green-400' : 'text-gray-600'}`} />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Launch Button */}
        {!canLaunch && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              {!meetsSupply && `Need ${(MIN_SUPPLY - curve.supply).toFixed(0)} more keys. `}
              {!meetsHolders && `Need ${MIN_HOLDERS - curve.holders} more holders. `}
              {!meetsReserve && `Need ${(MIN_RESERVE - curve.reserve).toFixed(2)} more SOL in reserve. `}
            </span>
          </div>
        )}

        <Button
          onClick={() => setShowConfirm(true)}
          disabled={!canLaunch || isProcessing}
          variant="primary"
          className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Rocket className="inline w-5 h-5 mr-2" />
          Launch Token
        </Button>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => !isProcessing && setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-gradient-to-br from-purple-900/90 via-black/90 to-black/90 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Rocket className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Launch Token</h3>
                    <p className="text-sm text-gray-400">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-purple-400 mb-3">
                    <Zap className="w-5 h-5" />
                    <span className="font-bold">What happens next:</span>
                  </div>
                  <ol className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">1.</span>
                      <span>Freeze curve and take holder snapshot</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">2.</span>
                      <span>Create SPL token on Solana</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">3.</span>
                      <span>Seed liquidity pool with reserve funds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">4.</span>
                      <span>Airdrop tokens to all holders pro-rata</span>
                    </li>
                  </ol>
                </div>

                {/* Launch Stats */}
                <div className="p-4 bg-black/30 rounded-xl border border-white/10">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Supply:</span>
                      <span className="text-white font-medium">{curve.supply.toFixed(0)} keys</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reserve for LP:</span>
                      <span className="text-white font-medium">{curve.reserve.toFixed(2)} SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Holders to Airdrop:</span>
                      <span className="text-white font-medium">{curve.holders}</span>
                    </div>
                  </div>
                </div>

                {/* LP Settings */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Initial LP Price (P0)
                  </label>
                  <input
                    type="number"
                    value={p0}
                    onChange={(e) => setP0(e.target.value)}
                    step="0.000001"
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Current curve price: {curve.price.toFixed(6)} SOL (deterministic from bonding curve)
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowConfirm(false)}
                    disabled={isProcessing}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLaunch}
                    disabled={isProcessing}
                    variant="primary"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
                        Launching...
                      </>
                    ) : (
                      <>
                        <Rocket className="inline w-4 h-4 mr-2" />
                        Launch Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md bg-gradient-to-br from-purple-900 via-black to-black rounded-2xl border-2 border-purple-500 shadow-2xl p-8"
            >
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                  >
                    <Rocket className="w-12 h-12 text-white" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.4 }}
                    className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white">
                  🎉 Token Launched!
                </h2>
                <p className="text-lg text-gray-300">
                  Your token is now live on Solana
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 py-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <p className="text-xs text-purple-300">Reserve</p>
                    <p className="text-lg font-bold text-white">{curve.reserve.toFixed(2)} SOL</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <p className="text-xs text-purple-300">Holders</p>
                    <p className="text-lg font-bold text-white">{curve.holders}</p>
                  </div>
                </div>

                {/* Airdrop Info */}
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-green-400 font-medium mb-1">
                    ✓ Tokens Airdropped
                  </p>
                  <p className="text-xs text-gray-400">
                    Automatically sent to all {curve.holders} holders
                  </p>
                </div>

                {/* Redirect Message */}
                <p className="text-sm text-gray-500">
                  Redirecting to discover page...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
