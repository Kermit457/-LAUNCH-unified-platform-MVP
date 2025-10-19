#!/usr/bin/env node

/**
 * Seed Curves Script
 * Creates test curves with realistic data
 */

const { Client, Databases, ID } = require('node-appwrite')
require('dotenv').config()

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY)

const databases = new Databases(client)
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

const COLLECTIONS = {
  CURVES: process.env.NEXT_PUBLIC_APPWRITE_CURVES_COLLECTION_ID,
  CURVE_EVENTS: process.env.NEXT_PUBLIC_APPWRITE_CURVE_EVENTS_COLLECTION_ID,
  CURVE_HOLDERS: process.env.NEXT_PUBLIC_APPWRITE_CURVE_HOLDERS_COLLECTION_ID
}

// Test data
const TEST_USERS = [
  {
    id: 'demo-user-123',
    name: 'Solidity Dev',
    handle: '@solidity_dev'
  },
  {
    id: 'buyer-alice-001',
    name: 'Alice',
    handle: '@alice'
  },
  {
    id: 'buyer-bob-002',
    name: 'Bob',
    handle: '@bob'
  },
  {
    id: 'buyer-charlie-003',
    name: 'Charlie',
    handle: '@charlie'
  }
]

const TEST_PROJECTS = [
  {
    id: 'demo-project-456',
    name: 'ICM.RUN',
    description: 'Smart contract auditor | Web3 builder | Security first'
  }
]

async function createCurve(ownerType, ownerId, ownerName) {
  try {
    console.log(`\n📊 Creating curve for ${ownerType}: ${ownerName}`)

    const curve = await databases.createDocument(
      DB_ID,
      COLLECTIONS.CURVES,
      ID.unique(),
      {
        ownerType,
        ownerId,
        state: 'active',
        price: 0.0101, // Starting price after owner owns first key
        reserve: 0,
        supply: 1, // Owner owns first key
        holders: 1,
        createdAt: new Date().toISOString(),
        firstBuyAt: new Date().toISOString() // Owner's first buy
      }
    )

    console.log(`   ✅ Created curve: ${curve.$id}`)

    // Create holder for owner (they own the first key)
    await databases.createDocument(
      DB_ID,
      COLLECTIONS.CURVE_HOLDERS,
      ID.unique(),
      {
        curveId: curve.$id,
        userId: ownerId,
        balance: 1,
        totalCost: 0.0101,
        averagePrice: 0.0101,
        realizedPnL: 0,
        unrealizedPnL: 0
      }
    )

    console.log(`   ✅ Created owner holder record`)

    return curve
  } catch (error) {
    console.error(`   ❌ Error creating curve:`, error.message)
    return null
  }
}

async function simulateTrades(curve, buyers) {
  console.log(`\n💸 Simulating trades on curve: ${curve.$id}`)

  let currentSupply = curve.supply
  let currentPrice = curve.price
  let currentReserve = curve.reserve

  for (const buyer of buyers) {
    try {
      // Each buyer buys between 20-50 keys
      const keysToBuy = Math.floor(Math.random() * 30) + 20

      // Calculate cost (simplified bonding curve math)
      const avgPrice = currentPrice + (keysToBuy * 0.0001 / 2)
      const grossCost = avgPrice * keysToBuy
      const totalCost = grossCost * 1.1 // Include 10% fees

      // Update supply and price
      currentSupply += keysToBuy
      currentPrice = 0.01 + (currentSupply * 0.0001)
      currentReserve += grossCost * 0.94 // 94% goes to reserve

      // Create holder
      await databases.createDocument(
        DB_ID,
        COLLECTIONS.CURVE_HOLDERS,
        ID.unique(),
        {
          curveId: curve.$id,
          userId: buyer.id,
          balance: keysToBuy,
          totalCost: totalCost,
          averagePrice: avgPrice,
          realizedPnL: 0,
          unrealizedPnL: 0
        }
      )

      // Create buy event
      await databases.createDocument(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        ID.unique(),
        {
          curveId: curve.$id,
          type: 'buy',
          userId: buyer.id,
          amount: totalCost,
          price: currentPrice,
          keys: keysToBuy,
          timestamp: new Date().toISOString()
        }
      )

      console.log(`   ✅ ${buyer.name} bought ${keysToBuy} keys`)
    } catch (error) {
      console.error(`   ❌ Error simulating trade for ${buyer.name}:`, error.message)
    }
  }

  // Update curve with final values
  try {
    await databases.updateDocument(
      DB_ID,
      COLLECTIONS.CURVES,
      curve.$id,
      {
        supply: currentSupply,
        price: currentPrice,
        reserve: currentReserve,
        holders: buyers.length + 1 // +1 for owner
      }
    )

    console.log(`   ✅ Updated curve stats`)
    console.log(`      Supply: ${currentSupply.toFixed(0)} keys`)
    console.log(`      Price: ${currentPrice.toFixed(4)} SOL`)
    console.log(`      Reserve: ${currentReserve.toFixed(2)} SOL`)
    console.log(`      Holders: ${buyers.length + 1}`)
  } catch (error) {
    console.error(`   ❌ Error updating curve:`, error.message)
  }
}

async function seedCurves() {
  console.log('🌱 Starting Curve Seeding...\n')
  console.log('Database:', DB_ID)
  console.log('---')

  // Create user curves
  for (const user of [TEST_USERS[0]]) { // Just create for main demo user
    const curve = await createCurve('user', user.id, user.name)
    if (curve) {
      await simulateTrades(curve, TEST_USERS.slice(1)) // Other users buy
    }
  }

  // Create project curves
  for (const project of TEST_PROJECTS) {
    const curve = await createCurve('project', project.id, project.name)
    if (curve) {
      await simulateTrades(curve, TEST_USERS) // All users buy project keys
    }
  }

  console.log('\n---')
  console.log('\n✅ Seeding Complete!')
  console.log('\n💡 Visit http://localhost:3000/curve-demo to see the results\n')
}

seedCurves().catch(console.error)
