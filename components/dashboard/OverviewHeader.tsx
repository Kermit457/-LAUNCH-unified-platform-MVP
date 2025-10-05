'use client'

import { Share2, UserPlus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface OverviewHeaderProps {
  handle: string
  name: string
  roles: string[]
  verified?: boolean
  walletAddress: string
}

export function OverviewHeader({ handle, name, roles, verified, walletAddress }: OverviewHeaderProps) {
  const shortAddr = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-[#0B0F1A] rounded-full" />
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold text-white">{handle}</h1>
              {verified && (
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-2">
              {roles.map((role, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${handle}`}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80 inline-flex items-center gap-2"
          >
            Public Profile →
          </Link>
          <button
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
            aria-label="Share profile"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Follow
          </button>
        </div>
      </div>

      {/* Subline */}
      <p className="text-sm text-white/60">
        Manage campaigns, earnings, and reviews. Solana wallet: <span className="font-mono text-white/80">{shortAddr}</span>
      </p>
    </div>
  )
}
