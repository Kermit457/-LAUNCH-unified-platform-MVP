"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { getUserProfile, updateUserProfile } from '@/lib/appwrite/services/users'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PremiumButton } from '@/components/design-system'
import { Calendar, Award, Edit2, Check, X, Twitter, Youtube, Globe, MessageCircle, Shield, TrendingUp } from 'lucide-react'
import type { UserProfile } from '@/lib/appwrite/services/users'
import { motion } from 'framer-motion'
import { ReferralCard, RewardsPanel } from '@/components/referral'

export default function ProfilePage() {
  const { userId } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)

  // Social links state
  const [twitterHandle] = useState('')
  const [youtubeChannel] = useState('')
  const [tiktokHandle] = useState('')
  const [website] = useState('')

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return

      try {
        setLoading(true)
        const data = await getUserProfile(userId)
        if (data) {
          setProfile(data)
          setBio(data.bio || '')
          setDisplayName(data.displayName || '')
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  const handleSaveProfile = async () => {
    if (!profile) return

    try {
      setSaving(true)
      const updated = await updateUserProfile(profile.$id, {
        bio,
        displayName,
      })
      setProfile(updated)
      setEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-design-purple-500 mx-auto mb-4"></div>
            <p className="text-design-zinc-400">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header with Cover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-design-purple-600/20 via-design-pink-600/20 to-design-purple-800/20 rounded-2xl border border-design-zinc-800 p-8"
        >
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.displayName || profile.username}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-design-zinc-800"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-design-purple-500 to-design-pink-500 flex items-center justify-center text-white font-bold text-3xl border-2 border-design-zinc-800">
                    {(profile?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                {profile?.verified && (
                  <div className="absolute -top-2 -right-2 bg-design-purple-500 rounded-full p-1">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {profile?.displayName || profile?.username || 'User'}
                </h1>
                <p className="text-design-zinc-400">@{profile?.username || 'user'}</p>
                <div className="flex items-center gap-3 mt-3">
                  {profile?.roles?.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 rounded-full bg-design-purple-500/20 text-design-purple-300 text-xs font-medium border border-design-purple-500/30"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!editing ? (
              <PremiumButton variant="ghost" onClick={() => setEditing(true)}>
                <Edit2 size={16} />
                Edit Profile
              </PremiumButton>
            ) : (
              <div className="flex gap-2">
                <PremiumButton variant="ghost" onClick={() => setEditing(false)}>
                  <X size={16} />
                  Cancel
                </PremiumButton>
                <PremiumButton variant="primary" onClick={handleSaveProfile} disabled={saving}>
                  <Check size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </PremiumButton>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-design-purple-500/10 border border-design-purple-500/20">
                <Award className="w-5 h-5 text-design-purple-400" />
              </div>
              <h3 className="font-semibold text-white">Conviction</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{profile?.conviction || 0}%</div>
            <div className="h-2 bg-design-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-design-purple-500 to-design-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${profile?.conviction || 0}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-semibold text-white">Total Earnings</h3>
            </div>
            <div className="text-3xl font-bold text-white">${profile?.totalEarnings || 0}</div>
            <p className="text-sm text-design-zinc-500 mt-1">All-time</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-design-pink-500/10 border border-design-pink-500/20">
                <Calendar className="w-5 h-5 text-design-pink-400" />
              </div>
              <h3 className="font-semibold text-white">Member Since</h3>
            </div>
            <div className="text-xl font-bold text-white">
              {profile?.$createdAt ? new Date(profile.$createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
            </div>
          </motion.div>
        </div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Bio</h2>
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-design-zinc-400 mb-2 block">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-design-zinc-900 border border-design-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-design-purple-500/50"
                  placeholder="Your display name"
                />
              </div>
              <div>
                <label className="text-sm text-design-zinc-400 mb-2 block">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-design-zinc-900 border border-design-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-design-purple-500/50"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          ) : (
            <p className="text-design-zinc-300">
              {profile?.bio || 'No bio added yet. Click "Edit Profile" to add one.'}
            </p>
          )}
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-design-zinc-800/50 border border-design-zinc-700">
              <Twitter className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <p className="text-sm text-design-zinc-500">Twitter</p>
                <p className="text-white">{twitterHandle || 'Not connected'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-design-zinc-800/50 border border-design-zinc-700">
              <Youtube className="w-5 h-5 text-red-400" />
              <div className="flex-1">
                <p className="text-sm text-design-zinc-500">YouTube</p>
                <p className="text-white">{youtubeChannel || 'Not connected'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-design-zinc-800/50 border border-design-zinc-700">
              <MessageCircle className="w-5 h-5 text-pink-400" />
              <div className="flex-1">
                <p className="text-sm text-design-zinc-500">TikTok</p>
                <p className="text-white">{tiktokHandle || 'Not connected'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-design-zinc-800/50 border border-design-zinc-700">
              <Globe className="w-5 h-5 text-green-400" />
              <div className="flex-1">
                <p className="text-sm text-design-zinc-500">Website</p>
                <p className="text-white">{website || 'Not set'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Referral Program</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <ReferralCard />
            <RewardsPanel />
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
