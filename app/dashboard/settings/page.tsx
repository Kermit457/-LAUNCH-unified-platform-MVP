'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Twitter, Youtube, Twitch, MessageSquare, ExternalLink, Bell, Eye, Trash2, UserPlus } from 'lucide-react'
import { CopyButton } from '@/components/common/CopyButton'
import { PremiumButton } from '@/components/design-system'
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
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-design-purple-600/20 via-design-pink-600/20 to-design-purple-800/20 rounded-2xl border border-design-zinc-800 p-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Settings & Verification</h1>
          <p className="text-design-zinc-300">Manage your account, connections, and preferences</p>
        </div>
      </div>

      {/* Wallet Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-design-zinc-900/50 backdrop-blur-sm border border-design-zinc-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">Wallet Connection</h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-design-zinc-800/50 border border-design-zinc-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-design-purple-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-design-purple-300" />
            </div>
            <div>
              <div className="text-sm text-design-zinc-400">Solana Wallet</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-white">{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</span>
                <CopyButton text={walletAddress} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
              Connected
            </div>
            <button className="px-4 py-2 rounded-lg bg-design-zinc-800 hover:bg-design-zinc-700 text-white text-sm font-medium transition-all flex items-center gap-2 border border-design-zinc-700">
              <ExternalLink className="w-4 h-4" />
              View on Solscan
            </button>
          </div>
        </div>
      </motion.div>

      {/* Socials Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-design-zinc-900/50 backdrop-blur-sm border border-design-zinc-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">Social Connections</h3>
        <div className="space-y-3">
          {socials.map((social, idx) => {
            const Icon = social.icon
            return (
              <motion.div
                key={social.platform}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-design-zinc-800/50 border border-design-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${social.color} bg-opacity-20 flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{social.platform}</div>
                    {social.connected && (
                      <div className="text-sm text-design-zinc-400 mt-0.5">{social.handle}</div>
                    )}
                  </div>
                </div>
                {social.connected ? (
                  <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm font-medium transition-all border border-red-500/30">
                    Disconnect
                  </button>
                ) : (
                  <PremiumButton onClick={() => console.log('Connect', social.platform)} size="sm">
                    Connect
                  </PremiumButton>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-design-zinc-900/50 backdrop-blur-sm border border-design-zinc-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">Notifications</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-design-zinc-400" />
                <div>
                  <div className="text-sm font-medium text-white">
                    {key === 'newSubmission' && 'New Submissions'}
                    {key === 'campaignEnd' && 'Campaign Endings'}
                    {key === 'payoutReady' && 'Payouts Ready'}
                    {key === 'weeklyReport' && 'Weekly Reports'}
                  </div>
                  <div className="text-xs text-design-zinc-500 mt-0.5">
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
                  value ? 'bg-design-purple-500' : 'bg-design-zinc-700'
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
      </motion.div>

      {/* Team Members Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-design-zinc-900/50 backdrop-blur-sm border border-design-zinc-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Team Members</h3>
          <PremiumButton onClick={() => console.log('Invite member')} size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </PremiumButton>
        </div>
        <div className="space-y-3">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              className="flex items-center justify-between p-4 rounded-lg bg-design-zinc-800/50 border border-design-zinc-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-design-purple-500 to-design-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {member.avatar}
                </div>
                <div>
                  <div className="font-medium text-white">{member.name}</div>
                  <div className="text-sm text-design-zinc-400">{member.handle}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  defaultValue={member.role}
                  className="px-3 py-1.5 rounded-lg bg-design-zinc-900 border border-design-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-design-purple-500/50"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all border border-red-500/30">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Public Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-design-zinc-900/50 backdrop-blur-sm border border-design-zinc-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">Public Profile Settings</h3>
        <div className="space-y-4">
          {Object.entries(publicProfile).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-design-zinc-400" />
                <div>
                  <div className="text-sm font-medium text-white">
                    {key === 'showEarnings' && 'Show Earnings'}
                    {key === 'showCampaigns' && 'Show Campaigns'}
                    {key === 'showSocials' && 'Show Social Links'}
                  </div>
                  <div className="text-xs text-design-zinc-500 mt-0.5">
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
                  value ? 'bg-design-purple-500' : 'bg-design-zinc-700'
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
      </motion.div>
    </div>
  )
}
