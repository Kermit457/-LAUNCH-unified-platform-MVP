import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from './useUser'
import { getUserProfile, createUserProfile, updateUserProfile } from '@/lib/appwrite/services/users'
import { CurveService } from '@/lib/appwrite/services/curves'
import { useCreateCurve } from './useCreateCurve'

/**
 * Syncs Privy user data to Appwrite user profile
 * Creates or updates the user profile when user logs in
 * 🆕 AUTO-CREATES CCM CURVE ON-CHAIN for new users (V6 Integration)
 */
export function useSyncPrivyToAppwrite() {
  const { user, userId, username, name, avatar, isAuthenticated, twitter } = useUser()
  const { createCurve } = useCreateCurve()
  const router = useRouter()

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
          console.log('✅ Updated user profile from Privy:', userId)
        } else {
          // 🆕 AUTO-CREATE CCM CURVE ON-CHAIN for new user (V6 Integration)
          console.log('🆕 New user detected - creating on-chain curve + profile...')

          // 1. Create curve on Solana blockchain first
          let onChainSignature: string | null = null
          if (username) {
            try {
              console.log('🎨 Creating curve on-chain for:', username)
              const signature = await createCurve(username, 0) // 0 = creator gets 0 initial keys

              if (signature !== 'already_exists') {
                onChainSignature = signature
                console.log('🎉 Curve created on-chain! TX:', signature)
                console.log('🔗 Explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`)
              } else {
                console.log('✅ Curve already exists on-chain for:', username)
              }
            } catch (error) {
              console.error('⚠️ On-chain curve creation failed:', error)
              // Continue anyway - curve can be created later via UI
            }
          }

          // 2. Create CCM curve in Appwrite (for metadata/UI)
          const curve = await CurveService.createCurve({
            ownerType: 'user',
            ownerId: userId,
            basePrice: 0.01
          })

          // Override the state to 'inactive' (createCurve defaults to 'active')
          if (curve?.id) {
            await CurveService.updateCurveState(curve.id, 'inactive')
          }

          // 3. Create user profile with curve reference
          await createUserProfile({
            userId: userId,
            username: username || userId.slice(0, 8),
            displayName: name || username || 'User',
            avatar: avatar ? avatar.replace('_normal', '') : undefined, // Get full-size image
            verified: false,
            conviction: 0,
            totalEarnings: 0,
            roles: ['Member'],
            twitter: username, // 🆕 Link Twitter username (curve identifier)
            curveId: curve?.id, // 🆕 Link to auto-created curve
          })

          console.log('🎉 Created user profile + CCM curve:', {
            userId,
            curveId: curve?.id,
            username,
            onChainTx: onChainSignature
          })

          // 🆕 Redirect to /network page to show activation modal
          console.log('📍 Redirecting to /network to show activation modal...')
          router.push('/network')
        }
      } catch (error) {
        console.error('❌ Failed to sync Privy user to Appwrite:', error)
      }
    }

    syncUser()
  }, [isAuthenticated, userId, username, name, avatar, router])
}
