'use client'

import { useState, useEffect } from 'react'

// Your real wallets with key holdings
const KEY_HOLDERS = [
  {
    address: 'Ch4b5EMkFPpahJ9gruYMJAJdwK5w2Gh61FxrsDWU4PmP',
    name: 'Whale Alpha',
    keys: 350,
    avatar: '🐋'
  },
  {
    address: 'Eyn53CztGH3vgYRTEwPQfWzfcXgm1A5kkgRnnVBACGYT',
    name: 'Whale Beta',
    keys: 250,
    avatar: '🐳'
  },
  {
    address: '8mHiMYDcu5f27SQy4ReE2wc9t5PmksPjSnaDG5w7J8FL',
    name: 'Diamond Hands',
    keys: 150,
    avatar: '💎'
  },
  {
    address: '2d9dKoLqXpzgEwSUFd4hYMMYk1kjXSHn2L9Z88WbKyL5',
    name: 'Early Investor',
    keys: 100,
    avatar: '🚀'
  },
  {
    address: 'HgdQ726vLkMspD81SWGJhoaUJYraydeTnqT373apidEe',
    name: 'Steady Holder',
    keys: 75,
    avatar: '🛡️'
  },
  {
    address: 'BrFWPnjDw6pTqW3NGo38bRKEqfYXE62KkMfCgLqJzpxJ',
    name: 'Community Member',
    keys: 50,
    avatar: '👥'
  },
  {
    address: '6t3m2A8R7yysvbanHV2hRWRuf6EK9uDJWHSzyQGp4Zbp',
    name: 'Supporter',
    keys: 25,
    avatar: '🤝'
  }
]

const TOTAL_KEYS = KEY_HOLDERS.reduce((sum, holder) => sum + holder.keys, 0)

