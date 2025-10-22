/**
 * Community Stats Service
 * Aggregates user profile roles for Community Composition widget
 */

import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export interface CommunityStats {
  traders: number
  advisors: number
  vcs: number
  believers: number
  cultists: number
  contributors: number
  developers: number
  incubators: number
  scouts: number
  influencers: number
  builders: number
  marketers: number
  kols: number
  founders: number
  rizzers: number
  degens: number
  total: number
}

/**
 * Get community composition by aggregating user roles
 * Based on user profile metadata (role field or tags)
 */
export async function getCommunityStats(): Promise<CommunityStats> {
  try {
    // Fetch all users (or use a cached/pre-computed version)
    const usersResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.USERS,
      [Query.limit(5000)] // Adjust based on user count
    )

    const users = usersResponse.documents as any[]

    // Count by role
    const stats: CommunityStats = {
      traders: 0,
      advisors: 0,
      vcs: 0,
      believers: 0,
      cultists: 0,
      contributors: 0,
      developers: 0,
      incubators: 0,
      scouts: 0,
      influencers: 0,
      builders: 0,
      marketers: 0,
      kols: 0,
      founders: 0,
      rizzers: 0,
      degens: 0,
      total: users.length
    }

    for (const user of users) {
      // Check if user has a 'role' field or 'tags' array
      const role = user.role?.toLowerCase() || ''
      const tags = (user.tags || []).map((t: string) => t.toLowerCase())

      // Match roles (case-insensitive)
      if (role.includes('trader') || tags.includes('trader')) {
        stats.traders++
      } else if (role.includes('advisor') || tags.includes('advisor')) {
        stats.advisors++
      } else if (role.includes('vc') || tags.includes('vc')) {
        stats.vcs++
      } else if (role.includes('believer') || tags.includes('believer')) {
        stats.believers++
      } else if (role.includes('cultist') || tags.includes('cultist')) {
        stats.cultists++
      } else if (role.includes('contributor') || tags.includes('contributor')) {
        stats.contributors++
      } else if (role.includes('developer') || tags.includes('developer')) {
        stats.developers++
      } else if (role.includes('incubator') || tags.includes('incubator')) {
        stats.incubators++
      } else if (role.includes('scout') || tags.includes('scout')) {
        stats.scouts++
      } else if (role.includes('influencer') || tags.includes('influencer')) {
        stats.influencers++
      } else if (role.includes('builder') || tags.includes('builder')) {
        stats.builders++
      } else if (role.includes('marketer') || tags.includes('marketer')) {
        stats.marketers++
      } else if (role.includes('kol') || tags.includes('kol')) {
        stats.kols++
      } else if (role.includes('founder') || tags.includes('founder')) {
        stats.founders++
      } else if (role.includes('rizzer') || tags.includes('rizzer')) {
        stats.rizzers++
      } else if (role.includes('degen') || tags.includes('degen')) {
        stats.degens++
      } else {
        // Default to believer if no specific role
        stats.believers++
      }
    }

    return stats
  } catch (error) {
    console.error('Error fetching community stats:', error)

    // Return safe defaults on error
    return {
      traders: 0,
      advisors: 0,
      vcs: 0,
      believers: 0,
      cultists: 0,
      contributors: 0,
      developers: 0,
      incubators: 0,
      scouts: 0,
      influencers: 0,
      builders: 0,
      marketers: 0,
      kols: 0,
      founders: 0,
      rizzers: 0,
      degens: 0,
      total: 0
    }
  }
}

/**
 * Get mock community stats for demo purposes
 * TODO: Replace with real data once user profiles have role field
 */
export function getMockCommunityStats(): CommunityStats {
  return {
    traders: 324,
    advisors: 87,
    vcs: 58,
    believers: 412,
    cultists: 156,
    contributors: 203,
    developers: 198,
    incubators: 42,
    scouts: 73,
    influencers: 129,
    builders: 312,
    marketers: 94,
    kols: 61,
    founders: 184,
    rizzers: 147,
    degens: 289,
    total: 2769
  }
}
