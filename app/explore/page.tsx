"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Redirect /explore to /discover
export default function ExplorePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/discover')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
        <p className="text-white/60">Redirecting to Discover...</p>
      </div>
    </div>
  )
}
