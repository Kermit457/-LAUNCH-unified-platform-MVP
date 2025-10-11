#!/usr/bin/env node

/**
 * Reset Curves Script
 * Deletes all curve-related documents from Appwrite
 */

const { Client, Databases, Query } = require('node-appwrite')
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
  CURVE_HOLDERS: process.env.NEXT_PUBLIC_APPWRITE_CURVE_HOLDERS_COLLECTION_ID,
  SNAPSHOTS: process.env.NEXT_PUBLIC_APPWRITE_SNAPSHOTS_COLLECTION_ID
}

async function deleteAllDocuments(collectionId, collectionName) {
  try {
    console.log(`\n🗑️  Deleting all documents from ${collectionName}...`)

    let hasMore = true
    let deleted = 0

    while (hasMore) {
      const response = await databases.listDocuments(DB_ID, collectionId, [
        Query.limit(100)
      ])

      if (response.documents.length === 0) {
        hasMore = false
        break
      }

      for (const doc of response.documents) {
        await databases.deleteDocument(DB_ID, collectionId, doc.$id)
        deleted++
        process.stdout.write(`\r   Deleted ${deleted} documents...`)
      }
    }

    console.log(`\n   ✅ Deleted ${deleted} documents from ${collectionName}`)
    return deleted
  } catch (error) {
    console.error(`   ❌ Error deleting from ${collectionName}:`, error.message)
    return 0
  }
}

async function resetCurves() {
  console.log('🚀 Starting Curve Reset...\n')
  console.log('Database:', DB_ID)
  console.log('---')

  let totalDeleted = 0

  // Delete in order (child documents first)
  totalDeleted += await deleteAllDocuments(COLLECTIONS.CURVE_EVENTS, 'curve_events')
  totalDeleted += await deleteAllDocuments(COLLECTIONS.CURVE_HOLDERS, 'curve_holders')
  totalDeleted += await deleteAllDocuments(COLLECTIONS.SNAPSHOTS, 'snapshots')
  totalDeleted += await deleteAllDocuments(COLLECTIONS.CURVES, 'curves')

  console.log('\n---')
  console.log(`\n✅ Reset Complete!`)
  console.log(`   Total documents deleted: ${totalDeleted}`)
  console.log('\n💡 You can now run "node scripts/seed-curves.js" to create fresh test data\n')
}

resetCurves().catch(console.error)
