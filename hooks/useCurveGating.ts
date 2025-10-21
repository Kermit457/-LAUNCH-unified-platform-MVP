import { useState, useEffect } from 'react'
import { CurveHolderService } from '@/lib/appwrite/services/curve-holders'
import { useCurveActivation } from '@/contexts/CurveActivationContext'

export interface GatingCheck {
  canAccess: boolean
  loading: boolean
  error: string | null
  userKeyBalance: number
  requiredKeys: number
  reason?: 'no-curve' | 'insufficient-keys' | 'ok'
}

/**
 * Hook to check if user can access a gated feature/chat room
 *
 * @param requiredCurveId - Which curve to check (null = user's own curve)
 * @param minimumKeys - Minimum number of keys required (default: 1)
 * @returns Access status, loading state, and reason for denial
 */
export function useCurveGating(
  requiredCurveId: string | null,
  minimumKeys = 1
): GatingCheck {
  const { isActivated, curveId: userCurveId } = useCurveActivation()
  const [check, setCheck] = useState<GatingCheck>({
    canAccess: false,
    loading: true,
    error: null,
    userKeyBalance: 0,
    requiredKeys: minimumKeys,
  })

  useEffect(() => {
    async function checkAccess() {
      // If no curve is required, access granted
      if (!requiredCurveId && minimumKeys === 0) {
        setCheck({
          canAccess: true,
          loading: false,
          error: null,
          userKeyBalance: 0,
          requiredKeys: 0,
          reason: 'ok',
        })
        return
      }

      // If user doesn't have a curve, deny access
      if (!isActivated || !userCurveId) {
        setCheck({
          canAccess: false,
          loading: false,
          error: null,
          userKeyBalance: 0,
          requiredKeys: minimumKeys,
          reason: 'no-curve',
        })
        return
      }

      try {
        setCheck((prev) => ({ ...prev, loading: true }))

        // Determine which curve to check
        const curveToCheck = requiredCurveId || userCurveId

        // Check if user holds enough keys
        const hasKeys = await CurveHolderService.userHoldsKeys(
          curveToCheck,
          userCurveId, // Use user's curve ID as user ID for now (TODO: use actual user ID)
          minimumKeys
        )

        // Get user's actual balance
        const holder = await CurveHolderService.getHolder(curveToCheck, userCurveId)
        const balance = holder?.balance || 0

        setCheck({
          canAccess: hasKeys,
          loading: false,
          error: null,
          userKeyBalance: balance,
          requiredKeys: minimumKeys,
          reason: hasKeys ? 'ok' : 'insufficient-keys',
        })
      } catch (err: any) {
        console.error('Error checking curve gating:', err)
        setCheck({
          canAccess: false,
          loading: false,
          error: err.message || 'Failed to check access',
          userKeyBalance: 0,
          requiredKeys: minimumKeys,
        })
      }
    }

    checkAccess()
  }, [requiredCurveId, minimumKeys, isActivated, userCurveId])

  return check
}

/**
 * Higher-level hook for chat room access
 * Checks if user can access a specific chat thread
 *
 * @param threadType - Type of thread ('dm' | 'group' | 'project')
 * @param gatingConfig - Gating configuration for the thread
 * @returns Access status
 */
export function useChatRoomAccess(
  threadType: 'dm' | 'group' | 'project' | null,
  gatingConfig?: {
    accessControl?: 'public' | 'curve-gated' | 'members-only'
    requiredCurveId?: string
    minimumKeyBalance?: number
  }
): GatingCheck {
  const { isActivated } = useCurveActivation()

  // DMs always require curve activation
  if (threadType === 'dm') {
    return useCurveGating(null, 0) // Just check if user has curve
  }

  // Public rooms - no gating
  if (gatingConfig?.accessControl === 'public') {
    return {
      canAccess: true,
      loading: false,
      error: null,
      userKeyBalance: 0,
      requiredKeys: 0,
      reason: 'ok',
    }
  }

  // Curve-gated rooms
  if (gatingConfig?.accessControl === 'curve-gated') {
    return useCurveGating(
      gatingConfig.requiredCurveId || null,
      gatingConfig.minimumKeyBalance || 1
    )
  }

  // Members-only - just check if user has a curve
  return useCurveGating(null, 0)
}