'use client'

import { useState } from 'react'
import { Wallet, Twitter, Youtube, Twitch, MessageSquare, ExternalLink, Bell, Users, Eye, Trash2 } from 'lucide-react'
import { CopyButton } from '@/components/common/CopyButton'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newSubmission: true,
    campaignEnd: true,
    payoutReady: true,
    weeklyReport: false,
  })

  const [publicProfile, setPublicProfile] = useState({
    showEarnings: false,
    showCampaigns: true,
    showSocials: true,
  })

  const walletAddress = 'FRENwABC123XYZ789x7gH2'

  const socials = [
    { platform: 'X (Twitter)', icon: Twitter, handle: '@alpha_fren', connected: true, color: 'from-blue-500 to-cyan-500' },
    { platform: 'YouTube', icon: Youtube, handle: '@AlphaFren', connected: true, color: 'from-red-500 to-pink-500' },
    { platform: 'Twitch', icon: Twitch, handle: 'alphafren', connected: false, color: 'from-purple-500 to-violet-500' },
    { platform: 'Discord', icon: MessageSquare, handle: 'alphafren#1234', connected: true, color: 'from-indigo-500 to-blue-500' },
  ]

  const teamMembers = [
    { id: '1', name: 'Sarah Chen', handle: '@sarahc', role: 'Admin', avatar: 'SC' },
    { id: '2', name: 'Mike Ross', handle: '@mikeross', role: 'Editor', avatar: 'MR' },
    { id: '3', name: 'Emma Wilson', handle: '@emmaw', role: 'Viewer', avatar: 'EW' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings & Verification</h1>
        <p className="text-sm text-white/50 mt-1">Manage your account, connections, and preferences</p>
      </div>

      {/* Wallet Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Wallet Connection</h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="text-sm text-white/50">Solana Wallet</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-white">{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</span>
                <CopyButton text={walletAddress} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-medium">
              Connected
            </div>
            <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View on Solscan
            </button>
          </div>
        </div>
      </div>

      {/* Socials Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Social Connections</h3>
        <div className="space-y-3">
          {socials.map((social) => {
            const Icon = social.icon
            return (
              <div
                key={social.platform}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${social.color} bg-opacity-20 flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{social.platform}</div>
                    {social.connected && (
                      <div className="text-sm text-white/50 mt-0.5">{social.handle}</div>
                    )}
                  </div>
                </div>
                {social.connected ? (
                  <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm font-medium transition-all">
                    Disconnect
                  </button>
                ) : (
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-all">
                    Connect
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Notifications</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-white/50" />
                <div>
                  <div className="text-sm font-medium text-white">
                    {key === 'newSubmission' && 'New Submissions'}
                    {key === 'campaignEnd' && 'Campaign Endings'}
                    {key === 'payoutReady' && 'Payouts Ready'}
                    {key === 'weeklyReport' && 'Weekly Reports'}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {key === 'newSubmission' && 'Get notified when new submissions arrive'}
                    {key === 'campaignEnd' && 'Alert when campaigns are about to end'}
                    {key === 'payoutReady' && 'Notify when payouts are claimable'}
                    {key === 'weeklyReport' && 'Receive weekly analytics summaries'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  value ? 'bg-purple-500' : 'bg-white/20'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                    value ? 'left-6' : 'left-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Team Members</h3>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-all">
            + Invite Member
          </button>
        </div>
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {member.avatar}
                </div>
                <div>
                  <div className="font-medium text-white">{member.name}</div>
                  <div className="text-sm text-white/50">{member.handle}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  defaultValue={member.role}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Public Profile Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Public Profile Settings</h3>
        <div className="space-y-4">
          {Object.entries(publicProfile).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-white/50" />
                <div>
                  <div className="text-sm font-medium text-white">
                    {key === 'showEarnings' && 'Show Earnings'}
                    {key === 'showCampaigns' && 'Show Campaigns'}
                    {key === 'showSocials' && 'Show Social Links'}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {key === 'showEarnings' && 'Display your total earnings on your public profile'}
                    {key === 'showCampaigns' && 'List your active campaigns publicly'}
                    {key === 'showSocials' && 'Show social media links on your profile'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPublicProfile({ ...publicProfile, [key]: !value })}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  value ? 'bg-purple-500' : 'bg-white/20'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                    value ? 'left-6' : 'left-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}