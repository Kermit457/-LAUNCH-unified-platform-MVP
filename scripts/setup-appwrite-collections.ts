/**
 * Appwrite Collections Setup Script
 *
 * Run this script to create all necessary Appwrite collections
 * for the EnhancedLaunchCard feature wiring.
 *
 * Usage:
 *   npx tsx scripts/setup-appwrite-collections.ts
 */

import { Client, Databases, ID } from 'node-appwrite'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// ============================================================================
// LOAD ENVIRONMENT VARIABLES
// ============================================================================

// Try loading .env.local first, then .env
const envLocalPath = path.resolve(process.cwd(), '.env.local')
const envPath = path.resolve(process.cwd(), '.env')

if (fs.existsSync(envLocalPath)) {
  console.log('Loading environment from .env.local')
  dotenv.config({ path: envLocalPath })
} else if (fs.existsSync(envPath)) {
  console.log('Loading environment from .env')
  dotenv.config({ path: envPath })
} else {
  console.log('No .env file found, using environment variables')
}

// ============================================================================
// CONFIGURATION - Update these with your Appwrite credentials
// ============================================================================

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''
const API_KEY = process.env.APPWRITE_API_KEY || '' // Server API key with full permissions
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ''

// ============================================================================
// INITIALIZE CLIENT
// ============================================================================

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY)

const databases = new Databases(client)

// ============================================================================
// COLLECTION SCHEMAS
// ============================================================================

const collections = [
  {
    id: 'user_holdings',
    name: 'User Holdings',
    permissions: ['read("any")', 'write("users")'],
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'launchId', type: 'string', size: 255, required: true },
      { key: 'balance', type: 'double', required: true, min: 0 },
      { key: 'sharePercent', type: 'double', required: true, min: 0, max: 100 },
      { key: 'totalInvested', type: 'double', required: true, min: 0 },
    ],
    indexes: [
      { key: 'userId_idx', type: 'key', attributes: ['userId'] },
      { key: 'launchId_idx', type: 'key', attributes: ['launchId'] },
      { key: 'userId_launchId_idx', type: 'unique', attributes: ['userId', 'launchId'] },
    ],
  },
  {
    id: 'user_notifications',
    name: 'User Notification Preferences',
    permissions: ['read("any")', 'write("users")'],
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'launchId', type: 'string', size: 255, required: true },
      { key: 'enabled', type: 'boolean', required: false, default: false },
      { key: 'channels', type: 'string', size: 1000, required: true, array: true },
      { key: 'createdAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'userId_idx', type: 'key', attributes: ['userId'] },
      { key: 'launchId_idx', type: 'key', attributes: ['launchId'] },
      { key: 'userId_launchId_idx', type: 'unique', attributes: ['userId', 'launchId'] },
    ],
  },
  {
    id: 'share_analytics',
    name: 'Share Analytics',
    permissions: ['read("any")', 'create("users")'],
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'launchId', type: 'string', size: 255, required: true },
      { key: 'shareMethod', type: 'string', size: 50, required: true },
      { key: 'sharedAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'userId_idx', type: 'key', attributes: ['userId'] },
      { key: 'launchId_idx', type: 'key', attributes: ['launchId'] },
      { key: 'sharedAt_idx', type: 'key', attributes: ['sharedAt'], orders: ['DESC'] },
    ],
  },
  {
    id: 'airdrops',
    name: 'Airdrops',
    permissions: ['read("any")', 'write("users")'],
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'launchId', type: 'string', size: 255, required: true },
      { key: 'amount', type: 'double', required: true, min: 0 },
      { key: 'proof', type: 'string', size: 10000, required: true, array: true },
      { key: 'claimed', type: 'boolean', required: false, default: false },
      { key: 'claimedAt', type: 'datetime', required: false },
    ],
    indexes: [
      { key: 'userId_idx', type: 'key', attributes: ['userId'] },
      { key: 'launchId_idx', type: 'key', attributes: ['launchId'] },
      { key: 'userId_launchId_idx', type: 'unique', attributes: ['userId', 'launchId'] },
      { key: 'claimed_idx', type: 'key', attributes: ['claimed'] },
    ],
  },
  {
    id: 'airdrop_claims',
    name: 'Airdrop Claims',
    permissions: ['read("any")', 'create("users")'],
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'launchId', type: 'string', size: 255, required: true },
      { key: 'claimedAt', type: 'datetime', required: true },
      { key: 'txSignature', type: 'string', size: 500, required: true },
    ],
    indexes: [
      { key: 'userId_idx', type: 'key', attributes: ['userId'] },
      { key: 'launchId_idx', type: 'key', attributes: ['launchId'] },
      { key: 'txSignature_idx', type: 'unique', attributes: ['txSignature'] },
    ],
  },
  {
    id: 'launch_contributors',
    name: 'Launch Contributors',
    permissions: ['read("any")', 'write("users")'],
    attributes: [
      { key: 'launchId', type: 'string', size: 255, required: true },
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'avatar', type: 'string', size: 1000, required: false },
      { key: 'role', type: 'string', size: 100, required: true },
      { key: 'addedAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'launchId_idx', type: 'key', attributes: ['launchId'] },
      { key: 'userId_idx', type: 'key', attributes: ['userId'] },
      { key: 'launchId_userId_idx', type: 'unique', attributes: ['launchId', 'userId'] },
    ],
  },
  {
    id: 'price_snapshots',
    name: 'Price Snapshots',
    permissions: ['read("any")', 'create("users")'],
    attributes: [
      { key: 'launchId', type: 'string', size: 255, required: true },
      { key: 'price', type: 'double', required: true, min: 0 },
      { key: 'volume24h', type: 'double', required: false, min: 0 },
      { key: 'timestamp', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'launchId_idx', type: 'key', attributes: ['launchId'] },
      { key: 'timestamp_idx', type: 'key', attributes: ['timestamp'], orders: ['DESC'] },
      { key: 'launchId_timestamp_idx', type: 'key', attributes: ['launchId', 'timestamp'] },
    ],
  },
  {
    id: 'twitter_clicks',
    name: 'Twitter Click Analytics',
    permissions: ['read("any")', 'create("users")'],
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'launchId', type: 'string', size: 255, required: true },
      { key: 'twitterUrl', type: 'string', size: 1000, required: true },
      { key: 'clickedAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'userId_idx', type: 'key', attributes: ['userId'] },
      { key: 'launchId_idx', type: 'key', attributes: ['launchId'] },
      { key: 'clickedAt_idx', type: 'key', attributes: ['clickedAt'], orders: ['DESC'] },
    ],
  },
  {
    id: 'collaboration_requests',
    name: 'Collaboration Requests',
    permissions: ['read("any")', 'create("users")'],
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'launchId', type: 'string', size: 255, required: true },
      { key: 'message', type: 'string', size: 5000, required: true },
      { key: 'skills', type: 'string', size: 1000, required: true, array: true },
      { key: 'status', type: 'string', size: 50, required: true },
      { key: 'createdAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'userId_idx', type: 'key', attributes: ['userId'] },
      { key: 'launchId_idx', type: 'key', attributes: ['launchId'] },
      { key: 'status_idx', type: 'key', attributes: ['status'] },
      { key: 'createdAt_idx', type: 'key', attributes: ['createdAt'], orders: ['DESC'] },
    ],
  },
]

