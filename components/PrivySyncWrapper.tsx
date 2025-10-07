"use client"

import { useSyncPrivyToAppwrite } from '@/hooks/useSyncPrivyToAppwrite'
import { ReactNode } from 'react'

/**
 * Client component that syncs Privy user data to Appwrite
 */
export function PrivySyncWrapper({ children }: { children: ReactNode }) {
  useSyncPrivyToAppwrite()

  return <>{children}</>
}
