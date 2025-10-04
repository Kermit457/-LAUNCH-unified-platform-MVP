'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Clock, Users, DollarSign } from 'lucide-react'

export default function MarketplacePage() {
  const predictions = [
    {
      id: '1',
      question: 'Will BTC reach $100k by end of month?',
      streamer: 'CryptoKing',
      options: ['YES', 'NO'],
      tallies: { YES: 342, NO: 198 },
      prize: '500 USDC',
      endsIn: '2h 15m',
      category: 'Crypto'
    },
    {
      id: '2',
      question: 'Team A vs Team B - Who wins?',
      streamer: 'GameMaster',
      options: ['Team A', 'Team B', 'Draw'],
      tallies: { 'Team A': 156, 'Team B': 203, 'Draw': 41 },
      prize: '300 USDC',
      endsIn: '45m',
      category: 'Gaming'
    },
    {
      id: '3',
      question: 'Will ETH merge succeed?',
      streamer: 'EthDev',
      options: ['Success', 'Delayed', 'Failed'],
      tallies: { 'Success': 421, 'Delayed': 89, 'Failed': 12 },
      prize: '1000 USDC',
      endsIn: '5h 30m',
      category: 'Crypto'
    },
    {
      id: '4',
      question: 'Stock market direction tomorrow?',
      streamer: 'WallStreetGuru',
      options: ['UP', 'DOWN', 'FLAT'],
      tallies: { 'UP': 267, 'DOWN': 189, 'FLAT': 94 },
      prize: '750 USDC',
      endsIn: '1h 20m',
      category: 'Finance'
    },
    {
      id: '5',
      question: 'Will the new game launch on time?',
      streamer: 'GameNews',
      options: ['YES', 'NO'],
      tallies: { YES: 123, NO: 287 },
      prize: '400 USDC',
      endsIn: '3h 45m',
      category: 'Gaming'
    },
    {
      id: '6',
      question: 'Next Solana NFT drop success?',
      streamer: 'NFTWhale',
      options: ['Sold Out', 'Partial', 'Flop'],
      tallies: { 'Sold Out': 312, 'Partial': 98, 'Flop': 45 },
      prize: '600 USDC',
      endsIn: '4h 10m',
      category: 'NFT'
    },
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      'Crypto': 'from-orange-500 to-yellow-500',
      'Gaming': 'from-purple-500 to-pink-500',
      'Finance': 'from-green-500 to-emerald-500',
      'NFT': 'from-blue-500 to-cyan-500'
    }
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Prediction Marketplace</h1>
          <p className="text-white/60">Join active predictions from streamers across the platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Active Predictions</p>
                  <p className="text-2xl font-bold text-white mt-1">{predictions.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Total Prize Pool</p>
                  <p className="text-2xl font-bold text-white mt-1">$3.55k</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Total Participants</p>
                  <p className="text-2xl font-bold text-white mt-1">2,847</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Ending Soon</p>
                  <p className="text-2xl font-bold text-white mt-1">2</p>
                </div>
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predictions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((prediction) => {
            const totalVotes = Object.values(prediction.tallies).reduce((a, b) => a + b, 0)
            const topOption = Object.entries(prediction.tallies).sort(([,a], [,b]) => b - a)[0]

            return (
              <Card key={prediction.id} className="hover:border-purple-500/50 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(prediction.category)} rounded text-xs font-bold text-white`}>
                      {prediction.category}
                    </div>
                    <div className="flex items-center gap-1 text-orange-400 text-sm">
                      <Clock className="w-3 h-3" />
                      {prediction.endsIn}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{prediction.question}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    by {prediction.streamer}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Options with tallies */}
                  <div className="space-y-2">
                    {prediction.options.map((option) => {
                      const votes = prediction.tallies[option] || 0
                      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0

                      return (
                        <div key={option} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white font-medium">{option}</span>
                            <span className="text-white/60">{percentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={percentage} />
                        </div>
                      )
                    })}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1 text-sm text-white/60">
                      <Users className="w-4 h-4" />
                      {totalVotes} votes
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-green-400">
                      <DollarSign className="w-4 h-4" />
                      {prediction.prize}
                    </div>
                  </div>

                  {/* Join Button */}
                  <Button className="w-full">
                    Join Prediction
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
