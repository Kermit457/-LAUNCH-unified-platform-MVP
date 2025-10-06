import { useAuth } from '@/contexts/AuthContext'

/**
 * Hook to access current authenticated user
 */
export function useUser() {
  const { user, loading } = useAuth()

  return {
    user,
    loading,
    isAuthenticated: !!user,
    userId: user?.$id,
    email: user?.email,
    name: user?.name,
  }
}
