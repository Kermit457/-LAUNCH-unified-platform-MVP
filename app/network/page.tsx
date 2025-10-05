"use client"

import { useState } from 'react'
import { Network as NetworkIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { NetworkCard, type NetworkCardProps } from '@/components/NetworkCard'

type UserRole = "Streamer" | "Degen" | "Trader" | "Clipper" | "Editor" | "Agency" | "Manager" | "Project" | "Entertainer" | "Alpha"
type ConnectionState = "none" | "pending" | "connected" | "blocked"

interface NetworkUser {
  id: string
  name: string
  handle: string
  avatar: string
  roles: UserRole[]
  verified: boolean
  mutuals?: number
  isSelf?: boolean
  socials: {
    twitter?: boolean
    youtube?: boolean
    twitch?: boolean
    website?: boolean
  }
}

const SAMPLE_USERS: NetworkUser[] = [
  {
    id: "1",
    name: "CryptoKing",
    handle: "@cryptoking",
    avatar: "CR",
    roles: ["Streamer", "Degen", "Trader"],
    verified: true,
    mutuals: 15,
    socials: { twitter: true, youtube: true, twitch: true }
  },
  {
    id: "2",
    name: "ClipMaster",
    handle: "@clipmaster",
    avatar: "CL",
    roles: ["Clipper", "Editor"],
    verified: true,
    mutuals: 7,
    socials: { twitter: true, website: true }
  },
  {
    id: "3",
    name: "TokenQueen",
    handle: "@tokenqueen",
    avatar: "TQ",
    roles: ["Streamer", "Project"],
    verified: false,
    mutuals: 3,
    socials: { twitter: true, youtube: true }
  },
  {
    id: "4",
    name: "AgencyPro",
    handle: "@agencypro",
    avatar: "AP",
    roles: ["Agency", "Manager"],
    verified: true,
    mutuals: 12,
    socials: { twitter: true, youtube: true, website: true }
  },
  {
    id: "5",
    name: "DegenTrader",
    handle: "@degentrader",
    avatar: "DT",
    roles: ["Degen", "Trader", "Alpha"],
    verified: false,
    socials: { twitter: true }
  },
  {
    id: "6",
    name: "StreamLord",
    handle: "@streamlord",
    avatar: "SL",
    roles: ["Streamer", "Entertainer"],
    verified: true,
    mutuals: 3,
    socials: { twitter: true, youtube: true, twitch: true }
  },
]

const ROLE_COLORS: Record<UserRole, string> = {
  Streamer: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  Degen: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  Trader: "bg-green-500/20 text-green-300 border-green-500/40",
  Clipper: "bg-pink-500/20 text-pink-300 border-pink-500/40",
  Editor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  Agency: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  Manager: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  Project: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  Entertainer: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  Alpha: "bg-red-500/20 text-red-300 border-red-500/40",
}

const ALL_ROLES: UserRole[] = ["Streamer", "Degen", "Trader", "Clipper", "Editor", "Agency", "Manager", "Project", "Entertainer", "Alpha"]

export default function NetworkPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | 'All'>('All')
  const [connectionStates, setConnectionStates] = useState<Record<string, ConnectionState>>({
    "1": "none",
    "2": "none",
    "3": "pending",
    "4": "connected",
    "5": "none",
    "6": "none",
  })

  const filteredUsers = selectedRole === 'All'
    ? SAMPLE_USERS
    : SAMPLE_USERS.filter(user => user.roles.includes(selectedRole))

  const handleInvite = (id: string) => {
    setConnectionStates(prev => ({ ...prev, [id]: "pending" }))
    console.log("Invite sent to:", id)
  }

  const handleCancelInvite = (id: string) => {
    setConnectionStates(prev => ({ ...prev, [id]: "none" }))
    console.log("Invite cancelled for:", id)
  }

  const handleChat = (id: string) => {
    console.log("Opening chat with:", id)
    // TODO: Navigate to chat or open drawer
  }

  const handleFollow = (id: string) => {
    console.log("Following:", id)
    // TODO: Follow logic
  }

  const handleShare = (id: string) => {
    console.log("Sharing profile:", id)
    // TODO: Share profile
  }

  const handleInviteToCampaign = (id: string) => {
    console.log("Inviting to campaign:", id)
    // TODO: Open campaign assignment drawer
  }

  const handleEditProfile = () => {
    console.log("Opening profile editor")
    // TODO: Navigate to profile settings
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl">
            <NetworkIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">FRENWORK</h1>
        </div>
        <p className="text-white/60 text-lg">
          Top creators in our network - ranked by performance
        </p>
      </div>

      {/* Role Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRole('All')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
              selectedRole === 'All'
                ? "bg-cyan-500/30 text-cyan-200 border-cyan-400/60"
                : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
            )}
          >
            All ({SAMPLE_USERS.length})
          </button>
          {ALL_ROLES.map(role => {
            const count = SAMPLE_USERS.filter(u => u.roles.includes(role)).length
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                  selectedRole === role
                    ? ROLE_COLORS[role]
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                )}
              >
                {role} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredUsers.map(user => (
          <NetworkCard
            key={user.id}
            id={user.id}
            name={user.name}
            handle={user.handle}
            roles={user.roles}
            verified={user.verified}
            avatarUrl={user.avatar}
            mutuals={user.mutuals}
            connection={connectionStates[user.id] || "none"}
            isSelf={user.isSelf}
            socials={user.socials}
            onInvite={handleInvite}
            onCancelInvite={handleCancelInvite}
            onChat={handleChat}
            onFollow={handleFollow}
            onShare={handleShare}
            onInviteToCampaign={handleInviteToCampaign}
            onEditProfile={handleEditProfile}
          />
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-teal-950/40 border border-cyan-500/20 p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Want to be featured?</h2>
        <p className="text-white/70 text-lg mb-8">
          Complete your profile and start creating content to get listed in FRENWORK
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105">
          Complete Your Profile
        </button>
      </div>
    </div>
  )
}