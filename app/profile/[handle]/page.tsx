'use client'

import { useParams } from 'next/navigation'
import { ArrowLeft, Twitter, Youtube, Twitch, Globe, Share2, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function PublicProfilePage() {
  const params = useParams()
  const handle = params?.handle as string

  if (!handle) return null

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-all mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Profile Header */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
                {handle.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 bg-clip-text text-transparent">@{handle}</h1>
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-lime-500/20 text-lime-300">
                    Creator
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300">
                    Advertiser
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 hover:from-lime-600 hover:via-lime-600 hover:to-cyan-600 text-white font-medium transition-all flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Follow
              </button>
            </div>
          </div>

          {/* Bio */}
          <p className="text-zinc-400 mb-6">
            Content creator and Solana enthusiast. Creating amazing crypto content and running campaigns.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all">
              <Twitter className="w-5 h-5" />
              <span className="text-sm">Twitter</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all">
              <Youtube className="w-5 h-5" />
              <span className="text-sm">YouTube</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all">
              <Twitch className="w-5 h-5" />
              <span className="text-sm">Twitch</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all">
              <Globe className="w-5 h-5" />
              <span className="text-sm">Website</span>
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="text-sm text-zinc-500 mb-1 uppercase tracking-wide">Total Campaigns</div>
            <div className="text-3xl font-bold text-white">6</div>
            <div className="text-xs text-green-300 mt-1">+2 this month</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="text-sm text-zinc-500 mb-1 uppercase tracking-wide">Active Campaigns</div>
            <div className="text-3xl font-bold text-white">4</div>
            <div className="text-xs text-lime-300 mt-1">Live now</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="text-sm text-zinc-500 mb-1 uppercase tracking-wide">Conviction Score</div>
            <div className="text-3xl font-bold text-white">87%</div>
            <div className="text-xs text-green-300 mt-1">Excellent</div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 bg-clip-text text-transparent mb-4">Active Campaigns</h2>
          <div className="space-y-3">
            {['Solana Summer Clips', 'Pump.fun Raid Campaign', 'NFT Launch Clips'].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <div className="font-medium text-white">{name}</div>
                  <div className="text-sm text-zinc-400 mt-1">
                    {i === 0 ? 'Clipping' : i === 1 ? 'Raid' : 'Clipping'} • Running
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-medium">
                  Live
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}