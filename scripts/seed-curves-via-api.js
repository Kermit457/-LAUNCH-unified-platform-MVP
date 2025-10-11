#!/usr/bin/env node

/**
 * Seed Curves via API
 * Uses the /api/curve endpoints to create test data
 */

const BASE_URL = 'http://localhost:3000'

const TEST_USERS = [
  { id: 'demo-user-123', name: 'Solidity Dev' },
  { id: 'buyer-alice-001', name: 'Alice' },
  { id: 'buyer-bob-002', name: 'Bob' },
  { id: 'buyer-charlie-003', name: 'Charlie' }
]

const TEST_PROJECTS = [
  { id: 'demo-project-456', name: 'ICM.RUN' }
]

async function createCurve(ownerType, ownerId, ownerName) {
  console.log(`\n📊 Creating curve for ${ownerType}: ${ownerName}`)

  try {
    const response = await fetch(`${BASE_URL}/api/curve/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerType, ownerId })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error(`   ❌ Failed:`, error.error)
      return null
    }

    const data = await response.json()
    console.log(`   ✅ Created curve: ${data.curve.id}`)
    return data.curve
  } catch (error) {
    console.error(`   ❌ Error:`, error.message)
    return null
  }
}

async function buyKeys(curveId, userId, keys, userName) {
  try {
    const response = await fetch(`${BASE_URL}/api/curve/${curveId}/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keys,
        userId
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error(`   ❌ ${userName} buy failed:`, error.error)
      return false
    }

    const data = await response.json()
    console.log(`   ✅ ${userName} bought ${keys} keys (new price: ${data.curve.price.toFixed(4)} SOL)`)
    return true
  } catch (error) {
    console.error(`   ❌ ${userName} error:`, error.message)
    return false
  }
}

async function seedCurves() {
  console.log('🌱 Starting Curve Seeding via API...\n')
  console.log('Make sure your dev server is running on http://localhost:3000')
  console.log('---')

  // Create user curve
  for (const user of [TEST_USERS[0]]) {
    const curve = await createCurve('user', user.id, user.name)
    if (curve) {
      console.log(`\n💸 Simulating trades on ${user.name}'s curve...`)

      // Other users buy
      for (const buyer of TEST_USERS.slice(1)) {
        const keysToBuy = Math.floor(Math.random() * 30) + 20
        await buyKeys(curve.id, buyer.id, keysToBuy, buyer.name)
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  // Create project curve
  for (const project of TEST_PROJECTS) {
    const curve = await createCurve('project', project.id, project.name)
    if (curve) {
      console.log(`\n💸 Simulating trades on ${project.name}'s curve...`)

      // All users buy
      for (const buyer of TEST_USERS) {
        const keysToBuy = Math.floor(Math.random() * 30) + 20
        await buyKeys(curve.id, buyer.id, keysToBuy, buyer.name)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  console.log('\n---')
  console.log('\n✅ Seeding Complete!')
  console.log('\n💡 Visit http://localhost:3000/curve-demo to see the results\n')
}

seedCurves().catch(error => {
  console.error('\n❌ Seeding failed:', error.message)
  process.exit(1)
})
