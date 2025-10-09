"use client"

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * DEPRECATED: This page is kept for backward compatibility only.
 * New routes:
 * - /raids/[id] for raids
 * - /bounties/[id] for bounties
 *
 * This page redirects old /quest/[id]?type=X URLs to the new routes.
 */
export default function QuestDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (!searchParams || !params?.id) return

    const type = searchParams.get('type')
    const id = params.id

    if (type === 'raid') {
      // 301 redirect to new raid route
      router.replace(`/raids/${id}`)
    } else if (type === 'bounty') {
      // 301 redirect to new bounty route
      router.replace(`/bounties/${id}`)
    } else {
      // No type specified - show error
      console.error('Legacy quest URL missing type parameter')
    }
  }, [params?.id, searchParams, router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
        <p className="text-zinc-400">Redirecting...</p>
      </div>
    </div>
  )
}
