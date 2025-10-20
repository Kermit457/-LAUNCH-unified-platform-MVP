/**
 * Environment Configuration
 * Centralized environment variables with runtime validation
 */

/** Invariant guard - throws if condition is false */
function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[ENV] ${message}`)
  }
}

/** Environment variable getter with validation */
function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback

  // Only validate in server-side or when value should be present
  if (typeof window === 'undefined') {
    invariant(value, `Missing required environment variable: ${key}`)
  }

  return value || fallback || ''
}

/** Optional environment variable getter */
function getOptionalEnvVar(key: string, fallback?: string): string | undefined {
  return process.env[key] || fallback
}

/**
 * Environment Configuration
 * All environment variables are validated at import time
 */
export const ENV = {
  /** Node environment */
  NODE_ENV: process.env.NODE_ENV || 'development',

  /** Is production */
  IS_PRODUCTION: process.env.NODE_ENV === 'production',

  /** Is development */
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',

  /** Appwrite */
  appwrite: {
    endpoint: getEnvVar('NEXT_PUBLIC_APPWRITE_ENDPOINT'),
    projectId: getEnvVar('NEXT_PUBLIC_APPWRITE_PROJECT_ID'),
    databaseId: getEnvVar('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
    apiKey: getOptionalEnvVar('APPWRITE_API_KEY'),
  },

  /** Privy */
  privy: {
    appId: getEnvVar('NEXT_PUBLIC_PRIVY_APP_ID'),
    appSecret: getOptionalEnvVar('PRIVY_APP_SECRET'),
  },

  /** Solana */
  solana: {
    network: getEnvVar('NEXT_PUBLIC_SOLANA_NETWORK', 'devnet'),
    rpc: getEnvVar('NEXT_PUBLIC_SOLANA_RPC', 'https://api.devnet.solana.com'),
    programId: getOptionalEnvVar('NEXT_PUBLIC_CURVE_PROGRAM_ID'),
  },

  /** Feature flags */
  features: {
    enableLive: getOptionalEnvVar('NEXT_PUBLIC_ENABLE_LIVE', 'true') === 'true',
    enableEarn: getOptionalEnvVar('NEXT_PUBLIC_ENABLE_EARN', 'true') === 'true',
    enableNetwork: getOptionalEnvVar('NEXT_PUBLIC_ENABLE_NETWORK', 'true') === 'true',
  },

  /** URLs */
  urls: {
    base: getOptionalEnvVar('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000'),
    staging: getOptionalEnvVar('NEXT_PUBLIC_STAGING_URL'),
  },
} as const

/** Type-safe environment access */
export type Env = typeof ENV
