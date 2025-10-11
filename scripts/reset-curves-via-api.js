#!/usr/bin/env node

/**
 * Reset Curves via API
 * Deletes curves by fetching them first
 */

const BASE_URL = 'http://localhost:3000'

const OWNERS = [
  { type: 'user', id: 'demo-user-123', name: 'Solidity Dev' },
  { type: 'project', id: 'demo-project-456', name: 'ICM.RUN' }
]

async function deleteCurveByOwner(ownerType, ownerId, ownerName) {
  console.log(`\n🔍 Looking for ${ownerType} curve: ${ownerName}`)

  try {
    // First, get the curve ID
    const getResponse = await fetch(`${BASE_URL}/api/curve/owner?ownerType=${ownerType}&ownerId=${ownerId}`)

    if (!getResponse.ok) {
      console.log(`   ℹ️  No curve found (this is OK)`)
      return
    }

    const getData = await getResponse.json()

    if (!getData.curve) {
      console.log(`   ℹ️  No curve found (this is OK)`)
      return
    }

    const curveId = getData.curve.id
    console.log(`   📊 Found curve: ${curveId}`)

    // Note: We don't have a delete endpoint, so we'll need to use Appwrite directly
    console.log(`   ⚠️  Cannot delete via API (no delete endpoint exists)`)
    console.log(`   💡 Use the Appwrite console to manually delete, or keep using existing curves`)

  } catch (error) {
    console.error(`   ❌ Error:`, error.message)
  }
}

async function resetCurves() {
  console.log('🔄 Checking for existing curves...\n')
  console.log('Make sure your dev server is running on http://localhost:3000')
  console.log('---')

  for (const owner of OWNERS) {
    await deleteCurveByOwner(owner.type, owner.id, owner.name)
  }

  console.log('\n---')
  console.log('\n💡 Tip: The curves already exist, which is fine!')
  console.log('   You can either:')
  console.log('   1. Use the Appwrite console to delete curves collection documents')
  console.log('   2. Or just use the existing curves and run more buy transactions\n')
}

resetCurves().catch(error => {
  console.error('\n❌ Reset check failed:', error.message)
  process.exit(1)
})
