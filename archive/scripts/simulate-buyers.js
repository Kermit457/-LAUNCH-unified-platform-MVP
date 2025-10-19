require('dotenv').config()

/**
 * Simulate Multiple Buyers for Curve Testing
 *
 * This script creates multiple holder positions to meet launch thresholds:
 * - Minimum 4 holders
 * - Minimum 10 SOL reserve
 */

const CURVE_ID = '68e9bf5600088469cbda' // Your curve ID
const API_BASE = 'http://localhost:3002'

// Simulated buyers
const BUYERS = [
  { userId: 'buyer-alice-001', keys: 20 },
  { userId: 'buyer-bob-002', keys: 30 },
  { userId: 'buyer-charlie-003', keys: 25 }
]

async function simulateBuy(userId, keys) {
  console.log(`\n💰 ${userId} buying ${keys} keys...`)

  try {
    const response = await fetch(`${API_BASE}/api/curve/${CURVE_ID}/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, keys })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Buy failed')
    }

    const data = await response.json()
    console.log(`✅ Success!`)
    console.log(`   • Cost: ${data.solCost.toFixed(4)} SOL`)
    console.log(`   • New price: ${data.curve.price.toFixed(6)} SOL`)
    console.log(`   • Total supply: ${data.curve.supply.toFixed(2)} keys`)
    console.log(`   • Total holders: ${data.curve.holders}`)
    console.log(`   • Reserve: ${data.curve.reserve.toFixed(2)} SOL`)

    return data
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`)
    throw error
  }
}

async function getCurveStats() {
  const response = await fetch(`${API_BASE}/api/curve/${CURVE_ID}`)
  const data = await response.json()
  return data.curve
}

async function main() {
  console.log('🚀 Simulating Multiple Buyers\n')
  console.log('=' .repeat(50))

  // Get initial state
  console.log('\n📊 Initial curve state:')
  const initial = await getCurveStats()
  console.log(`   • Supply: ${initial.supply.toFixed(2)} keys`)
  console.log(`   • Holders: ${initial.holders}`)
  console.log(`   • Reserve: ${initial.reserve.toFixed(2)} SOL`)
  console.log(`   • Price: ${initial.price.toFixed(6)} SOL`)

  console.log('\n' + '=' .repeat(50))
  console.log('💸 Executing buys...\n')

  // Execute all buys
  for (const buyer of BUYERS) {
    await simulateBuy(buyer.userId, buyer.keys)
    await new Promise(resolve => setTimeout(resolve, 500)) // Small delay
  }

  console.log('\n' + '=' .repeat(50))

  // Get final state
  console.log('\n📊 Final curve state:')
  const final = await getCurveStats()
  console.log(`   • Supply: ${final.supply.toFixed(2)} keys`)
  console.log(`   • Holders: ${final.holders}`)
  console.log(`   • Reserve: ${final.reserve.toFixed(2)} SOL`)
  console.log(`   • Price: ${final.price.toFixed(6)} SOL`)

  console.log('\n📈 Changes:')
  console.log(`   • Supply: +${(final.supply - initial.supply).toFixed(2)} keys`)
  console.log(`   • Holders: +${final.holders - initial.holders}`)
  console.log(`   • Reserve: +${(final.reserve - initial.reserve).toFixed(2)} SOL`)
  console.log(`   • Price: ${((final.price / initial.price - 1) * 100).toFixed(2)}%`)

  console.log('\n🎯 Launch Requirements:')
  const meetsSupply = final.supply >= 100
  const meetsHolders = final.holders >= 4
  const meetsReserve = final.reserve >= 10

  console.log(`   • Supply (≥100): ${final.supply.toFixed(2)} ${meetsSupply ? '✅' : '❌'}`)
  console.log(`   • Holders (≥4): ${final.holders} ${meetsHolders ? '✅' : '❌'}`)
  console.log(`   • Reserve (≥10 SOL): ${final.reserve.toFixed(2)} ${meetsReserve ? '✅' : '❌'}`)

  if (meetsSupply && meetsHolders && meetsReserve) {
    console.log('\n🎉 All requirements met! Ready to launch! 🚀')
  } else {
    console.log('\n⚠️  Not ready to launch yet.')
    if (!meetsHolders) {
      console.log(`   Need ${4 - final.holders} more holders`)
    }
    if (!meetsReserve) {
      console.log(`   Need ${(10 - final.reserve).toFixed(2)} more SOL in reserve`)
    }
  }

  console.log('\n' + '=' .repeat(50))
}

main().catch(error => {
  console.error('\n❌ Script failed:', error)
  process.exit(1)
})
