import { account } from './client'
import { ID } from 'appwrite'

/**
 * Authenticate with Appwrite using Privy user ID
 * Creates an anonymous session or JWT session for the user
 */
export async function authenticateWithAppwrite(privyUserId: string) {
  try {
    // Check if already has a session
    try {
      const session = await account.getSession('current')
      if (session) {
        console.log('✅ Appwrite session already exists')
        return session
      }
    } catch (error) {
      // No session exists, continue to create one
      console.log('📝 No existing Appwrite session, creating new one...')
    }

    // Create anonymous session (best for Web3/wallet-based auth)
    const session = await account.createAnonymousSession()
    console.log('✅ Created Appwrite anonymous session:', session.$id)
    return session

  } catch (error: any) {
    console.error('❌ Failed to authenticate with Appwrite:', error)
    throw error
  }
}

/**
 * Log out from Appwrite
 */
export async function logoutFromAppwrite() {
  try {
    await account.deleteSession('current')
    console.log('✅ Logged out from Appwrite')
  } catch (error) {
    console.error('❌ Failed to logout from Appwrite:', error)
  }
}

/**
 * Get current Appwrite session
 */
export async function getCurrentAppwriteSession() {
  try {
    return await account.getSession('current')
  } catch (error) {
    return null
  }
}
