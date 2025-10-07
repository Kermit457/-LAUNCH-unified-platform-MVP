"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { getUserProfile, updateUserProfile } from '@/lib/appwrite/services/users'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AvatarUpload } from '@/components/upload/AvatarUpload'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, Award, Edit2, Check, X, Twitter, Youtube, Globe, Video, Instagram, MessageCircle } from 'lucide-react'
import type { UserProfile } from '@/lib/appwrite/services/users'

export default function ProfilePage() {
  const { user, userId } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)

  // Social links state
  const [twitterHandle, setTwitterHandle] = useState('')
  const [youtubeChannel, setYoutubeChannel] = useState('')
  const [tiktokHandle, setTiktokHandle] = useState('')
  const [website, setWebsite] = useState('')

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

  const handleAvatarUpload = async (url: string, fileId: string) => {
    if (!profile) return

    try {
      const updated = await updateUserProfile(profile.$id, {
        avatar: url,
      })
      setProfile(updated)
    } catch (error) {
      console.error('Failed to update avatar:', error)
    }
  }

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
            <p className="text-zinc-400">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-zinc-400">Manage your LaunchOS account and social connections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Stats */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Profile Picture</h2>
              <div className="flex flex-col items-center">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.displayName || profile.username}
                    className="w-32 h-32 rounded-full object-cover border-4 border-fuchsia-500/20 mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-4xl mb-4">
                    {(profile?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="text-xs text-zinc-500 text-center">
                  JPG, PNG or WEBP. Max size 5MB.
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Conviction</span>
                  <span className="text-cyan-400 font-bold">{profile?.conviction || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Total Earnings</span>
                  <span className="text-green-400 font-bold">${profile?.totalEarnings || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Roles</span>
                  <div className="flex gap-1 flex-wrap">
                    {profile?.roles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 text-xs"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Account Info Card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Account Information</h2>
                {!editing ? (
                  <Button onClick={() => setEditing(true)} variant="secondary" size="sm" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} variant="boost" size="sm" disabled={saving} className="gap-2">
                      <Check className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button onClick={() => setEditing(false)} variant="ghost" size="sm" className="gap-2">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Username
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                    @{profile?.username || 'N/A'}
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Display Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all"
                      placeholder="Your display name"
                    />
                  ) : (
                    <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                      {profile?.displayName || 'Not set'}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                    {user?.email?.address || 'N/A'}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white min-h-[100px]">
                      {profile?.bio || 'No bio yet'}
                    </div>
                  )}
                </div>

                {/* Account Created */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Member Since
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                    {new Date().toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                {/* Verified Badge */}
                {profile?.verified && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Award className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Verified Account</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Connections */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Social Connections</h2>
              <div className="space-y-4">
                {/* Twitter */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Twitter className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">X (Twitter)</div>
                      <div className="text-sm text-zinc-400">
                        {user?.twitter?.username ? `@${user.twitter.username}` : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  {user?.twitter?.username ? (
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                      Disconnect
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm">
                      Connect
                    </Button>
                  )}
                </div>

                {/* YouTube */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Youtube className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">YouTube</div>
                      <div className="text-sm text-zinc-400">Not connected</div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Connect
                  </Button>
                </div>

                {/* Instagram */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Instagram</div>
                      <div className="text-sm text-zinc-400">Not connected</div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Connect
                  </Button>
                </div>

                {/* TikTok */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Video className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">TikTok</div>
                      <div className="text-sm text-zinc-400">Not connected</div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Connect
                  </Button>
                </div>

                {/* Discord */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Discord</div>
                      <div className="text-sm text-zinc-400">Not connected</div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Connect
                  </Button>
                </div>

                {/* Website */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Website</div>
                      <div className="text-sm text-zinc-400">Not connected</div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Add Link
                  </Button>
                </div>
              </div>
            </div>

            {/* Connection Info */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Connection Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">User ID:</span>
                  <span className="text-zinc-300 font-mono text-xs">{userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Database:</span>
                  <span className="text-zinc-300">Appwrite (Frankfurt)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Endpoint:</span>
                  <span className="text-zinc-300">fra.cloud.appwrite.io</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
