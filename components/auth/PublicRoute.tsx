"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

/**
 * Wrapper component for public routes (login, signup)
 * Redirects authenticated users away from these pages
 */
export function PublicRoute({ children, redirectTo = '/discover' }: PublicRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  // Show loading state while checking authentication
  if (loading) {
    return null
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null
  }

  return <>{children}</>
}
