'use client'

import { useState, useEffect } from 'react'
import type { Curve, CurveOwnerType } from '@/types/curve'

interface Owner {
  id: string
  type: CurveOwnerType
}

interface UseCurvesByOwnersResult {
  curves: Map<string, Curve | null>
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch curves for multiple owners (projects or users)
 * Returns a Map with ownerId as key and Curve as value
 */
export const useCurvesByOwners = (
  owners: Owner[]
): UseCurvesByOwnersResult => {
  const [curves, setCurves] = useState<Map<string, Curve | null>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCurves = async () => {
    if (owners.length === 0) {
      setCurves(new Map())
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const results = await Promise.allSettled(
        owners.map(async (owner) => {
          try {
            const response = await fetch(
              `/api/curve/owner?ownerType=${owner.type}&ownerId=${owner.id}`
            )

            if (!response.ok) {
              return { ownerId: owner.id, curve: null }
            }

            const data = await response.json()
            return { ownerId: owner.id, curve: data.curve }
          } catch {
            return { ownerId: owner.id, curve: null }
          }
        })
      )

      const newCurves = new Map<string, Curve | null>()
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          newCurves.set(result.value.ownerId, result.value.curve)
        }
      })

      setCurves(newCurves)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load curves')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCurves()
  }, [JSON.stringify(owners.map(o => ({ id: o.id, type: o.type })))])

  return {
    curves,
    isLoading,
    error,
    refetch: fetchCurves
  }
}
