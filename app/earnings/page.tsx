'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, Eye, Zap, Search, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getSubmissions } from '@/lib/appwrite/services/submissions'
import { getPayouts, getUserClaimableBalance } from '@/lib/appwrite/services/payouts'

export default function EarningsPage() {
  const { user } = useAuth()
  const [streamerId, setStreamerId] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    claimableBalance: 0,
    submissions: 0,
    approvedSubmissions: 0,
    totalViews: 0,
  })
  const [history, setHistory] = useState<any[]>([])

  // Auto-load if user is authenticated
  useEffect(() => {
    if (user) {
      setStreamerId(user.$id)
      fetchEarnings(user.$id)
    }
  }, [user])

  const fetchEarnings = async (userId: string) => {
    try {
      setLoading(true)

      // Fetch approved submissions
      const submissions = await getSubmissions({
        userId,
        status: 'approved',
        limit: 1000
      })

      // Calculate totals from submissions
      const totalFromSubmissions = submissions.reduce((sum, sub) => sum + (sub.earnings || 0), 0)
      const totalViews = submissions.reduce((sum, sub) => sum + (sub.views || 0), 0)

      // Fetch payouts
      const payouts = await getPayouts({ userId, limit: 100 })
      const claimable = await getUserClaimableBalance(userId)

      // Combine earnings
      setEarnings({
        totalEarnings: totalFromSubmissions,
        claimableBalance: claimable,
        submissions: submissions.length,
        approvedSubmissions: submissions.length,
        totalViews,
      })

      // Build history from submissions and payouts
      const submissionHistory = submissions.map(sub => ({
        id: sub.$id,
        type: 'Submission',
        title: `Submission #${sub.submissionId}`,
        amount: sub.earnings,
        date: new Date(sub.$createdAt).toLocaleDateString(),
        status: 'Approved'
      }))

      const payoutHistory = payouts.map(payout => ({
        id: payout.$id,
        type: 'Payout',
        title: `Payout #${payout.payoutId}`,
        amount: payout.net || payout.amount,
        date: new Date(payout.$createdAt).toLocaleDateString(),
        status: payout.status.charAt(0).toUpperCase() + payout.status.slice(1)
      }))

      // Combine and sort by date
      const combined = [...submissionHistory, ...payoutHistory]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)

      setHistory(combined)
      setShowResults(true)
    } catch (error) {
      console.error('Failed to fetch earnings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchEarnings(streamerId)
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
                        ${earnings.totalEarnings.toFixed(2)}
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
                      <p className="text-sm text-white/60">Approved Submissions</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {earnings.approvedSubmissions}
                      </p>
                      <p className="text-xs text-white/50 mt-1">Total submissions</p>
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
                      <p className="text-sm text-white/60">Claimable Balance</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        ${earnings.claimableBalance.toFixed(2)}
                      </p>
                      <p className="text-xs text-white/50 mt-1">{earnings.totalViews.toLocaleString()} total views</p>
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
                        <span className="text-white/70">Total Views</span>
                      </div>
                      <span className="font-bold text-white">{earnings.totalViews.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <span className="text-white/70">Total Submissions</span>
                      </div>
                      <span className="font-bold text-white">{earnings.submissions}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-white/70">Approval Rate</span>
                      </div>
                      <span className="font-bold text-white">
                        {earnings.submissions > 0 ? ((earnings.approvedSubmissions / earnings.submissions) * 100).toFixed(1) : 0}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-yellow-400" />
                        <span className="text-white/70">Avg. Earning/Submission</span>
                      </div>
                      <span className="font-bold text-white">
                        ${earnings.submissions > 0 ? (earnings.totalEarnings / earnings.submissions).toFixed(2) : '0.00'}
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
                {history.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {history.map((transaction: any) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 glass-card hover:bg-white/10 transition-all"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                transaction.type === 'Submission'
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
                              <span className={transaction.status === 'Approved' || transaction.status === 'Paid' || transaction.status === 'Claimed'
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

                    <Button variant="outline" className="w-full mt-6" disabled>
                      Load More Transactions
                    </Button>
                  </>
                ) : (
                  <div className="py-12 text-center text-white/40">
                    No transactions yet
                  </div>
                )}
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
                <Button className="flex-1" disabled={earnings.claimableBalance < 50}>
                  Withdraw ${earnings.claimableBalance.toFixed(2)} USDC
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
