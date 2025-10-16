'use client'

import { useState } from 'react'

export default function TestLaunchPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    curveId: 'test-curve-1',
    tokenName: 'Test Token',
    tokenSymbol: 'TEST',
    description: 'Token launched from bonding curve',
    initialBuySOL: 0.001
  })

  const handleLaunch = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/mock-launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🚀 Test Pump.fun Launch</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Token Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Token Name</label>
              <input
                type="text"
                value={formData.tokenName}
                onChange={(e) => setFormData({...formData, tokenName: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Token Symbol</label>
              <input
                type="text"
                value={formData.tokenSymbol}
                onChange={(e) => setFormData({...formData, tokenSymbol: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Initial Buy (SOL)</label>
              <input
                type="number"
                step="0.001"
                value={formData.initialBuySOL}
                onChange={(e) => setFormData({...formData, initialBuySOL: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleLaunch}
            disabled={loading}
            className="mt-6 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Launching...' : 'Launch Token (Mock)'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {result.success ? '✅ Launch Result' : '❌ Error'}
            </h2>

            {result.success ? (
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded">
                  <h3 className="font-semibold mb-2">Token Created:</h3>
                  <p>Mint: {result.token?.mint}</p>
                  <p>Name: {result.token?.name}</p>
                  <p>Symbol: {result.token?.symbol}</p>
                  <p>
                    <a
                      href={result.token?.pumpFunUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View on Pump.fun →
                    </a>
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <h3 className="font-semibold mb-2">Distribution:</h3>
                  <p>Total Supply: {result.distribution?.totalSupply?.toLocaleString()} tokens</p>
                  <p>Bonding Curve: {result.distribution?.bondingCurveSupply?.toLocaleString()} (79.3%)</p>
                  <p>Liquidity Pool: {result.distribution?.liquidityPoolSupply?.toLocaleString()} (20.7%)</p>
                </div>

                {result.distribution?.holderDistributions && (
                  <div className="bg-gray-700 p-4 rounded">
                    <h3 className="font-semibold mb-2">Holder Airdrops:</h3>
                    <div className="space-y-1">
                      {result.distribution.holderDistributions.map((holder: any, i: number) => (
                        <div key={i} className="flex justify-between">
                          <span>{holder.userId}</span>
                          <span>{holder.tokenAmount.toLocaleString()} tokens ({holder.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-700 p-4 rounded">
                  <h3 className="font-semibold mb-2">Revenue Model:</h3>
                  <p>Bonding: {result.tokenomics?.fees?.bonding}</p>
                  <p>Post-Graduation: {result.tokenomics?.fees?.postGraduation}</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-900/50 p-4 rounded">
                <p>{result.error}</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-700 rounded">
              <details>
                <summary className="cursor-pointer font-semibold">View Raw Response</summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-blue-900/30 rounded-lg border border-blue-600">
          <h3 className="text-xl font-semibold mb-2">ℹ️ How It Works</h3>
          <ul className="space-y-2 text-sm">
            <li>• This is a mock demonstration of the launch flow</li>
            <li>• In production, it would create a real token on Pump.fun</li>
            <li>• 793M tokens (79.3%) distributed to curve holders</li>
            <li>• 207M tokens (20.7%) locked for liquidity pool</li>
            <li>• Graduation happens at 84.985 SOL raised</li>
            <li>• You earn 0.30% of all bonding curve trades</li>
          </ul>
        </div>
      </div>
    </div>
  )
}