'use client'

import { useState, useEffect } from 'react'
import type { Curve, CurveHolder, CurveEvent } from '@/types/curve'

interface UseCurveResult {
  curve: Curve | null
  holder: CurveHolder | null
  holders: CurveHolder[]
  events: CurveEvent[]
  isLoading: boolean
  error: string | null
  buyKeys: (keys: number) => Promise<void>
  sellKeys: (keys: number) => Promise<void>
  freeze: () => Promise<void>
  launch: (p0?: number) => Promise<void>
  refetch: () => Promise<void>
}

export const useCurve = (
  curveId: string | null,
  userId?: string
): UseCurveResult => {
  const [curve, setCurve] = useState<Curve | null>(null)
  const [holder, setHolder] = useState<CurveHolder | null>(null)
  const [holders, setHolders] = useState<CurveHolder[]>([])
  const [events, setEvents] = useState<CurveEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCurve = async () => {
    if (!curveId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/curve/${curveId}?includeHolders=true&includeEvents=true`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch curve')
      }

      const data = await response.json()
      setCurve(data.curve)
      setHolders(data.holders || [])
      setEvents(data.events || [])

      // Fetch user's holder position if userId provided
      if (userId) {
        try {
          const holderResponse = await fetch(
            `/api/curve/${curveId}/holder/${userId}`
          )
          if (holderResponse.ok) {
            const holderData = await holderResponse.json()
            setHolder(holderData.holder)
          }
        } catch (err) {
          // User might not be a holder yet
          setHolder(null)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load curve')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCurve()
  }, [curveId, userId])

  const buyKeys = async (keys: number) => {
    if (!curveId || !userId) throw new Error('Missing curveId or userId')

    const response = await fetch(`/api/curve/${curveId}/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keys,
        userId,
        referrerId: localStorage.getItem('referrerId') || undefined
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Buy failed')
    }

    const data = await response.json()
    setCurve(data.curve)
    setHolder(data.holder)
    await fetchCurve() // Refresh full data
  }

  const sellKeys = async (keys: number) => {
    if (!curveId || !userId) throw new Error('Missing curveId or userId')

    const response = await fetch(`/api/curve/${curveId}/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keys, userId })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Sell failed')
    }

    const data = await response.json()
    setCurve(data.curve)
    setHolder(data.holder)
    await fetchCurve() // Refresh full data
  }

  const freeze = async () => {
    if (!curveId || !userId) throw new Error('Missing curveId or userId')

    const response = await fetch(`/api/curve/${curveId}/freeze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Freeze failed')
    }

    const data = await response.json()
    setCurve(data.curve)
    await fetchCurve() // Refresh full data
  }

  const launch = async (p0?: number) => {
    if (!curveId || !userId) throw new Error('Missing curveId or userId')

    const response = await fetch(`/api/curve/${curveId}/launch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        p0
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Launch failed')
    }

    const data = await response.json()
    setCurve(data.curve)
    await fetchCurve() // Refresh full data
  }

  return {
    curve,
    holder,
    holders,
    events,
    isLoading,
    error,
    buyKeys,
    sellKeys,
    freeze,
    launch,
    refetch: fetchCurve
  }
}
