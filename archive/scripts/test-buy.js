#!/usr/bin/env node

/**
 * Test Buy Script - Debug curve buying
 */

const BASE_URL = 'http://localhost:3000'

async function testBuy() {
  console.log('🔍 Testing Curve System...\n')

  // Step 1: Get Solidity Dev's curve
  console.log('1. Fetching Solidity Dev curve...')
  const userRes = await fetch(`${BASE_URL}/api/curve/owner?ownerType=user&ownerId=demo-user-123`)
  const userData = await userRes.json()
  console.log('   User curve:', JSON.stringify(userData, null, 2))

  // Step 2: Get ICM.RUN curve
  console.log('\n2. Fetching ICM.RUN curve...')
  const projectRes = await fetch(`${BASE_URL}/api/curve/owner?ownerType=project&ownerId=demo-project-456`)
  const projectData = await projectRes.json()
  console.log('   Project curve:', JSON.stringify(projectData, null, 2))

  // Step 3: Try buying on user curve
  if (userData.curve) {
    console.log(`\n3. Attempting to buy 10 keys on Solidity Dev's curve (ID: ${userData.curve.id})...`)
    const buyRes = await fetch(`${BASE_URL}/api/curve/${userData.curve.id}/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keys: 10,
        userId: 'buyer-alice-001'
      })
    })

    const buyData = await buyRes.json()
    console.log('   Buy response:', JSON.stringify(buyData, null, 2))

    if (buyRes.ok) {
      console.log('   ✅ Buy successful!')
    } else {
      console.log('   ❌ Buy failed:', buyData.error)
    }
  }

  // Step 4: Try buying on project curve
  if (projectData.curve) {
    console.log(`\n4. Attempting to buy 10 keys on ICM.RUN curve (ID: ${projectData.curve.id})...`)
    const buyRes = await fetch(`${BASE_URL}/api/curve/${projectData.curve.id}/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keys: 10,
        userId: 'buyer-alice-001'
      })
    })

    const buyData = await buyRes.json()
    console.log('   Buy response:', JSON.stringify(buyData, null, 2))

    if (buyRes.ok) {
      console.log('   ✅ Buy successful!')
    } else {
      console.log('   ❌ Buy failed:', buyData.error)
    }
  }

  console.log('\n✅ Test complete! Check the output above for any errors.')
}

testBuy().catch(err => {
  console.error('\n❌ Test failed:', err.message)
  process.exit(1)
})
