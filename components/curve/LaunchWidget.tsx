'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Rocket,
  Snowflake,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/design-system'
import type { Curve } from '@/types/curve'

interface LaunchWidgetProps {
  curve: Curve
  isOwner: boolean
  onFreeze?: () => Promise<void>
  onLaunch?: (tokenMint: string) => Promise<void>
}

export const LaunchWidget = ({
  curve,
  isOwner,
  onFreeze,
  onLaunch
}: LaunchWidgetProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLaunchModal, setShowLaunchModal] = useState(false)
  const [tokenMint, setTokenMint] = useState('')

  const MIN_SUPPLY_FOR_LAUNCH = 100
  const canFreeze = curve.state === 'active' && curve.supply >= MIN_SUPPLY_FOR_LAUNCH
  const canLaunch = curve.state === 'frozen'
  const isLaunched = curve.state === 'launched'

  const handleFreeze = async () => {
    if (!canFreeze || !onFreeze) return

    setIsProcessing(true)
    setError(null)

    try {
      await onFreeze()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to freeze curve')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLaunch = async () => {
    if (!canLaunch || !onLaunch || !tokenMint) return

    setIsProcessing(true)
    setError(null)

    try {
      await onLaunch(tokenMint)
      setShowLaunchModal(false)
      setTokenMint('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to launch curve')
    } finally {
      setIsProcessing(false)
    }
  }

  // Non-owners just see the state
  if (!isOwner) {
    return (
      <div className="p-6 bg-black/20 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          {curve.state === 'active' && (
            <>
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <h3 className="font-bold text-white">Active Trading</h3>
                <p className="text-sm text-gray-400">Keys can be bought and sold</p>
              </div>
            </>
          )}
          {curve.state === 'frozen' && (
            <>
              <Snowflake className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-white">Frozen</h3>
                <p className="text-sm text-gray-400">Preparing for token launch</p>
              </div>
            </>
          )}
          {curve.state === 'launched' && (
            <>
              <Rocket className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="font-bold text-white">Launched</h3>
                <p className="text-sm text-gray-400">Token is live on Solana</p>
              </div>
            </>
          )}
        </div>

        {curve.state === 'launched' && curve.tokenMint && (
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Token Mint</p>
            <code className="text-xs text-purple-400 break-all">
              {curve.tokenMint}
            </code>
          </div>
        )}
      </div>
    )
  }

  // Owner controls
  return (
    <div className="space-y-4">
      <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-2">🚀 Launch Controls</h3>
        <p className="text-sm text-gray-400 mb-4">
          Guide your curve through its lifecycle to token launch
        </p>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-black/20 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <TrendingUp className="w-3 h-3" />
              Supply
            </div>
            <div className="text-white font-bold">{(curve.supply || 0).toFixed(0)}</div>
          </div>
          <div className="p-3 bg-black/20 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Users className="w-3 h-3" />
              Holders
            </div>
            <div className="text-white font-bold">{curve.holders || 0}</div>
          </div>
          <div className="p-3 bg-black/20 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <DollarSign className="w-3 h-3" />
              Reserve
            </div>
            <div className="text-white font-bold">{(curve.reserve || 0).toFixed(2)} SOL</div>
          </div>
        </div>

        {/* Launch Steps */}
        <div className="space-y-3 mb-4">
          {/* Step 1: Active Trading */}
          <div className={`
            flex items-start gap-3 p-3 rounded-lg border
            ${curve.state === 'active'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-black/10 border-white/5'
            }
          `}>
            {curve.state === 'active' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-medium text-white">1. Active Trading</div>
              <div className="text-xs text-gray-400">
                Minimum {MIN_SUPPLY_FOR_LAUNCH} keys required ({(curve.supply || 0).toFixed(0)}/{MIN_SUPPLY_FOR_LAUNCH})
              </div>
            </div>
          </div>

          {/* Step 2: Freeze */}
          <div className={`
            flex items-start gap-3 p-3 rounded-lg border
            ${curve.state === 'frozen'
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-black/10 border-white/5'
            }
          `}>
            {curve.state === 'frozen' ? (
              <Snowflake className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Snowflake className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-medium text-white">2. Freeze & Snapshot</div>
              <div className="text-xs text-gray-400">
                Lock trading, capture holder snapshot for airdrop
              </div>
            </div>
          </div>

          {/* Step 3: Launch */}
          <div className={`
            flex items-start gap-3 p-3 rounded-lg border
            ${curve.state === 'launched'
              ? 'bg-purple-500/10 border-purple-500/30'
              : 'bg-black/10 border-white/5'
            }
          `}>
            {curve.state === 'launched' ? (
              <Rocket className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Rocket className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-medium text-white">3. Token Launch</div>
              <div className="text-xs text-gray-400">
                Create token, add LP, airdrop to holders
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {curve.state === 'active' && (
            <>
              {!canFreeze && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Need {(MIN_SUPPLY_FOR_LAUNCH - (curve.supply || 0)).toFixed(0)} more keys to launch
                  </span>
                </div>
              )}
              <Button
                onClick={handleFreeze}
                disabled={!canFreeze || isProcessing}
                variant="primary"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
                    Freezing...
                  </>
                ) : (
                  <>
                    <Snowflake className="inline w-4 h-4 mr-2" />
                    Freeze Curve & Take Snapshot
                  </>
                )}
              </Button>
            </>
          )}

          {curve.state === 'frozen' && (
            <Button
              onClick={() => setShowLaunchModal(true)}
              disabled={isProcessing}
              variant="primary"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              <Rocket className="inline w-4 h-4 mr-2" />
              Launch Token
            </Button>
          )}

          {curve.state === 'launched' && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">Successfully Launched!</span>
              </div>
              {curve.tokenMint && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-1">Token Mint:</p>
                  <code className="text-xs text-purple-400 break-all block p-2 bg-black/20 rounded">
                    {curve.tokenMint}
                  </code>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Launch Modal */}
      <AnimatePresence>
        {showLaunchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => !isProcessing && setShowLaunchModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 bg-gradient-to-br from-purple-900/90 to-black/90 rounded-2xl border border-purple-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Launch Token</h3>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                This will create your token on Solana, add liquidity with the reserve funds,
                and airdrop tokens to all holders based on their key balances.
              </p>

              <div className="mb-4 p-4 bg-black/30 rounded-lg border border-white/10">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Supply</span>
                    <span className="text-white font-medium">{(curve.supply || 0).toFixed(0)} keys</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reserve for LP</span>
                    <span className="text-white font-medium">{(curve.reserve || 0).toFixed(2)} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Holders to Airdrop</span>
                    <span className="text-white font-medium">{curve.holders || 0}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Token Mint Address (mock)
                </label>
                <input
                  type="text"
                  value={tokenMint}
                  onChange={(e) => setTokenMint(e.target.value)}
                  placeholder="e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  In production, this would be generated automatically
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowLaunchModal(false)}
                  disabled={isProcessing}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLaunch}
                  disabled={isProcessing || !tokenMint}
                  variant="primary"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
                      Launching...
                    </>
                  ) : (
                    'Launch Now'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
