import { ID, Query } from 'appwrite'
import { appwriteClient } from '../client'
import type { RewardsPool } from '@/types/referral'

const { database, rewardsPoolsCollectionId } = appwriteClient

export class RewardsPoolService {
  /**
   * Create a new rewards pool
   */
  static async createPool(
    pool: Omit<RewardsPool, 'id' | 'createdAt' | 'lastUpdated'>
  ): Promise<RewardsPool> {
    try {
      const document = await database.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        rewardsPoolsCollectionId,
        ID.unique(),
        {
          ...pool,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      )
      return document as unknown as RewardsPool
    } catch (error) {
      console.error('Error creating rewards pool:', error)
      throw error
    }
  }

  /**
   * Get pool by ID
   */
  static async getPoolById(poolId: string): Promise<RewardsPool | null> {
    try {
      const document = await database.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        rewardsPoolsCollectionId,
        poolId
      )
      return document as unknown as RewardsPool
    } catch (error) {
      console.error('Error fetching pool:', error)
      return null
    }
  }

  /**
   * Get or create the main rewards pool
   */
  static async getMainPool(): Promise<RewardsPool> {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        rewardsPoolsCollectionId,
        [
          Query.equal('type', 'main'),
          Query.limit(1)
        ]
      )

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as RewardsPool
      }

      // Create main pool if it doesn't exist
      return await this.createPool({
        type: 'main',
        balance: 0,
        totalDeposited: 0,
        totalDistributed: 0,
        totalContributors: 0,
        metadata: {
          description: 'Main rewards pool for unclaimed referral fees',
          createdBy: 'system'
        }
      })
    } catch (error) {
      console.error('Error getting main pool:', error)
      throw error
    }
  }

  /**
   * Get project-specific pool
   */
  static async getProjectPool(projectId: string): Promise<RewardsPool | null> {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        rewardsPoolsCollectionId,
        [
          Query.equal('type', 'project'),
          Query.equal('projectId', projectId),
          Query.limit(1)
        ]
      )

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as RewardsPool
      }

      return null
    } catch (error) {
      console.error('Error getting project pool:', error)
      return null
    }
  }

  /**
   * Create or get project pool
   */
  static async getOrCreateProjectPool(
    projectId: string,
    projectName?: string
  ): Promise<RewardsPool> {
    try {
      const existingPool = await this.getProjectPool(projectId)
      if (existingPool) return existingPool

      return await this.createPool({
        type: 'project',
        projectId,
        balance: 0,
        totalDeposited: 0,
        totalDistributed: 0,
        totalContributors: 0,
        metadata: {
          projectName: projectName || projectId,
          description: `Rewards pool for project ${projectId}`
        }
      })
    } catch (error) {
      console.error('Error creating project pool:', error)
      throw error
    }
  }

  /**
   * Add funds to a pool (e.g., from unclaimed referral fees)
   */
  static async addToPool(
    poolId: string,
    amount: number,
    contributorId?: string
  ): Promise<RewardsPool | null> {
    try {
      const pool = await this.getPoolById(poolId)
      if (!pool) {
        console.error('Pool not found')
        return null
      }

      const updatedPool = await database.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        rewardsPoolsCollectionId,
        poolId,
        {
          balance: pool.balance + amount,
          totalDeposited: pool.totalDeposited + amount,
          totalContributors: contributorId ? pool.totalContributors + 1 : pool.totalContributors,
          lastUpdated: new Date().toISOString()
        }
      )

      return updatedPool as unknown as RewardsPool
    } catch (error) {
      console.error('Error adding to pool:', error)
      return null
    }
  }

  /**
   * Distribute funds from a pool
   */
  static async distributeFromPool(
    poolId: string,
    amount: number,
    recipientId: string,
    reason?: string
  ): Promise<RewardsPool | null> {
    try {
      const pool = await this.getPoolById(poolId)
      if (!pool) {
        console.error('Pool not found')
        return null
      }

      if (pool.balance < amount) {
        console.error('Insufficient pool balance')
        return null
      }

      const updatedPool = await database.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        rewardsPoolsCollectionId,
        poolId,
        {
          balance: pool.balance - amount,
          totalDistributed: pool.totalDistributed + amount,
          lastUpdated: new Date().toISOString()
        }
      )

      // Log the distribution (you might want to store this in a separate collection)
      console.log(`Distributed ${amount} from pool ${poolId} to ${recipientId}. Reason: ${reason}`)

      return updatedPool as unknown as RewardsPool
    } catch (error) {
      console.error('Error distributing from pool:', error)
      return null
    }
  }

  /**
   * Get all active pools
   */
  static async getAllPools(
    limit = 100,
    offset = 0
  ): Promise<RewardsPool[]> {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        rewardsPoolsCollectionId,
        [
          Query.orderDesc('balance'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )
      return response.documents as unknown as RewardsPool[]
    } catch (error) {
      console.error('Error fetching all pools:', error)
      return []
    }
  }

  /**
   * Get pools with balance above threshold
   */
  static async getPoolsWithBalance(
    minBalance: number
  ): Promise<RewardsPool[]> {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        rewardsPoolsCollectionId,
        [
          Query.greaterThan('balance', minBalance),
          Query.orderDesc('balance')
        ]
      )
      return response.documents as unknown as RewardsPool[]
    } catch (error) {
      console.error('Error fetching pools with balance:', error)
      return []
    }
  }

  /**
   * Get pool statistics
   */
  static async getPoolStats(poolId: string): Promise<{
    balance: number
    totalDeposited: number
    totalDistributed: number
    distributionRate: number
    averageDistribution: number
  } | null> {
    try {
      const pool = await this.getPoolById(poolId)
      if (!pool) return null

      const distributionRate = pool.totalDeposited > 0
        ? (pool.totalDistributed / pool.totalDeposited) * 100
        : 0

      const averageDistribution = pool.totalContributors > 0
        ? pool.totalDistributed / pool.totalContributors
        : 0

      return {
        balance: pool.balance,
        totalDeposited: pool.totalDeposited,
        totalDistributed: pool.totalDistributed,
        distributionRate,
        averageDistribution
      }
    } catch (error) {
      console.error('Error getting pool stats:', error)
      return null
    }
  }

  /**
   * Get global pool statistics
   */
  static async getGlobalPoolStats(): Promise<{
    totalPools: number
    totalBalance: number
    totalDeposited: number
    totalDistributed: number
    largestPool: RewardsPool | null
  }> {
    try {
      const pools = await this.getAllPools(1000, 0)

      const totalBalance = pools.reduce((sum, p) => sum + p.balance, 0)
      const totalDeposited = pools.reduce((sum, p) => sum + p.totalDeposited, 0)
      const totalDistributed = pools.reduce((sum, p) => sum + p.totalDistributed, 0)
      const largestPool = pools.length > 0 ? pools[0] : null

      return {
        totalPools: pools.length,
        totalBalance,
        totalDeposited,
        totalDistributed,
        largestPool
      }
    } catch (error) {
      console.error('Error getting global pool stats:', error)
      return {
        totalPools: 0,
        totalBalance: 0,
        totalDeposited: 0,
        totalDistributed: 0,
        largestPool: null
      }
    }
  }

  /**
   * Transfer funds between pools
   */
  static async transferBetweenPools(
    fromPoolId: string,
    toPoolId: string,
    amount: number
  ): Promise<boolean> {
    try {
      const fromPool = await this.getPoolById(fromPoolId)
      const toPool = await this.getPoolById(toPoolId)

      if (!fromPool || !toPool) {
        console.error('One or both pools not found')
        return false
      }

      if (fromPool.balance < amount) {
        console.error('Insufficient balance in source pool')
        return false
      }

      // Update both pools atomically (in production, use transactions)
      await database.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        rewardsPoolsCollectionId,
        fromPoolId,
        {
          balance: fromPool.balance - amount,
          lastUpdated: new Date().toISOString()
        }
      )

      await database.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        rewardsPoolsCollectionId,
        toPoolId,
        {
          balance: toPool.balance + amount,
          totalDeposited: toPool.totalDeposited + amount,
          lastUpdated: new Date().toISOString()
        }
      )

      return true
    } catch (error) {
      console.error('Error transferring between pools:', error)
      return false
    }
  }
}