export default function TestKeyLaunchPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [projectData, setProjectData] = useState({
    name: '',
    ticker: '',
    description: '',
    twitter: '',
    telegram: '',
    website: '',
    scope: 'MEME',
    status: 'Upcoming'
  })
  const [buyAmount, setBuyAmount] = useState(0.5)
  const [quote, setQuote] = useState<any>(null)
  const [launched, setLaunched] = useState(false)

  // Simulate Pump.fun quote
  const getQuote = () => {
    const basePrice = 0.00001 // Starting price
    const tokensPerSol = Math.floor(1 / basePrice)
    const estimatedTokens = Math.floor(tokensPerSol * buyAmount * 0.95) // 5% slippage

    return {
      solAmount: buyAmount,
      estimatedTokens,
      pricePerToken: basePrice,
      priceImpact: '~2%',
      slippage: '5%'
    }
  }

  useEffect(() => {
    if (buyAmount > 0) {
      setQuote(getQuote())
    }
  }, [buyAmount])

  const handleLaunch = async () => {
    setLoading(true)

    // Simulate launch process
    await new Promise(resolve => setTimeout(resolve, 1500))

    setLaunched(true)
    setStep(4)
    setLoading(false)
  }

  const calculateDistribution = () => {
    if (!quote) return []

    return KEY_HOLDERS.map(holder => {
      const percentage = (holder.keys / TOTAL_KEYS) * 100
      const tokens = Math.floor((holder.keys / TOTAL_KEYS) * quote.estimatedTokens)
      return {
        ...holder,
        percentage,
        tokens
      }
    })
  }

  const distribution = calculateDistribution()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🚀 Project to Pump.fun Launcher
          </h1>
          <p className="text-xl text-gray-300">Test the complete flow with real wallets</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className="flex items-center">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                ${step >= num ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'}
              `}>
                {num}
              </div>
              {num < 4 && (
                <div className={`w-32 h-1 ${step > num ? 'bg-purple-500' : 'bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Project Info */}
        {step === 1 && (
          <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-3xl font-bold mb-6">Step 1: Project Information</h2>
            <p className="text-gray-400 mb-6">This data comes from your project submission form</p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Token Name *</label>
                <input
                  type="text"
                  value={projectData.name}
                  onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 outline-none"
                  placeholder="e.g., Solana"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Token Ticker *</label>
                <input
                  type="text"
                  value={projectData.ticker}
                  onChange={(e) => setProjectData({...projectData, ticker: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 outline-none"
                  placeholder="e.g., SOL"
                  maxLength={10}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 outline-none"
                  rows={3}
                  placeholder="Describe your project..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Scope</label>
                <div className="flex gap-3">
                  {['ICM', 'CCM', 'MEME'].map(scope => (
                    <button
                      key={scope}
                      onClick={() => setProjectData({...projectData, scope})}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        projectData.scope === scope
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {scope}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex gap-3">
                  {['Upcoming', 'Live'].map(status => (
                    <button
                      key={status}
                      onClick={() => setProjectData({...projectData, status})}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        projectData.status === status
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!projectData.name || !projectData.ticker}
              className="mt-8 w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Key Holders →
            </button>
          </div>
        )}

        {/* Step 2: Key Holders */}
        {step === 2 && (
          <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-3xl font-bold mb-6">Step 2: Key Holders & Distribution</h2>
            <p className="text-gray-400 mb-6">These wallets hold keys in your bonding curve</p>

            <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Total Keys in Circulation</span>
                <span className="text-2xl font-bold text-purple-400">{TOTAL_KEYS}</span>
              </div>

              <div className="space-y-3">
                {KEY_HOLDERS.map((holder, i) => {
                  const percentage = (holder.keys / TOTAL_KEYS * 100).toFixed(1)
                  const barWidth = (holder.keys / TOTAL_KEYS * 100)

                  return (
                    <div key={i} className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{holder.avatar}</span>
                          <div>
                            <div className="font-medium">{holder.name}</div>
                            <div className="text-sm text-gray-400">
                              {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{holder.keys} keys</div>
                          <div className="text-sm text-purple-400">{percentage}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-8 py-4 bg-gray-800 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Configure Launch →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Launch Configuration */}
        {step === 3 && (
          <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-3xl font-bold mb-6">Step 3: Launch Configuration</h2>

            {/* Buy Amount */}
            <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
              <label className="block text-lg font-medium mb-4">Initial Liquidity (SOL)</label>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(parseFloat(e.target.value))}
                  className="w-32 px-4 py-2 bg-gray-700 rounded-lg text-xl font-bold text-center"
                  step="0.1"
                  min="0.1"
                />
                <span className="text-lg">SOL</span>
              </div>
              <div className="text-sm text-gray-400">
                ≈ ${(buyAmount * 150).toFixed(2)} USD
              </div>
            </div>

            {/* Quote */}
            {quote && (
              <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">📈 Pump.fun Quote</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">You Pay</div>
                    <div className="text-2xl font-bold">{quote.solAmount} SOL</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">You Receive</div>
                    <div className="text-2xl font-bold text-green-400">
                      {quote.estimatedTokens.toLocaleString()} {projectData.ticker || 'TOKENS'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Price per Token</div>
                    <div className="font-medium">{quote.pricePerToken} SOL</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Slippage</div>
                    <div className="font-medium">{quote.slippage}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Distribution Preview */}
            <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">🎁 Token Distribution</h3>
              <div className="space-y-2">
                {distribution.map((holder, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <span>{holder.avatar}</span>
                      <span>{holder.name}</span>
                      <span className="text-sm text-gray-400">({holder.keys} keys)</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{holder.tokens.toLocaleString()} {projectData.ticker}</div>
                      <div className="text-sm text-purple-400">{holder.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 mb-6 border border-purple-500/30">
              <h3 className="text-xl font-semibold mb-4">📊 Launch Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Token Name:</span>
                  <span className="ml-2 font-medium">{projectData.name}</span>
                </div>
                <div>
                  <span className="text-gray-400">Symbol:</span>
                  <span className="ml-2 font-medium">{projectData.ticker}</span>
                </div>
                <div>
                  <span className="text-gray-400">Total Supply:</span>
                  <span className="ml-2 font-medium">1,000,000,000</span>
                </div>
                <div>
                  <span className="text-gray-400">Bonding Curve:</span>
                  <span className="ml-2 font-medium">793,000,000 (79.3%)</span>
                </div>
                <div>
                  <span className="text-gray-400">Initial Buy:</span>
                  <span className="ml-2 font-medium">{buyAmount} SOL</span>
                </div>
                <div>
                  <span className="text-gray-400">Tokens to Distribute:</span>
                  <span className="ml-2 font-medium">{quote?.estimatedTokens.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-8 py-4 bg-gray-800 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleLaunch}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Launching...
                  </span>
                ) : (
                  '🚀 Launch Token'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && launched && (
          <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-8 border border-green-500/20">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold mb-2">Token Launched Successfully!</h2>
              <p className="text-xl text-gray-400">Your project is now live on Pump.fun</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">📊 Launch Results</h3>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Token Mint</div>
                  <div className="font-mono text-lg break-all">
                    {projectData.ticker}{Date.now().toString().slice(-8)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Transaction</div>
                  <div className="font-mono text-lg">
                    sig_{Date.now()}_test
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium">Initial Liquidity Provided</span>
                  <span className="text-xl font-bold">{buyAmount} SOL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Tokens Distributed</span>
                  <span className="text-xl font-bold text-green-400">
                    {quote?.estimatedTokens.toLocaleString()} {projectData.ticker}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-lg mb-2">✅ Airdrops Executed</h4>
                {distribution.map((holder, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span>{holder.name}:</span>
                    <span className="font-mono">{holder.tokens.toLocaleString()} {projectData.ticker}</span>
                    <span className="text-gray-400">→ {holder.address.slice(0, 6)}...{holder.address.slice(-4)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">💰 Revenue Model Active</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Bonding Curve Fee:</span>
                  <span className="font-bold">1.25% (you earn 0.30%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Graduation Target:</span>
                  <span className="font-bold">84.985 SOL raised</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Post-Graduation:</span>
                  <span className="font-bold">0.05%-0.95% (30% to you)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.open(`https://pump.fun/coin/${projectData.ticker}${Date.now().toString().slice(-8)}`, '_blank')}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                View on Pump.fun →
              </button>
              <button
                onClick={() => {
                  setStep(1)
                  setLaunched(false)
                  setProjectData({
                    name: '',
                    ticker: '',
                    description: '',
                    twitter: '',
                    telegram: '',
                    website: '',
                    scope: 'MEME',
                    status: 'Upcoming'
                  })
                }}
                className="flex-1 px-8 py-4 bg-gray-800 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-all"
              >
                Launch Another →
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-blue-900/20 rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-semibold mb-3">ℹ️ How This Works</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Project data auto-fills from your submission form</li>
            <li>• Key holders get tokens based on their key ownership</li>
            <li>• Initial buy determines how many tokens to distribute</li>
            <li>• More SOL = more tokens for holders</li>
            <li>• Remaining supply stays on bonding curve for public</li>
            <li>• You earn 0.30% of all trades forever</li>
          </ul>
        </div>
      </div>
    </div>
  )
}