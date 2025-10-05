"use client"

import { useState } from 'react'
import { Network as NetworkIcon, Users, Share2, UserPlus, Check } from 'lucide-react'
import { cn } from '@/lib/cn'

type UserRole = "Streamer" | "Degen" | "Trader" | "Clipper" | "Editor" | "Agency" | "Manager" | "Project" | "Entertainer" | "Alpha"

interface NetworkUser {
  id: string
  name: string
  username: string
  avatar: string
  roles: UserRole[]
  verified: boolean
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
    username: "@cryptoking",
    avatar: "CR",
    roles: ["Streamer", "Degen", "Trader"],
    verified: true,
    socials: { twitter: true, youtube: true, twitch: true }
  },
  {
    id: "2",
    name: "ClipMaster",
    username: "@clipmaster",
    avatar: "CL",
    roles: ["Clipper", "Editor"],
    verified: true,
    socials: { twitter: true, website: true }
  },
  {
    id: "3",
    name: "TokenQueen",
    username: "@tokenqueen",
    avatar: "TQ",
    roles: ["Streamer", "Project"],
    verified: false,
    socials: { twitter: true, youtube: true }
  },
  {
    id: "4",
    name: "AgencyPro",
    username: "@agencypro",
    avatar: "AP",
    roles: ["Agency", "Manager"],
    verified: true,
    socials: { twitter: true, youtube: true, website: true }
  },
  {
    id: "5",
    name: "DegenTrader",
    username: "@degentrader",
    avatar: "DT",
    roles: ["Degen", "Trader", "Alpha"],
    verified: false,
    socials: { twitter: true }
  },
  {
    id: "6",
    name: "StreamLord",
    username: "@streamlord",
    avatar: "SL",
    roles: ["Streamer", "Entertainer"],
    verified: true,
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
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set())

  const filteredUsers = selectedRole === 'All'
    ? SAMPLE_USERS
    : SAMPLE_USERS.filter(user => user.roles.includes(selectedRole))

  const toggleFollow = (userId: string) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
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
          <UserCard
            key={user.id}
            user={user}
            isFollowed={followedUsers.has(user.id)}
            onToggleFollow={() => toggleFollow(user.id)}
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

function UserCard({ user, isFollowed, onToggleFollow }: {
  user: NetworkUser
  isFollowed: boolean
  onToggleFollow: () => void
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-neutral-900/70 to-neutral-800/50 border border-white/10 p-6 hover:border-cyan-500/30 transition-all group">
      {/* Avatar & Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {user.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-lg">{user.name}</h3>
            {user.verified && (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <p className="text-white/60 text-sm">{user.username}</p>
        </div>
      </div>

      {/* Roles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {user.roles.map(role => (
          <span
            key={role}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold border",
              ROLE_COLORS[role]
            )}
          >
            {role}
          </span>
        ))}
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-3 mb-4">
        {user.socials.twitter && (
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
        )}
        {user.socials.youtube && (
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
        )}
        {user.socials.twitch && (
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
            </svg>
          </div>
        )}
        {user.socials.website && (
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white text-sm font-medium transition-all flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button
          onClick={onToggleFollow}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
            isFollowed
              ? "bg-white/10 border border-white/20 text-white hover:bg-white/15"
              : "bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
          )}
        >
          <UserPlus className="w-4 h-4" />
          {isFollowed ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  )
}