import { usePrivy } from '@privy-io/react-auth'

/**
 * Hook to access current authenticated user from Privy
 */
export function useUser() {
  const { user, ready, authenticated } = usePrivy()

  // Get Twitter account data if linked
  const twitterAccount = user?.linkedAccounts?.find(
    (account: any) => account.type === 'twitter_oauth'
  )

  return {
    user,
    loading: !ready,
    isAuthenticated: authenticated && !!user,
    userId: user?.id,
    email: user?.email?.address,
    name: twitterAccount?.name || user?.email?.address || 'User',
    username: twitterAccount?.username,
    avatar: twitterAccount?.profilePictureUrl,
    twitter: twitterAccount,
  }
}
