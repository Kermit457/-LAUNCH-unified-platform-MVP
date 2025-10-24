#!/usr/bin/env node
/**
 * Appwrite Database Setup Script
 * Creates/updates all required collections and attributes for ICM Motion platform
 *
 * Run: node scripts/setup-appwrite.mjs
 */

import { Client, Databases, ID } from 'node-appwrite'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') })

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '') // Requires API key with full permissions

const databases = new Databases(client)

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'
const DB_NAME = 'LaunchOS Database'

// Collection schemas
const COLLECTIONS = {
  projects: {
    name: 'Projects',
    permissions: ['read("any")', 'create("users")', 'update("users")', 'delete("users")'],
    attributes: [
      { key: 'type', type: 'string', size: 20, required: true },
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'subtitle', type: 'string', size: 500, required: false },
      { key: 'logoUrl', type: 'string', size: 500, required: false },
      { key: 'ticker', type: 'string', size: 20, required: true },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'beliefScore', type: 'integer', required: false, default: 0 },
      { key: 'upvotes', type: 'integer', required: false, default: 0 },
      { key: 'mintAddress', type: 'string', size: 100, required: false },
      { key: 'totalSupply', type: 'integer', required: false },
      { key: 'websiteUrl', type: 'string', size: 500, required: false },
      { key: 'twitterUrl', type: 'string', size: 500, required: false },
      { key: 'telegramUrl', type: 'string', size: 500, required: false },
      { key: 'githubUrl', type: 'string', size: 500, required: false },
      { key: 'creatorId', type: 'string', size: 100, required: true },
      { key: 'creatorName', type: 'string', size: 255, required: false },
      { key: 'creatorAvatar', type: 'string', size: 500, required: false },
      { key: 'creatorTwitter', type: 'string', size: 100, required: false },
      { key: 'isExperimental', type: 'boolean', required: false },
    ],
    indexes: [
      { key: 'type_idx', type: 'key', attributes: ['type'] },
      { key: 'status_idx', type: 'key', attributes: ['status'] },
      { key: 'belief_idx', type: 'key', attributes: ['beliefScore'], orders: ['DESC'] },
      { key: 'creator_idx', type: 'key', attributes: ['creatorId'] },
    ]
  },

  clips: {
    name: 'Clips',
    permissions: ['read("any")', 'create("users")', 'update("users")', 'delete("users")'],
    attributes: [
      { key: 'projectId', type: 'string', size: 100, required: true },
      { key: 'userId', type: 'string', size: 100, required: true },
      { key: 'clipUrl', type: 'string', size: 500, required: true },
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 1000, required: false },
      { key: 'views', type: 'integer', required: false, default: 0 },
      { key: 'platform', type: 'string', size: 50, required: true },
    ],
    indexes: [
      { key: 'project_idx', type: 'key', attributes: ['projectId'] },
      { key: 'user_idx', type: 'key', attributes: ['userId'] },
      { key: 'views_idx', type: 'key', attributes: ['views'], orders: ['DESC'] },
    ]
  },

  contributors: {
    name: 'Contributors',
    permissions: ['read("any")', 'create("users")', 'update("users")', 'delete("users")'],
    attributes: [
      { key: 'projectId', type: 'string', size: 100, required: true },
      { key: 'userId', type: 'string', size: 100, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'avatar', type: 'string', size: 500, required: false },
      { key: 'twitterHandle', type: 'string', size: 100, required: false },
      { key: 'twitterAvatar', type: 'string', size: 500, required: false },
      { key: 'role', type: 'string', size: 100, required: false },
      { key: 'joinedAt', type: 'string', size: 50, required: true },
    ],
    indexes: [
      { key: 'project_idx', type: 'key', attributes: ['projectId'] },
      { key: 'user_idx', type: 'key', attributes: ['userId'] },
    ]
  },

  votes: {
    name: 'Votes',
    permissions: ['read("any")', 'create("users")', 'delete("users")'],
    attributes: [
      { key: 'projectId', type: 'string', size: 100, required: true },
      { key: 'userId', type: 'string', size: 100, required: true },
    ],
    indexes: [
      { key: 'project_user_idx', type: 'unique', attributes: ['projectId', 'userId'] },
      { key: 'project_idx', type: 'key', attributes: ['projectId'] },
    ]
  },

  holders: {
    name: 'Token Holders',
    permissions: ['read("any")', 'create("users")', 'update("users")'],
    attributes: [
      { key: 'projectId', type: 'string', size: 100, required: true },
      { key: 'walletAddress', type: 'string', size: 100, required: true },
      { key: 'amount', type: 'float', required: false, default: 0 },
      { key: 'lastUpdated', type: 'string', size: 50, required: true },
    ],
    indexes: [
      { key: 'project_wallet_idx', type: 'unique', attributes: ['projectId', 'walletAddress'] },
      { key: 'project_idx', type: 'key', attributes: ['projectId'] },
      { key: 'wallet_idx', type: 'key', attributes: ['walletAddress'] },
    ]
  },

  social_links: {
    name: 'Social Links',
    permissions: ['read("any")', 'create("users")', 'update("users")'],
    attributes: [
      { key: 'projectId', type: 'string', size: 100, required: true },
      { key: 'website', type: 'string', size: 500, required: false },
      { key: 'twitter', type: 'string', size: 500, required: false },
      { key: 'telegram', type: 'string', size: 500, required: false },
      { key: 'github', type: 'string', size: 500, required: false },
      { key: 'discord', type: 'string', size: 500, required: false },
    ],
    indexes: [
      { key: 'project_idx', type: 'unique', attributes: ['projectId'] },
    ]
  },

  users: {
    name: 'Users',
    permissions: ['read("any")', 'create("users")', 'update("users")'],
    attributes: [
      { key: 'userId', type: 'string', size: 100, required: true },
      { key: 'username', type: 'string', size: 100, required: true },
      { key: 'walletAddress', type: 'string', size: 100, required: true },
      { key: 'displayName', type: 'string', size: 255, required: false },
      { key: 'avatar', type: 'string', size: 500, required: false },
      { key: 'twitterHandle', type: 'string', size: 100, required: false },
      { key: 'twitterVerified', type: 'boolean', required: false },
      { key: 'role', type: 'string', size: 50, required: false },
      { key: 'roles', type: 'string', size: 500, required: true, array: true },
      { key: 'bio', type: 'string', size: 1000, required: false },
    ],
    indexes: [
      { key: 'user_idx', type: 'unique', attributes: ['userId'] },
      { key: 'username_idx', type: 'unique', attributes: ['username'] },
      { key: 'wallet_idx', type: 'unique', attributes: ['walletAddress'] },
      { key: 'twitter_idx', type: 'key', attributes: ['twitterHandle'] },
    ]
  }
}

