"use client"

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Video, Clock, Users, DollarSign, Upload, Eye, Link2, Package } from 'lucide-react'
import { useState } from 'react'

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [hasJoined, setHasJoined] = useState(false)

  // TODO: Fetch real campaign data by params.id
  const campaign = {
    id: params.id,
    title: 'Clip $COIN Launch Video',
    description: 'Create engaging short-form content showcasing the $COIN token launch. Best clips will be featured across our social channels!',
    pool: 2000,
    paid: 400,
    ratePerThousand: 20,
    participants: 23,
    views: 45,
    platforms: ['youtube', 'tiktok', 'twitch'],
    duration: '5 days left',
    socialLinks: [
      'https://twitter.com/coinproject',
      'https://discord.gg/coinproject',
      'https://t.me/coinproject'
    ],
    driveLink: 'https://drive.google.com/drive/folders/creator-kit',
    rules: {
      minViews: 1000,
      minDuration: 30,
      maxDuration: 180,
      platforms: ['youtube', 'tiktok', 'twitch'],
    },
    examples: [
      { id: '1', creator: '@creator1', views: 15000, earned: 300 },
      { id: '2', creator: '@creator2', views: 12000, earned: 240 },
      { id: '3', creator: '@creator3', views: 8500, earned: 170 },
    ]
  }

  const progressPct = Math.round((campaign.paid / campaign.pool) * 100)

  return (
    <div className="min-h-screen pb-24">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-br from-fuchsia-950/40 to-neutral-900/70 border border-fuchsia-500/30 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 rounded-lg border bg-fuchsia-500/30 border-fuchsia-400/60 text-fuchsia-200 font-bold text-sm">
                📹 Campaign
              </div>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-lg text-sm font-bold text-green-400 uppercase">
                Live
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{campaign.title}</h1>
            <p className="text-white/70">{campaign.description}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
              <Share2 className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/60 mb-1">Prize Pool</div>
            <div className="text-xl font-bold text-fuchsia-400">${campaign.pool.toLocaleString()} USDC</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/60 mb-1">Rate</div>
            <div className="text-xl font-bold text-emerald-400">${campaign.ratePerThousand}/1k views</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/60 mb-1">Creators</div>
            <div className="text-xl font-bold text-cyan-400">{campaign.participants}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/60 mb-1">Views</div>
            <div className="text-xl font-bold text-white">{campaign.views}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-white/60 mb-2">
            <span>${campaign.paid} of ${campaign.pool} paid out</span>
            <span className="font-semibold text-white">{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        {!hasJoined ? (
          <button
            onClick={() => setHasJoined(true)}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-600 hover:from-fuchsia-600 hover:via-pink-600 hover:to-purple-700 text-white font-bold inline-flex items-center justify-center gap-2 transition-all"
          >
            <Video className="w-5 h-5" />
            Join Campaign
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/40 text-center">
            <p className="text-green-300 font-semibold">✓ You've joined this campaign!</p>
            <p className="text-sm text-green-400/80 mt-1">Upload your clips below to start earning</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Rules */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Campaign Rules</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-white/60 mb-2">Platforms</div>
                <div className="flex flex-wrap gap-2">
                  {campaign.rules.platforms.map((platform, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-sm font-medium capitalize">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-2">Video Length</div>
                <span className="text-white">{campaign.rules.minDuration}s - {campaign.rules.maxDuration}s</span>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-2">Minimum Views</div>
                <span className="text-white">{campaign.rules.minViews.toLocaleString()} views required</span>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-2">Payout</div>
                <span className="text-emerald-400 font-semibold">${campaign.ratePerThousand} USDC per 1,000 verified views</span>
              </div>
            </div>
          </div>

          {/* Upload Clip (only if joined) */}
          {hasJoined && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-fuchsia-400" />
                Submit Your Clip
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Platform <span className="text-red-400">*</span>
                  </label>
                  <select className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80">
                    <option value="">Select platform</option>
                    {campaign.rules.platforms.map(p => (
                      <option key={p} value={p} className="bg-neutral-900">{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Video URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                  <p className="mt-1 text-xs text-white/40">Link to your published video</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your clip..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80 resize-none"
                  />
                </div>
                <button className="w-full h-12 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold transition-all">
                  Submit Clip
                </button>
              </div>
            </div>
          )}

          {/* Top Clips */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-fuchsia-400" />
              Top Performing Clips
            </h2>
            <div className="space-y-3">
              {campaign.examples.map((example, i) => (
                <div key={example.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 font-semibold">#{i + 1}</span>
                    <div>
                      <div className="text-white font-medium">{example.creator}</div>
                      <div className="text-sm text-white/60">{example.views.toLocaleString()} views</div>
                    </div>
                  </div>
                  <div className="text-emerald-400 font-bold">${example.earned}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payout Info */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Earnings
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-white/60 mb-1">Rate</div>
                <div className="text-white font-bold">${campaign.ratePerThousand}/1k views</div>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-1">Token</div>
                <div className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold inline-block">
                  USDC
                </div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <div className="text-sm text-white/60 mb-1">Example</div>
                <div className="text-xs text-white/70">
                  10,000 views = <span className="text-emerald-400 font-semibold">${campaign.ratePerThousand * 10} USDC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Timeline
            </h2>
            <div className="flex items-center gap-2 text-orange-300">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{campaign.duration}</span>
            </div>
          </div>

          {/* Assets & Links */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              Assets & Links
            </h2>
            <div className="space-y-3">
              {/* Social Links */}
              {campaign.socialLinks && campaign.socialLinks.length > 0 && (
                <div>
                  <div className="text-sm text-white/60 mb-2">Social Links</div>
                  <div className="space-y-2">
                    {campaign.socialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors group"
                      >
                        <Link2 className="w-4 h-4 text-white/40 group-hover:text-white/60" />
                        <span className="text-sm truncate flex-1">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Creator Kit */}
              {campaign.driveLink && (
                <div>
                  <div className="text-sm text-white/60 mb-2">Creator Kit</div>
                  <a
                    href={campaign.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors group"
                  >
                    <Package className="w-5 h-5 text-purple-400" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-purple-300 group-hover:text-purple-200">
                        Download Creator Kit
                      </div>
                      <div className="text-xs text-white/50">
                        Brand assets & guidelines
                      </div>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Top Creators
            </h2>
            <div className="space-y-2">
              {campaign.examples.slice(0, 5).map((creator, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">#{i + 1}</span>
                    <span className="text-white text-sm">{creator.creator}</span>
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold">${creator.earned}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
