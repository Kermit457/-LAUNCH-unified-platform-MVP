/**
 * BLAST Appwrite Collections Setup Script
 *
 * This script automatically creates all 11 BLAST collections with:
 * - Attributes
 * - Indexes
 * - Permissions
 *
 * Usage:
 * node scripts/setup-blast-collections.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { Client, Databases, ID, Permission, Role } = require('node-appwrite')

// Configuration from environment
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY // Server-side API key
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'blast-network'

if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_APPWRITE_PROJECT_ID')
  console.error('   APPWRITE_API_KEY (get from Appwrite Console > Settings > API Keys)')
  process.exit(1)
}

// Initialize Appwrite
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY)

const databases = new Databases(client)

// Collection schemas
const collections = [
  {
    name: 'blast_rooms',
    id: 'blast_rooms',
    attributes: [
      { key: 'type', type: 'string', size: 20, required: true },
      { key: 'title', type: 'string', size: 100, required: true },
      { key: 'description', type: 'string', size: 2000, required: true },
      { key: 'creatorId', type: 'string', size: 50, required: true },
      { key: 'creatorName', type: 'string', size: 100, required: true },
      { key: 'creatorAvatar', type: 'string', size: 500, required: false },
      { key: 'creatorMotionScore', type: 'integer', required: false, default: 0 },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'duration', type: 'string', size: 20, required: true },
      { key: 'minKeys', type: 'integer', required: false, default: 0 },
      { key: 'maxSlots', type: 'integer', required: false },
      { key: 'filledSlots', type: 'integer', required: false, default: 0 },
      { key: 'totalSlots', type: 'integer', required: true },
      { key: 'applicantCount', type: 'integer', required: false, default: 0 },
      { key: 'acceptedCount', type: 'integer', required: false, default: 0 },
      { key: 'watcherCount', type: 'integer', required: false, default: 0 },
      { key: 'totalKeysLocked', type: 'integer', required: false, default: 0 },
      { key: 'motionScore', type: 'integer', required: false, default: 0 },
      { key: 'extended', type: 'boolean', required: false, default: false },
      { key: 'tags', type: 'string', size: 1000, required: false, array: true },
      { key: 'startTime', type: 'datetime', required: true },
      { key: 'endTime', type: 'datetime', required: true },
      { key: 'createdAt', type: 'datetime', required: true },
      { key: 'updatedAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'type_status', type: 'key', attributes: ['type', 'status'] },
      { key: 'creatorId', type: 'key', attributes: ['creatorId'] },
      { key: 'status', type: 'key', attributes: ['status'] },
      { key: 'motionScore', type: 'key', attributes: ['motionScore'], orders: ['DESC'] },
      { key: 'endTime', type: 'key', attributes: ['endTime'] },
      { key: 'createdAt', type: 'key', attributes: ['createdAt'], orders: ['DESC'] },
    ]
  },
  {
    name: 'blast_applicants',
    id: 'blast_applicants',
    attributes: [
      { key: 'roomId', type: 'string', size: 50, required: true },
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'userName', type: 'string', size: 100, required: true },
      { key: 'userAvatar', type: 'string', size: 500, required: false },
      { key: 'userMotionScore', type: 'integer', required: false, default: 0 },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'message', type: 'string', size: 2000, required: true },
      { key: 'attachments', type: 'string', size: 500, required: false, array: true },
      { key: 'keysStaked', type: 'integer', required: true },
      { key: 'priorityScore', type: 'integer', required: true },
      { key: 'depositAmount', type: 'integer', required: true },
      { key: 'depositRefunded', type: 'boolean', required: false, default: false },
      { key: 'depositForfeit', type: 'boolean', required: false, default: false },
      { key: 'lockId', type: 'string', size: 50, required: true },
      { key: 'activityCount', type: 'integer', required: false, default: 0 },
      { key: 'lastActiveAt', type: 'datetime', required: true },
      { key: 'appliedAt', type: 'datetime', required: true },
      { key: 'respondedAt', type: 'datetime', required: false },
    ],
    indexes: [
      { key: 'roomId_status', type: 'key', attributes: ['roomId', 'status'] },
      { key: 'userId', type: 'key', attributes: ['userId'] },
      { key: 'roomId_priority', type: 'key', attributes: ['roomId', 'priorityScore'], orders: ['ASC', 'DESC'] },
      { key: 'appliedAt', type: 'key', attributes: ['appliedAt'], orders: ['DESC'] },
    ]
  },
  {
    name: 'blast_vault',
    id: 'blast_vault',
    attributes: [
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'walletAddress', type: 'string', size: 100, required: true },
      { key: 'totalLocked', type: 'integer', required: false, default: 0 },
      { key: 'totalEarned', type: 'integer', required: false, default: 0 },
      { key: 'activeRooms', type: 'integer', required: false, default: 0 },
      { key: 'lifetimeRooms', type: 'integer', required: false, default: 0 },
      { key: 'createdAt', type: 'datetime', required: true },
      { key: 'updatedAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'userId', type: 'unique', attributes: ['userId'] },
      { key: 'walletAddress', type: 'key', attributes: ['walletAddress'] },
    ]
  },
  {
    name: 'blast_key_locks',
    id: 'blast_key_locks',
    attributes: [
      { key: 'vaultId', type: 'string', size: 50, required: true },
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'roomId', type: 'string', size: 50, required: true },
      { key: 'keysLocked', type: 'integer', required: true },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'lockedAt', type: 'datetime', required: true },
      { key: 'releasedAt', type: 'datetime', required: false },
    ],
    indexes: [
      { key: 'vaultId', type: 'key', attributes: ['vaultId'] },
      { key: 'userId', type: 'key', attributes: ['userId'] },
      { key: 'roomId', type: 'key', attributes: ['roomId'] },
      { key: 'status', type: 'key', attributes: ['status'] },
    ]
  },
  {
    name: 'blast_motion_scores',
    id: 'blast_motion_scores',
    attributes: [
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'currentScore', type: 'integer', required: false, default: 0 },
      { key: 'baseScore', type: 'integer', required: false, default: 0 },
      { key: 'decayAmount', type: 'float', required: false, default: 0 },
      { key: 'tau', type: 'integer', required: false, default: 72 },
      { key: 'lastDecayAt', type: 'datetime', required: true },
      { key: 'peakScore', type: 'integer', required: false, default: 0 },
      { key: 'updatedAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'userId', type: 'unique', attributes: ['userId'] },
      { key: 'currentScore', type: 'key', attributes: ['currentScore'], orders: ['DESC'] },
    ]
  },
  {
    name: 'blast_motion_events',
    id: 'blast_motion_events',
    attributes: [
      { key: 'type', type: 'string', size: 50, required: true },
      { key: 'actorId', type: 'string', size: 50, required: true },
      { key: 'roomId', type: 'string', size: 50, required: false },
      { key: 'targetId', type: 'string', size: 50, required: false },
      { key: 'weight', type: 'integer', required: true },
      { key: 'decayRate', type: 'integer', required: true },
      { key: 'timestamp', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'actorId', type: 'key', attributes: ['actorId'] },
      { key: 'actorId_timestamp', type: 'key', attributes: ['actorId', 'timestamp'], orders: ['ASC', 'DESC'] },
      { key: 'roomId', type: 'key', attributes: ['roomId'] },
    ]
  },
  {
    name: 'blast_dm_requests',
    id: 'blast_dm_requests',
    attributes: [
      { key: 'requesterId', type: 'string', size: 50, required: true },
      { key: 'targetId', type: 'string', size: 50, required: true },
      { key: 'roomId', type: 'string', size: 50, required: false },
      { key: 'message', type: 'string', size: 500, required: true },
      { key: 'keysOffered', type: 'integer', required: true },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'createdAt', type: 'datetime', required: true },
      { key: 'respondedAt', type: 'datetime', required: false },
    ],
    indexes: [
      { key: 'targetId_status', type: 'key', attributes: ['targetId', 'status'] },
      { key: 'requesterId', type: 'key', attributes: ['requesterId'] },
    ]
  },
  {
    name: 'blast_matches',
    id: 'blast_matches',
    attributes: [
      { key: 'roomId', type: 'string', size: 50, required: true },
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'suggestedUserId', type: 'string', size: 50, required: true },
      { key: 'matchScore', type: 'integer', required: true },
      { key: 'reason', type: 'string', size: 500, required: false },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'createdAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'roomId_userId', type: 'key', attributes: ['roomId', 'userId'] },
      { key: 'userId', type: 'key', attributes: ['userId'] },
    ]
  },
  {
    name: 'blast_analytics',
    id: 'blast_analytics',
    attributes: [
      { key: 'roomId', type: 'string', size: 50, required: true },
      { key: 'views', type: 'integer', required: false, default: 0 },
      { key: 'applications', type: 'integer', required: false, default: 0 },
      { key: 'acceptances', type: 'integer', required: false, default: 0 },
      { key: 'rejections', type: 'integer', required: false, default: 0 },
      { key: 'avgResponseTime', type: 'integer', required: false, default: 0 },
      { key: 'totalKeysLocked', type: 'integer', required: false, default: 0 },
      { key: 'peakMotionScore', type: 'integer', required: false, default: 0 },
      { key: 'createdAt', type: 'datetime', required: true },
      { key: 'updatedAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'roomId', type: 'unique', attributes: ['roomId'] },
    ]
  },
  {
    name: 'blast_notifications',
    id: 'blast_notifications',
    attributes: [
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'type', type: 'string', size: 50, required: true },
      { key: 'title', type: 'string', size: 200, required: true },
      { key: 'message', type: 'string', size: 1000, required: true },
      { key: 'read', type: 'boolean', required: false, default: false },
      { key: 'actionUrl', type: 'string', size: 500, required: false },
      { key: 'metadata', type: 'string', size: 2000, required: false },
      { key: 'priority', type: 'string', size: 20, required: true },
    ],
    indexes: [
      { key: 'userId_read', type: 'key', attributes: ['userId', 'read'] },
      { key: 'userId_createdAt', type: 'key', attributes: ['userId'], orders: ['ASC'] },
    ]
  },
  {
    name: 'blast_notification_preferences',
    id: 'blast_notification_preferences',
    attributes: [
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'inApp', type: 'boolean', required: false, default: true },
      { key: 'email', type: 'boolean', required: false, default: false },
      { key: 'push', type: 'boolean', required: false, default: false },
      { key: 'types', type: 'string', size: 5000, required: false },
    ],
    indexes: [
      { key: 'userId', type: 'unique', attributes: ['userId'] },
    ]
  },
]

// Helper to create collection with attributes and indexes
async function createCollection(schema) {
  const { name, id, attributes, indexes } = schema

  console.log(`\n📦 Creating collection: ${name}`)

  try {
    // Create collection
    const collection = await databases.createCollection(
      DATABASE_ID,
      id,
      name,
      [Permission.read(Role.any())] // Public read by default
    )
    console.log(`   ✅ Collection created: ${id}`)

    // Create attributes
    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            id,
            attr.key,
            attr.size,
            attr.required,
            attr.default,
            attr.array || false
          )
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            id,
            attr.key,
            attr.required,
            undefined,
            undefined,
            attr.default
          )
        } else if (attr.type === 'float') {
          await databases.createFloatAttribute(
            DATABASE_ID,
            id,
            attr.key,
            attr.required,
            undefined,
            undefined,
            attr.default
          )
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            id,
            attr.key,
            attr.required,
            attr.default
          )
        } else if (attr.type === 'datetime') {
          await databases.createDatetimeAttribute(
            DATABASE_ID,
            id,
            attr.key,
            attr.required,
            attr.default
          )
        }
        console.log(`   ✓ Attribute: ${attr.key}`)
      } catch (error) {
        if (error.code === 409) {
          console.log(`   ⚠ Attribute already exists: ${attr.key}`)
        } else {
          console.error(`   ✗ Error creating attribute ${attr.key}:`, error.message)
        }
      }
    }

    // Wait for attributes to be ready
    console.log(`   ⏳ Waiting for attributes to be ready...`)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create indexes
    for (const index of indexes) {
      try {
        await databases.createIndex(
          DATABASE_ID,
          id,
          index.key,
          index.type,
          index.attributes,
          index.orders || []
        )
        console.log(`   ✓ Index: ${index.key}`)
      } catch (error) {
        if (error.code === 409) {
          console.log(`   ⚠ Index already exists: ${index.key}`)
        } else {
          console.error(`   ✗ Error creating index ${index.key}:`, error.message)
        }
      }
    }

    return collection

  } catch (error) {
    if (error.code === 409) {
      console.log(`   ⚠ Collection already exists: ${id}`)
      return null
    } else {
      console.error(`   ✗ Error:`, error.message)
      throw error
    }
  }
}

// Main setup function
async function setup() {
  console.log('🚀 BLAST Appwrite Setup\n')
  console.log(`Endpoint: ${APPWRITE_ENDPOINT}`)
  console.log(`Project: ${APPWRITE_PROJECT_ID}`)
  console.log(`Database: ${DATABASE_ID}\n`)

  try {
    // Create database if it doesn't exist
    try {
      await databases.create(DATABASE_ID, 'BLAST Network')
      console.log(`✅ Database created: ${DATABASE_ID}\n`)
    } catch (error) {
      if (error.code === 409) {
        console.log(`⚠ Database already exists: ${DATABASE_ID}\n`)
      } else {
        throw error
      }
    }

    // Create all collections
    const results = []
    for (const schema of collections) {
      const result = await createCollection(schema)
      results.push({ id: schema.id, created: !!result })
      // Wait between collections to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ BLAST Setup Complete!\n')
    console.log('Collections created:')
    results.forEach(r => {
      console.log(`  ${r.created ? '✅' : '⚠️ '} ${r.id}`)
    })

    console.log('\n📝 Add these to your .env.local:\n')
    console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${DATABASE_ID}`)
    results.forEach(r => {
      const envKey = `NEXT_PUBLIC_APPWRITE_${r.id.toUpperCase()}_COLLECTION`
      console.log(`${envKey}=${r.id}`)
    })

    console.log('\n🎉 Ready to go! Run your app and test BLAST features.')

  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  }
}

// Run setup
setup()
