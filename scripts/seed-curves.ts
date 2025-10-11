/**
 * Seed Script: Create bonding curves for all existing projects and users
 *
 * This script creates bonding curves in Appwrite for:
 * - All existing projects (launches)
 * - All existing users
 *
 * Run with: npx tsx scripts/seed-curves.ts
 */

import 'dotenv/config'
import { Client, Databases, Query } from 'node-appwrite'

// Appwrite configuration
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY!
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!

// Collection IDs
const LAUNCHES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID!
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!
const CURVES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CURVES_COLLECTION_ID!

// Initialize Appwrite client with API key for admin access
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY)

const databases = new Databases(client)

// Bonding curve configuration
const INITIAL_PRICE = 0.01 // 0.01 SOL
const INITIAL_SUPPLY = 0
const INITIAL_RESERVE = 0

interface CurveData {
  ownerType: 'project' | 'user'
  ownerId: string
  ownerName: string
  supply: number
  price: number
  reserve: number
  holders: number
  volume24h: number
  transactions: number
}

async function createCurve(data: CurveData): Promise<void> {
  try {
    // Check if curve already exists
    const existing = await databases.listDocuments(
      DATABASE_ID,
      CURVES_COLLECTION_ID,
      [
        Query.equal('ownerType', data.ownerType),
        Query.equal('ownerId', data.ownerId),
        Query.limit(1)
      ]
    )

    if (existing.documents.length > 0) {
      console.log(`  ⏭️  Curve already exists for ${data.ownerType}: ${data.ownerName}`)
      return
    }

    // Create new curve
    await databases.createDocument(
      DATABASE_ID,
      CURVES_COLLECTION_ID,
      'unique()',
      {
        ownerType: data.ownerType,
        ownerId: data.ownerId,
        state: 'active',
        supply: data.supply,
        price: data.price,
        reserve: data.reserve,
        holders: data.holders,
        createdAt: new Date().toISOString()
      }
    )

    console.log(`  ✅ Created curve for ${data.ownerType}: ${data.ownerName}`)
  } catch (error: any) {
    console.error(`  ❌ Failed to create curve for ${data.ownerType}: ${data.ownerName}`)
    console.error(`     Error: ${error.message}`)
  }
}

async function seedProjectCurves(): Promise<void> {
  console.log('\n📦 Seeding curves for projects...\n')

  try {
    // Fetch all projects/launches
    let allProjects: any[] = []
    let offset = 0
    const limit = 100

    while (true) {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LAUNCHES_COLLECTION_ID,
        [
          Query.limit(limit),
          Query.offset(offset)
        ]
      )

      allProjects = [...allProjects, ...response.documents]

      if (response.documents.length < limit) break
      offset += limit
    }

    console.log(`Found ${allProjects.length} projects\n`)

    // Create curves for each project
    for (const project of allProjects) {
      await createCurve({
        ownerType: 'project',
        ownerId: project.$id,
        ownerName: project.title || project.tokenName || 'Unnamed Project',
        supply: INITIAL_SUPPLY,
        price: INITIAL_PRICE,
        reserve: INITIAL_RESERVE,
        holders: 0,
        volume24h: 0,
        transactions: 0
      })
    }

    console.log(`\n✨ Completed seeding ${allProjects.length} project curves`)
  } catch (error: any) {
    console.error('Failed to seed project curves:', error.message)
    throw error
  }
}

async function seedUserCurves(): Promise<void> {
  console.log('\n👥 Seeding curves for users...\n')

  try {
    // Fetch all users
    let allUsers: any[] = []
    let offset = 0
    const limit = 100

    while (true) {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [
          Query.limit(limit),
          Query.offset(offset)
        ]
      )

      allUsers = [...allUsers, ...response.documents]

      if (response.documents.length < limit) break
      offset += limit
    }

    console.log(`Found ${allUsers.length} users\n`)

    // Create curves for each user
    for (const user of allUsers) {
      await createCurve({
        ownerType: 'user',
        ownerId: user.userId || user.$id,
        ownerName: user.displayName || user.username || 'Anonymous',
        supply: INITIAL_SUPPLY,
        price: INITIAL_PRICE,
        reserve: INITIAL_RESERVE,
        holders: 0,
        volume24h: 0,
        transactions: 0
      })
    }

    console.log(`\n✨ Completed seeding ${allUsers.length} user curves`)
  } catch (error: any) {
    console.error('Failed to seed user curves:', error.message)
    throw error
  }
}

async function main() {
  console.log('🚀 Starting curve seeding script...')
  console.log(`📍 Endpoint: ${APPWRITE_ENDPOINT}`)
  console.log(`📁 Database: ${DATABASE_ID}`)
  console.log(`💰 Initial price: ${INITIAL_PRICE} SOL`)

  try {
    await seedProjectCurves()
    await seedUserCurves()

    console.log('\n🎉 All curves seeded successfully!')
    console.log('\n💡 Tip: Curves are created with:')
    console.log(`   - Initial price: ${INITIAL_PRICE} SOL`)
    console.log(`   - Initial supply: ${INITIAL_SUPPLY} keys`)
    console.log(`   - Initial reserve: ${INITIAL_RESERVE} SOL`)
    console.log(`   - Holders: 0`)
    console.log(`   - Volume 24h: 0`)
    console.log(`   - Transactions: 0`)
  } catch (error: any) {
    console.error('\n❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

// Run the script
main()
