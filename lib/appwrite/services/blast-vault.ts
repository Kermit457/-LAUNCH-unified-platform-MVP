/**
 * BLAST Vault Service
 * Key locking, deposits, and refund management
 */

import { ID, Query } from 'appwrite'
import { databases } from '../client'
import { BLAST_DATABASE_ID, BLAST_COLLECTIONS } from '../blast-config'
import { getKeyBalance } from '@/lib/solana/blast/getKeyBalance'
import type { BlastVault, KeyLock, PendingRefund } from '@/lib/types/blast'

const DB_ID = BLAST_DATABASE_ID
const VAULT_COLLECTION = BLAST_COLLECTIONS.VAULT
const LOCKS_COLLECTION = BLAST_COLLECTIONS.KEY_LOCKS

export class BlastVaultService {
  /**
   * Get or create vault for user
   */
  static async getOrCreateVault(
    userId: string,
    walletAddress: string
  ): Promise<BlastVault> {
    try {
      return await databases.getDocument<BlastVault>(
        DB_ID,
        VAULT_COLLECTION,
        userId
      )
    } catch {
      // Vault doesn't exist, create it
      return await databases.createDocument<BlastVault>(
        DB_ID,
        VAULT_COLLECTION,
        userId,
        {
          userId,
          walletAddress,
          totalKeysLocked: 0,
          solBalance: 0,
          usdcBalance: 0,
          pointsBalance: 0,
          fromRooms: 0,
          fromIntros: 0,
          fromReferrals: 0,
          fromCurating: 0,
          pendingRefunds: [],
          updatedAt: new Date().toISOString(),
        }
      )
    }
  }

  /**
   * Lock keys for a room
   */
  static async lockKeysForRoom(
    userId: string,
    walletAddress: string,
    roomId: string,
    amount: number,
    ownerId: string // For on-chain verification
  ): Promise<{ lock: KeyLock; vault: BlastVault }> {
    // 1. Verify on-chain balance
    const onChainBalance = await getKeyBalance(walletAddress, ownerId)

    if (onChainBalance < amount) {
      throw new Error(
        `Insufficient keys. You have ${onChainBalance}, need ${amount}`
      )
    }

    // 2. Get or create vault
    const vault = await this.getOrCreateVault(userId, walletAddress)

    // 3. Check if already locked for this room
    const existingLock = await databases.listDocuments<KeyLock>(
      DB_ID,
      LOCKS_COLLECTION,
      [
        Query.equal('userId', userId),
        Query.equal('roomId', roomId),
        Query.equal('status', 'locked')
      ]
    )

    if (existingLock.total > 0) {
      throw new Error('Keys already locked for this room')
    }

    // 4. Create lock record
    const lock = await databases.createDocument<KeyLock>(
      DB_ID,
      LOCKS_COLLECTION,
      ID.unique(),
      {
        userId,
        roomId,
        amount,
        status: 'locked',
        lockedAt: new Date().toISOString(),
      }
    )

    // 5. Update vault totals
    const updatedVault = await databases.updateDocument<BlastVault>(
      DB_ID,
      VAULT_COLLECTION,
      userId,
      {
        totalKeysLocked: vault.totalKeysLocked + amount,
        updatedAt: new Date().toISOString(),
      }
    )

    return { lock, vault: updatedVault }
  }

  /**
   * Release keys (refund)
   */
  static async releaseKeys(lockId: string): Promise<void> {
    const lock = await databases.getDocument<KeyLock>(
      DB_ID,
      LOCKS_COLLECTION,
      lockId
    )

    if (lock.status !== 'locked') {
      throw new Error('Keys already released or forfeited')
    }

    // Update lock status
    await databases.updateDocument<KeyLock>(
      DB_ID,
      LOCKS_COLLECTION,
      lockId,
      {
        status: 'released',
        unlockedAt: new Date().toISOString(),
      }
    )

    // Update vault totals
    const vault = await databases.getDocument<BlastVault>(
      DB_ID,
      VAULT_COLLECTION,
      lock.userId
    )

    await databases.updateDocument<BlastVault>(
      DB_ID,
      VAULT_COLLECTION,
      lock.userId,
      {
        totalKeysLocked: Math.max(0, vault.totalKeysLocked - lock.amount),
        updatedAt: new Date().toISOString(),
      }
    )
  }