async function setupDatabase() {
  console.log('🚀 Starting Appwrite Database Setup...\n')

  try {
    // Step 1: Create database if it doesn't exist
    console.log('📦 Creating/verifying database...')
    try {
      await databases.get(DB_ID)
      console.log(`✅ Database "${DB_NAME}" already exists\n`)
    } catch (error) {
      if (error.code === 404) {
        await databases.create(DB_ID, DB_NAME)
        console.log(`✅ Database "${DB_NAME}" created\n`)
      } else {
        throw error
      }
    }

    // Step 2: Create collections
    for (const [collectionKey, schema] of Object.entries(COLLECTIONS)) {
      console.log(`📋 Processing collection: ${schema.name}`)

      try {
        // Try to get existing collection
        const existingCollection = await databases.getCollection(DB_ID, collectionKey)
        console.log(`   ℹ️  Collection already exists, updating attributes...`)

        // Add new attributes if they don't exist
        for (const attr of schema.attributes) {
          try {
            const createAttr = async () => {
              if (attr.type === 'string') {
                await databases.createStringAttribute(DB_ID, collectionKey, attr.key, attr.size, attr.required, attr.default || undefined, attr.array || false)
              } else if (attr.type === 'integer') {
                await databases.createIntegerAttribute(DB_ID, collectionKey, attr.key, attr.required, undefined, undefined, attr.default !== undefined ? attr.default : undefined, attr.array || false)
              } else if (attr.type === 'float') {
                await databases.createFloatAttribute(DB_ID, collectionKey, attr.key, attr.required, undefined, undefined, attr.default !== undefined ? attr.default : undefined, attr.array || false)
              } else if (attr.type === 'boolean') {
                await databases.createBooleanAttribute(DB_ID, collectionKey, attr.key, attr.required, attr.default !== undefined ? attr.default : undefined, attr.array || false)
              }
            }

            await createAttr()
            console.log(`   ✅ Added attribute: ${attr.key}`)
          } catch (attrError) {
            if (attrError.code === 409) {
              console.log(`   ⏭️  Attribute ${attr.key} already exists`)
            } else {
              console.error(`   ❌ Error adding attribute ${attr.key}:`, attrError.message)
            }
          }
        }

        // Add indexes
        for (const index of schema.indexes || []) {
          try {
            await databases.createIndex(
              DB_ID,
              collectionKey,
              index.key,
              index.type,
              index.attributes,
              index.orders
            )
            console.log(`   ✅ Added index: ${index.key}`)
          } catch (indexError) {
            if (indexError.code === 409) {
              console.log(`   ⏭️  Index ${index.key} already exists`)
            } else {
              console.error(`   ❌ Error adding index ${index.key}:`, indexError.message)
            }
          }
        }

      } catch (error) {
        if (error.code === 404) {
          // Collection doesn't exist, create it
          console.log(`   📝 Creating new collection...`)

          await databases.createCollection(
            DB_ID,
            collectionKey,
            schema.name,
            schema.permissions
          )
          console.log(`   ✅ Collection created`)

          // Add attributes
          for (const attr of schema.attributes) {
            if (attr.type === 'string') {
              await databases.createStringAttribute(DB_ID, collectionKey, attr.key, attr.size, attr.required, attr.default || undefined, attr.array || false)
            } else if (attr.type === 'integer') {
              await databases.createIntegerAttribute(DB_ID, collectionKey, attr.key, attr.required, undefined, undefined, attr.default !== undefined ? attr.default : undefined, attr.array || false)
            } else if (attr.type === 'float') {
              await databases.createFloatAttribute(DB_ID, collectionKey, attr.key, attr.required, undefined, undefined, attr.default !== undefined ? attr.default : undefined, attr.array || false)
            } else if (attr.type === 'boolean') {
              await databases.createBooleanAttribute(DB_ID, collectionKey, attr.key, attr.required, attr.default !== undefined ? attr.default : undefined, attr.array || false)
            }
            console.log(`   ✅ Added attribute: ${attr.key}`)
          }

          // Add indexes
          for (const index of schema.indexes || []) {
            await databases.createIndex(
              DB_ID,
              collectionKey,
              index.key,
              index.type,
              index.attributes,
              index.orders
            )
            console.log(`   ✅ Added index: ${index.key}`)
          }
        } else {
          throw error
        }
      }

      console.log(`✅ Collection "${schema.name}" ready\n`)
    }

    console.log('🎉 Appwrite database setup completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   Database: ${DB_NAME}`)
    console.log(`   Collections: ${Object.keys(COLLECTIONS).length}`)
    console.log(`   Status: ✅ Ready for use\n`)

  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    console.error('\nDetails:', error.message)
    console.error('\nPlease check:')
    console.error('  1. APPWRITE_API_KEY is set in .env.local')
    console.error('  2. API key has full database permissions')
    console.error('  3. NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT are correct')
    process.exit(1)
  }
}

// Run setup
setupDatabase()
