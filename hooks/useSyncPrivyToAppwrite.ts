import { useEffect } from 'react'
import { useUser } from './useUser'
import { getUserProfile, createUserProfile, updateUserProfile } from '@/lib/appwrite/services/users'

/**
 * Syncs Privy user data to Appwrite user profile
 * Creates or updates the user profile when user logs in
 */
export function useSyncPrivyToAppwrite() {
  const { user, userId, username, name, avatar, isAuthenticated, twitter } = useUser()

  useEffect(() => {
    async function syncUser() {
      if (!isAuthenticated || !userId) return

      // Debug: Log what we got from Privy
      console.log('🔐 Privy user data:', {
        userId,
        username,
        name,
        avatar,
        twitter,
        linkedAccounts: user?.linkedAccounts
      })

      try {
        // Check if user profile exists in Appwrite
        const existingProfile = await getUserProfile(userId)

        if (existingProfile) {
          // Update existing profile with latest Privy data
          await updateUserProfile(existingProfile.$id, {
            displayName: name || username || 'User',
            username: username || userId.slice(0, 8),
            avatar: avatar ? avatar.replace('_normal', '') : undefined, // Get full-size image
          })
          console.log('Updated user profile from Privy:', userId)
        } else {
          // Create new profile
          await createUserProfile({
            userId: userId,
            username: username || userId.slice(0, 8),
            displayName: name || username || 'User',
            avatar: avatar ? avatar.replace('_normal', '') : undefined, // Get full-size image
            verified: false,
            conviction: 0,
            totalEarnings: 0,
            roles: ['Member'],
          })
          console.log('Created user profile from Privy:', userId)
        }
      } catch (error) {
        console.error('Failed to sync Privy user to Appwrite:', error)
      }
    }

    syncUser()
  }, [isAuthenticated, userId, username, name, avatar])
}
