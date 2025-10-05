import { useState, useEffect } from 'react'

/**
 * Mock join-gate hook for managing launch join status and authentication
 *
 * TODO: Replace with real auth provider (Appwrite, Clerk, etc.)
 * - Check actual user session
 * - Call API to check launch join status
 * - Call API to join launch
 */
export function useJoinGate(launchId: string) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock: Read user from localStorage
    const checkAuth = () => {
      const user = localStorage.getItem('mock-user')
      if (user) {
        try {
          const parsed = JSON.parse(user)
          setIsSignedIn(true)
          setUserName(parsed.name)

          // Check if user has joined this specific launch
          const joinedLaunches = JSON.parse(localStorage.getItem('joined-launches') || '[]')
          setHasJoined(joinedLaunches.includes(launchId))
        } catch (error) {
          console.error('Error parsing mock user data:', error)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [launchId])

  const signIn = () => {
    // Mock sign-in flow
    const mockUser = {
      id: crypto.randomUUID(),
      name: 'Demo User',
      email: 'demo@example.com',
    }
    localStorage.setItem('mock-user', JSON.stringify(mockUser))
    setIsSignedIn(true)
    setUserName(mockUser.name)

    // TODO: Replace with real OAuth flow
    // const session = await account.createOAuth2Session('google',
    //   'http://localhost:3000/auth/callback'
    // )
  }

  const signOut = () => {
    localStorage.removeItem('mock-user')
    setIsSignedIn(false)
    setUserName(null)
    setHasJoined(false)

    // TODO: Replace with real sign-out
    // await account.deleteSession('current')
  }

  const joinLaunch = () => {
    if (!isSignedIn) {
      console.warn('Cannot join launch: user not signed in')
      return
    }

    const joinedLaunches = JSON.parse(localStorage.getItem('joined-launches') || '[]')

    if (!joinedLaunches.includes(launchId)) {
      joinedLaunches.push(launchId)
      localStorage.setItem('joined-launches', JSON.stringify(joinedLaunches))
    }

    setHasJoined(true)

    // TODO: Replace with Appwrite API call
    // await databases.createDocument(
    //   'main',
    //   'launch_joins',
    //   ID.unique(),
    //   {
    //     launchId,
    //     userId: user.id,
    //     joinedAt: new Date().toISOString()
    //   }
    // )
  }

  return {
    isSignedIn,
    hasJoined,
    userName,
    loading,
    signIn,
    signOut,
    joinLaunch,
  }
}
