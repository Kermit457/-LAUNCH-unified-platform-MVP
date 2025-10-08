"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserProfile, updateUserProfile } from '@/lib/appwrite/services/users'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AvatarUpload } from '@/components/upload/AvatarUpload'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, Award, LogOut, Edit2, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/lib/appwrite/services/users'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return

      try {
        setLoading(true)
        const data = await getUserProfile(user.$id)
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
  }, [user])

  const handleAvatarUpload = async (url: string, fileId: string) => {
    if (!profile) return

    try {
      const updated = await updateUserProfile(profile.$id, {
        avatar: url,
      } as any)
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

  const handleLogout = async () => {
    await logout()
    router.push('/login')
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
      <div className="min-h-screen pb-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                My Profile
              </h1>
              <p className="text-zinc-400">Manage your LaunchOS account</p>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Stats */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Profile Picture</h2>
              <AvatarUpload
                currentAvatar={profile?.avatar}
                onUploadComplete={handleAvatarUpload}
                onError={(error) => console.error(error)}
              />
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
                  <div className="flex gap-1">
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
                    @{profile?.username || user?.name || 'N/A'}
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
                      {profile?.displayName || user?.name || 'Not set'}
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
                    {user?.email || 'N/A'}
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
                    {user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'N/A'}
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

            {/* Connection Info */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Connection Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">User ID:</span>
                  <span className="text-zinc-300 font-mono">{user?.$id}</span>
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
