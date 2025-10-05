"use client"

import { ArrowBigUp, MessageSquareText, Eye, ExternalLink, Rocket, Twitter } from "lucide-react";

type LaunchCardProps = {
  name: string
  subtitle: string
  ticker: string
  confidencePct: number
  upvotes: number
  comments: number
  views: number
  socials?: { twitch?: string; twitter?: string }
  boostCost?: number
  onUpvote?: () => void
  onComment?: () => void
  onView?: () => void
  onViewLaunch?: () => void
  onBoost?: () => void
}

export default function LaunchCard({
  name,
  subtitle,
  ticker,
  confidencePct,
  upvotes,
  comments,
  views,
  socials,
  boostCost = 10,
  onUpvote,
  onComment,
  onView,
  onViewLaunch,
  onBoost,
}: LaunchCardProps) {
  return (
    <div className="w-full max-w-[640px] min-w-[560px] h-[196px] rounded-2xl border border-yellow-500/40 bg-neutral-950 text-neutral-100 shadow-md overflow-hidden">
      <div className="flex h-full">
        {/* Left rail */}
        <div className="w-16 p-2 flex flex-col items-center gap-2 bg-neutral-900/60">
          <button
            onClick={onUpvote}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
            aria-label="Upvote"
          >
            <ArrowBigUp className="w-5 h-5" />
            <span className="text-xs mt-0.5">{upvotes}</span>
          </button>

          <button
            onClick={onComment}
            className="w-12 h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 flex flex-col items-center justify-center transition-colors"
            aria-label="Comments"
          >
            <MessageSquareText className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{comments}</span>
          </button>

          <div
            className="w-12 h-12 rounded-xl bg-neutral-800 flex flex-col items-center justify-center"
            aria-label="Views"
          >
            <Eye className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{views}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 grid grid-cols-[64px_1fr] gap-4">
          {/* Token tile */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-bold shadow-lg">
            <span className="text-white text-lg">{ticker?.slice(0,2).toUpperCase()}</span>
          </div>

          {/* Text + controls */}
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold leading-tight">{name}</h3>
                <p className="text-sm text-neutral-400">{subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                {socials?.twitter && (
                  <a
                    href={socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs inline-flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Confidence */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Confidence</span>
                <span className="font-semibold">{Math.round(confidencePct)}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, confidencePct))}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-3 flex items-center gap-2">
              <button
                onClick={onBoost}
                className="px-3 h-10 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-medium inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
              >
                <Rocket className="w-4 h-4" />
                <span className="text-sm">Boost ({boostCost} $LAUNCH)</span>
              </button>

              <button
                onClick={onView}
                className="px-3 h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                View
              </button>

              <button
                onClick={onViewLaunch}
                className="px-3 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 inline-flex items-center gap-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                View Launch <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