  /**
   * Forfeit keys (no-show penalty)
   */
  static async forfeitKeys(lockId: string): Promise<void> {
    const lock = await databases.getDocument<KeyLock>(
      DB_ID,
      LOCKS_COLLECTION,
      lockId
    )

    if (lock.status !== 'locked') {
      throw new Error('Keys already released or forfeited')
    }

    // Update lock status
    await databases.updateDocument<KeyLock>(
      DB_ID,
      LOCKS_COLLECTION,
      lockId,
      {
        status: 'forfeited',
        unlockedAt: new Date().toISOString(),
      }
    )

    // Update vault totals
    const vault = await databases.getDocument<BlastVault>(
      DB_ID,
      VAULT_COLLECTION,
      lock.userId
    )

    await databases.updateDocument<BlastVault>(
      DB_ID,
      VAULT_COLLECTION,
      lock.userId,
      {
        totalKeysLocked: Math.max(0, vault.totalKeysLocked - lock.amount),
        updatedAt: new Date().toISOString(),
      }
    )

    // Note: Forfeited keys go to vault/curator pools (handled elsewhere)
  }

  /**
   * Get vault status
   */
  static async getVaultStatus(userId: string) {
    const vault = await this.getOrCreateVault(userId, '')

    const activeLocks = await databases.listDocuments<KeyLock>(
      DB_ID,
      LOCKS_COLLECTION,
      [
        Query.equal('userId', userId),
        Query.equal('status', 'locked')
      ]
    )

    return {
      totalLocked: vault.totalKeysLocked,
      activeLocks: activeLocks.documents,
      earnings: {
        sol: vault.solBalance,
        usdc: vault.usdcBalance,
        points: vault.pointsBalance,
      },
      breakdown: {
        fromRooms: vault.fromRooms,
        fromIntros: vault.fromIntros,
        fromReferrals: vault.fromReferrals,
        fromCurating: vault.fromCurating,
      },
      pendingRefunds: vault.pendingRefunds,
    }
  }

  /**
   * Add pending refund
   */
  static async addPendingRefund(
    userId: string,
    refund: PendingRefund
  ): Promise<void> {
    const vault = await databases.getDocument<BlastVault>(
      DB_ID,
      VAULT_COLLECTION,
      userId
    )

    await databases.updateDocument<BlastVault>(
      DB_ID,
      VAULT_COLLECTION,
      userId,
      {
        pendingRefunds: [...vault.pendingRefunds, refund],
        updatedAt: new Date().toISOString(),
      }
    )
  }

  /**
   * Process refund
   */
  static async processRefund(
    userId: string,
    roomId: string
  ): Promise<void> {
    const vault = await databases.getDocument<BlastVault>(
      DB_ID,
      VAULT_COLLECTION,
      userId
    )

    const updatedRefunds = vault.pendingRefunds.filter(
      r => r.roomId !== roomId
    )

    await databases.updateDocument<BlastVault>(
      DB_ID,
      VAULT_COLLECTION,
      userId,
      {
        pendingRefunds: updatedRefunds,
        updatedAt: new Date().toISOString(),
      }
    )
  }

  /**
   * Add earnings
   */
  static async addEarnings(
    userId: string,
    amount: number,
    currency: 'SOL' | 'USDC' | 'points',
    source: 'rooms' | 'intros' | 'referrals' | 'curating'
  ): Promise<void> {
    const vault = await databases.getDocument<BlastVault>(
      DB_ID,
      VAULT_COLLECTION,
      userId
    )

    const updates: Partial<BlastVault> = {
      updatedAt: new Date().toISOString(),
    }

    // Update balance
    if (currency === 'SOL') {
      updates.solBalance = vault.solBalance + amount
    } else if (currency === 'USDC') {
      updates.usdcBalance = vault.usdcBalance + amount
    } else {
      updates.pointsBalance = vault.pointsBalance + amount
    }

    // Update source breakdown
    switch (source) {
      case 'rooms':
        updates.fromRooms = vault.fromRooms + amount
        break
      case 'intros':
        updates.fromIntros = vault.fromIntros + amount
        break
      case 'referrals':
        updates.fromReferrals = vault.fromReferrals + amount
        break
      case 'curating':
        updates.fromCurating = vault.fromCurating + amount
        break
    }

    await databases.updateDocument<BlastVault>(
      DB_ID,
      VAULT_COLLECTION,
      userId,
      updates
    )
  }

  /**
   * Get locks for a room
   */
  static async getLocksForRoom(roomId: string): Promise<KeyLock[]> {
    const response = await databases.listDocuments<KeyLock>(
      DB_ID,
      LOCKS_COLLECTION,
      [
        Query.equal('roomId', roomId),
        Query.equal('status', 'locked')
      ]
    )

    return response.documents
  }

  /**
   * Get user's active locks
   */
  static async getUserActiveLocks(userId: string): Promise<KeyLock[]> {
    const response = await databases.listDocuments<KeyLock>(
      DB_ID,
      LOCKS_COLLECTION,
      [
        Query.equal('userId', userId),
        Query.equal('status', 'locked'),
        Query.orderDesc('lockedAt')
      ]
    )

    return response.documents
  }
}