// ============================================================================
// SETUP FUNCTIONS
// ============================================================================

async function createCollection(schema: any) {
  try {
    console.log(`Creating collection: ${schema.name}...`)

    // Create collection
    const collection = await databases.createCollection(
      DATABASE_ID,
      schema.id,
      schema.name,
      schema.permissions
    )

    console.log(`✓ Collection created: ${schema.name}`)

    // Create attributes
    for (const attr of schema.attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            schema.id,
            attr.key,
            attr.size,
            attr.required,
            attr.default,
            attr.array || false
          )
        } else if (attr.type === 'double') {
          await databases.createFloatAttribute(
            DATABASE_ID,
            schema.id,
            attr.key,
            attr.required,
            attr.min,
            attr.max,
            attr.default
          )
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            schema.id,
            attr.key,
            attr.required,
            attr.default
          )
        } else if (attr.type === 'datetime') {
          await databases.createDatetimeAttribute(
            DATABASE_ID,
            schema.id,
            attr.key,
            attr.required,
            attr.default
          )
        }

        console.log(`  ✓ Attribute created: ${attr.key}`)

        // Wait to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`  ⚠ Attribute already exists: ${attr.key}`)
        } else {
          throw error
        }
      }
    }

    // Create indexes
    for (const index of schema.indexes) {
      try {
        await databases.createIndex(
          DATABASE_ID,
          schema.id,
          index.key,
          index.type,
          index.attributes,
          index.orders
        )

        console.log(`  ✓ Index created: ${index.key}`)

        // Wait to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`  ⚠ Index already exists: ${index.key}`)
        } else {
          throw error
        }
      }
    }

    console.log(`✓ Collection setup complete: ${schema.name}\n`)
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`⚠ Collection already exists: ${schema.name}\n`)
    } else {
      console.error(`✗ Error creating collection ${schema.name}:`, error)
      throw error
    }
  }
}

async function setupAllCollections() {
  console.log('Starting Appwrite collections setup...\n')

  for (const schema of collections) {
    await createCollection(schema)
  }

  console.log('✓ All collections setup complete!')
}

// ============================================================================
// RUN SETUP
// ============================================================================

if (!PROJECT_ID || !API_KEY || !DATABASE_ID) {
  console.error('Error: Missing required environment variables')
  console.error('Required: NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY, NEXT_PUBLIC_APPWRITE_DATABASE_ID')
  process.exit(1)
}

setupAllCollections().catch((error) => {
  console.error('Setup failed:', error)
  process.exit(1)
})
