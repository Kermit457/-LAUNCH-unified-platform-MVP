'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, Eye, Zap, Search } from 'lucide-react'

export default function EarningsPage() {
  const [streamerId, setStreamerId] = useState('')
  const [showResults, setShowResults] = useState(false)

  const mockEarnings = {
    totalEarnings: 123.45,
    predictions: 78.20,
    ads: 45.25,
    impressions: 12847,
    clicks: 432,
    participations: 89
  }

  const mockHistory = [
    { id: '1', type: 'Prediction', title: 'BTC Price Prediction', amount: 15.50, date: '2025-01-10', status: 'Settled' },
    { id: '2', type: 'Ad Revenue', title: 'Sponsored Stream', amount: 25.00, date: '2025-01-09', status: 'Paid' },
    { id: '3', type: 'Prediction', title: 'Game Outcome', amount: 8.75, date: '2025-01-08', status: 'Settled' },
    { id: '4', type: 'Ad Revenue', title: 'Banner Impressions', amount: 12.30, date: '2025-01-07', status: 'Paid' },
    { id: '5', type: 'Prediction', title: 'Market Direction', amount: 22.15, date: '2025-01-06', status: 'Settled' },
    { id: '6', type: 'Ad Revenue', title: 'Click-through', amount: 7.95, date: '2025-01-05', status: 'Paid' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResults(true)
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Earnings Dashboard</h1>
          <p className="text-white/60">Track your revenue from predictions, ads, and viewer engagement</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Check Streamer Earnings
            </CardTitle>
            <CardDescription>
              Enter your streamer ID or wallet address to view earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={streamerId}
                  onChange={(e) => setStreamerId(e.target.value)}
                  placeholder="Enter Streamer ID or wallet address (e.g., 0x1234...)"
                  required
                />
              </div>
              <Button type="submit" className="gap-2">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {showResults && (
          <>
            {/* Earnings Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Total Earnings</p>
                      <p className="text-3xl font-bold gradient-text mt-1">
                        ${mockEarnings.totalEarnings.toFixed(2)}
                      </p>
                      <p className="text-xs text-white/50 mt-1">USDC</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Prediction Revenue</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        ${mockEarnings.predictions.toFixed(2)}
                      </p>
                      <p className="text-xs text-white/50 mt-1">From {mockEarnings.participations} votes</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Ad Revenue</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        ${mockEarnings.ads.toFixed(2)}
                      </p>
                      <p className="text-xs text-white/50 mt-1">{mockEarnings.impressions.toLocaleString()} impressions</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Your engagement and conversion stats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-blue-400" />
                        <span className="text-white/70">Total Impressions</span>
                      </div>
                      <span className="font-bold text-white">{mockEarnings.impressions.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <span className="text-white/70">Total Clicks</span>
                      </div>
                      <span className="font-bold text-white">{mockEarnings.clicks}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-white/70">Click-through Rate</span>
                      </div>
                      <span className="font-bold text-white">
                        {((mockEarnings.clicks / mockEarnings.impressions) * 100).toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-yellow-400" />
                        <span className="text-white/70">Avg. Revenue/Impression</span>
                      </div>
                      <span className="font-bold text-white">
                        ${(mockEarnings.totalEarnings / mockEarnings.impressions).toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent earnings and payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHistory.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 glass-card hover:bg-white/10 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            transaction.type === 'Prediction'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-orange-500/20 text-orange-300'
                          }`}>
                            {transaction.type}
                          </span>
                          <span className="font-semibold text-white">{transaction.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span className={transaction.status === 'Settled' || transaction.status === 'Paid'
                            ? 'text-green-400'
                            : 'text-yellow-400'}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">
                          +${transaction.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-white/50">USDC</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-6">
                  Load More Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Payout Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Request Payout
                </CardTitle>
                <CardDescription>
                  Withdraw your earnings to your wallet (Minimum: $50 USDC)
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button className="flex-1" disabled={mockEarnings.totalEarnings < 50}>
                  Withdraw ${mockEarnings.totalEarnings.toFixed(2)} USDC
                </Button>
                <Button variant="outline">
                  View Payout History
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State */}
        {!showResults && (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/60 mb-2">Enter your streamer ID to view earnings</p>
              <p className="text-sm text-white/40">All earnings data is displayed in real-time</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
