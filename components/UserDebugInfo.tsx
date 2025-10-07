"use client"

import { useUser } from '@/hooks/useUser'
import { useEffect, useState } from 'react'
import { getUserProfile } from '@/lib/appwrite/services/users'

export function UserDebugInfo() {
  const { userId, username, name, avatar, isAuthenticated, user } = useUser()
  const [appwriteProfile, setAppwriteProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return
      setLoading(true)
      try {
        const profile = await getUserProfile(userId)
        setAppwriteProfile(profile)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [userId])

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500/90 text-white p-4 rounded-lg max-w-md text-sm">
        <div className="font-bold mb-2">🔐 Not Authenticated</div>
        <div>Please log in to see debug info</div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-md text-xs border border-white/20 max-h-96 overflow-auto">
      <div className="font-bold mb-2 text-green-400">✅ Authentication Debug</div>

      <div className="space-y-2">
        <div>
          <span className="text-zinc-400">Privy User ID:</span>
          <div className="text-white font-mono">{userId}</div>
        </div>

        <div>
          <span className="text-zinc-400">Username:</span>
          <div className="text-white">{username || 'N/A'}</div>
        </div>

        <div>
          <span className="text-zinc-400">Display Name:</span>
          <div className="text-white">{name}</div>
        </div>

        <div>
          <span className="text-zinc-400">Avatar:</span>
          <div className="text-white break-all">{avatar ? '✅ Yes' : '❌ No'}</div>
        </div>

        <div className="border-t border-white/20 my-2"></div>

        <div>
          <span className="text-zinc-400 font-bold">Appwrite Profile:</span>
          {loading && <div className="text-yellow-400">Loading...</div>}
          {!loading && appwriteProfile && (
            <div className="text-green-400">
              ✅ Exists in Appwrite
              <div className="text-xs mt-1">
                <div>Doc ID: {appwriteProfile.$id}</div>
                <div>Username: {appwriteProfile.username}</div>
                <div>Display: {appwriteProfile.displayName}</div>
              </div>
            </div>
          )}
          {!loading && !appwriteProfile && (
            <div className="text-red-400">
              ❌ Not found in Appwrite
              <div className="text-xs mt-1">
                Check browser console for sync errors
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/20 my-2"></div>

        <div>
          <span className="text-zinc-400">Linked Accounts:</span>
          <div className="text-white">
            {user?.linkedAccounts?.map((acc: any, i: number) => (
              <div key={i} className="text-xs">
                • {acc.type}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}