import { Client, Databases, Storage, Permission, Role, Compression } from 'node-appwrite'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') })

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const apiKey = process.env.APPWRITE_API_KEY

if (!endpoint || !projectId || !apiKey) {
  console.error('❌ Missing environment variables!')
  console.error('Please check your .env file has:')
  console.error('- NEXT_PUBLIC_APPWRITE_ENDPOINT')
  console.error('- NEXT_PUBLIC_APPWRITE_PROJECT_ID')
  console.error('- APPWRITE_API_KEY')
  process.exit(1)
}

console.log('📋 Using configuration:')
console.log('- Endpoint:', endpoint)
console.log('- Project ID:', projectId)
console.log('- API Key:', apiKey.substring(0, 20) + '...')
console.log('')

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey)

const databases = new Databases(client)
const storage = new Storage(client)

async function setupAppwrite() {
  try {
    console.log('🚀 Setting up Appwrite database and collections...\n')

    // 1. Create Database (or use existing)
    console.log('📦 Checking database...')
    try {
      const database = await databases.create(
        'launchos_db',
        'LaunchOS Database'
      )
      console.log('✅ Database created:', database.$id)
    } catch (error: any) {
      if (error.code === 409) {
        console.log('✅ Database already exists, using existing database')
      } else {
        throw error
      }
    }

    // 2. Create Collections
    const collections = [
      {
        id: 'users',
        name: 'Users',
        permissions: [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'userId', type: 'string', size: 255, required: true },
          { key: 'username', type: 'string', size: 50, required: true },
          { key: 'displayName', type: 'string', size: 100, required: true },
          { key: 'avatar', type: 'string', size: 500, required: false },
          { key: 'avatarUrl', type: 'string', size: 500, required: false },
          { key: 'bannerUrl', type: 'string', size: 500, required: false },
          { key: 'bio', type: 'string', size: 500, required: false },
          { key: 'walletAddress', type: 'string', size: 100, required: false },
          { key: 'roles', type: 'string', size: 500, required: true, array: true },
          { key: 'verified', type: 'boolean', required: false, default: false },
          { key: 'conviction', type: 'integer', required: false, default: 0 },
          { key: 'totalEarnings', type: 'double', required: false, default: 0 },
          { key: 'followedLaunches', type: 'string', size: 5000, required: false, array: true },
          { key: 'socialLinks', type: 'string', size: 1000, required: false }
        ]
      },
      {
        id: 'launches',
        name: 'Launches',
        permissions: [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'launchId', type: 'string', size: 100, required: true },
          { key: 'scope', type: 'string', size: 10, required: true },
          { key: 'status', type: 'string', size: 20, required: true },
          { key: 'title', type: 'string', size: 200, required: true },
          { key: 'subtitle', type: 'string', size: 500, required: false },
          { key: 'logoUrl', type: 'string', size: 500, required: false },
          { key: 'mint', type: 'string', size: 100, required: false },
          { key: 'convictionPct', type: 'integer', required: false, default: 0 },
          { key: 'commentsCount', type: 'integer', required: false, default: 0 },
          { key: 'upvotes', type: 'integer', required: false, default: 0 },
          { key: 'tgeAt', type: 'datetime', required: false },
          { key: 'contributors', type: 'string', size: 5000, required: false },
          { key: 'createdBy', type: 'string', size: 100, required: true }
        ]
      },
      {
        id: 'campaigns',
        name: 'Campaigns',
        permissions: [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'campaignId', type: 'string', size: 100, required: true },
          { key: 'title', type: 'string', size: 200, required: true },
          { key: 'description', type: 'string', size: 2000, required: false },
          { key: 'createdBy', type: 'string', size: 100, required: true },
          { key: 'status', type: 'string', size: 20, required: true },
          { key: 'ratePerThousand', type: 'double', required: true },
          { key: 'budgetTotal', type: 'double', required: true },
          { key: 'budgetPaid', type: 'double', required: false, default: 0 },
          { key: 'platforms', type: 'string', size: 500, required: true, array: true },
          { key: 'clipDurationMin', type: 'integer', required: false },
          { key: 'clipDurationMax', type: 'integer', required: false },
          { key: 'streamUrl', type: 'string', size: 500, required: false },
          { key: 'assetUrl', type: 'string', size: 500, required: false },
          { key: 'views', type: 'integer', required: false, default: 0 },
          { key: 'endsAt', type: 'datetime', required: false }
        ]
      },
      {
        id: 'quests',
        name: 'Quests',
        permissions: [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'questId', type: 'string', size: 100, required: true },
          { key: 'type', type: 'string', size: 20, required: true },
          { key: 'title', type: 'string', size: 200, required: true },
          { key: 'description', type: 'string', size: 2000, required: false },
          { key: 'createdBy', type: 'string', size: 100, required: true },
          { key: 'status', type: 'string', size: 20, required: true },
          { key: 'poolAmount', type: 'double', required: false },
          { key: 'payPerTask', type: 'double', required: false },
          { key: 'budgetTotal', type: 'double', required: true },
          { key: 'budgetPaid', type: 'double', required: false, default: 0 },
          { key: 'platforms', type: 'string', size: 500, required: true, array: true },
          { key: 'views', type: 'integer', required: false, default: 0 }
        ]
      },
      {
        id: 'submissions',
        name: 'Submissions',
        permissions: [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'submissionId', type: 'string', size: 100, required: true },
          { key: 'campaignId', type: 'string', size: 100, required: false },
          { key: 'questId', type: 'string', size: 100, required: false },
          { key: 'userId', type: 'string', size: 100, required: true },
          { key: 'status', type: 'string', size: 20, required: true },
          { key: 'mediaUrl', type: 'string', size: 500, required: true },
          { key: 'views', type: 'integer', required: false, default: 0 },
          { key: 'earnings', type: 'double', required: false, default: 0 },
          { key: 'notes', type: 'string', size: 1000, required: false },
          { key: 'reviewedAt', type: 'datetime', required: false }
        ]
      },
      {
        id: 'comments',
        name: 'Comments',
        permissions: [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'commentId', type: 'string', size: 100, required: true },
          { key: 'launchId', type: 'string', size: 100, required: false },
          { key: 'campaignId', type: 'string', size: 100, required: false },
          { key: 'userId', type: 'string', size: 100, required: true },
          { key: 'username', type: 'string', size: 50, required: true },
          { key: 'avatar', type: 'string', size: 500, required: false },
          { key: 'text', type: 'string', size: 1000, required: true },
          { key: 'upvotes', type: 'integer', required: false, default: 0 },
          { key: 'parentId', type: 'string', size: 100, required: false }
        ]
      },
      {
        id: 'notifications',
        name: 'Notifications',
        permissions: [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'notificationId', type: 'string', size: 100, required: true },
          { key: 'userId', type: 'string', size: 100, required: true },
          { key: 'type', type: 'string', size: 50, required: true },
          { key: 'category', type: 'string', size: 20, required: true },
          { key: 'title', type: 'string', size: 200, required: true },
          { key: 'message', type: 'string', size: 500, required: true },
          { key: 'read', type: 'boolean', required: false, default: false },
          { key: 'actionUrl', type: 'string', size: 500, required: false },
          { key: 'metadata', type: 'string', size: 2000, required: false }
        ]
      },
      {
        id: 'network_invites',
        name: 'Network Invites',
        permissions: [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'inviteId', type: 'string', size: 100, required: true },
          { key: 'senderId', type: 'string', size: 100, required: true },
          { key: 'senderUsername', type: 'string', size: 50, required: true },
          { key: 'senderDisplayName', type: 'string', size: 100, required: true },
          { key: 'senderAvatarUrl', type: 'string', size: 500, required: false },
          { key: 'receiverId', type: 'string', size: 100, required: true },
          { key: 'receiverUsername', type: 'string', size: 50, required: true },
          { key: 'status', type: 'string', size: 20, required: true },
          { key: 'message', type: 'string', size: 500, required: false },
          { key: 'createdAt', type: 'datetime', required: true },
          { key: 'respondedAt', type: 'datetime', required: false }
        ]
      },
      {
        id: 'network_connections',
        name: 'Network Connections',
        permissions: [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'connectionId', type: 'string', size: 100, required: true },
          { key: 'userId1', type: 'string', size: 100, required: true },
          { key: 'userId2', type: 'string', size: 100, required: true },
          { key: 'connectedAt', type: 'datetime', required: true }
        ]
      },
      {
        id: 'messages',
        name: 'Messages',
        permissions: [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'messageId', type: 'string', size: 100, required: true },
          { key: 'threadId', type: 'string', size: 100, required: true },
          { key: 'senderId', type: 'string', size: 100, required: true },
          { key: 'receiverId', type: 'string', size: 100, required: true },
          { key: 'text', type: 'string', size: 2000, required: true },
          { key: 'read', type: 'boolean', required: false, default: false }
        ]
      },
      {
        id: 'payouts',
        name: 'Payouts',
        permissions: [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'payoutId', type: 'string', size: 100, required: true },
          { key: 'userId', type: 'string', size: 100, required: true },
          { key: 'campaignId', type: 'string', size: 100, required: false },
          { key: 'questId', type: 'string', size: 100, required: false },
          { key: 'amount', type: 'double', required: true },
          { key: 'currency', type: 'string', size: 20, required: true },
          { key: 'status', type: 'string', size: 20, required: true },
          { key: 'txHash', type: 'string', size: 200, required: false },
          { key: 'claimedAt', type: 'datetime', required: false },
          { key: 'paidAt', type: 'datetime', required: false },
          { key: 'fee', type: 'double', required: false },
          { key: 'net', type: 'double', required: false }
        ]
      },
      {
        id: 'activities',
        name: 'Activities',
        permissions: [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'activityId', type: 'string', size: 100, required: true },
          { key: 'userId', type: 'string', size: 100, required: true },
          { key: 'type', type: 'string', size: 50, required: true },
          { key: 'category', type: 'string', size: 20, required: true },
          { key: 'title', type: 'string', size: 200, required: true },
          { key: 'message', type: 'string', size: 500, required: false },
          { key: 'metadata', type: 'string', size: 2000, required: false },
          { key: 'actionUrl', type: 'string', size: 500, required: false },
          { key: 'read', type: 'boolean', required: false, default: false }
        ]
      },
      {
        id: 'threads',
        name: 'Threads',
        permissions: [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        attributes: [
          { key: 'threadId', type: 'string', size: 100, required: true },
          { key: 'type', type: 'string', size: 20, required: true }, // 'dm' or 'group'
          { key: 'name', type: 'string', size: 200, required: false }, // Only for group threads
          { key: 'participantIds', type: 'string', size: 5000, required: true, array: true }, // Array of user IDs
          { key: 'lastMessageAt', type: 'string', size: 50, required: false }, // ISO timestamp
          { key: 'projectId', type: 'string', size: 100, required: false }, // Optional link to project
          { key: 'campaignId', type: 'string', size: 100, required: false } // Optional link to campaign
        ]
      }
    ]

    for (const collection of collections) {
      console.log(`\n📁 Creating collection: ${collection.name}...`)

      try {
        const col = await databases.createCollection(
          'launchos_db',
          collection.id,
          collection.name,
          collection.permissions
        )
        console.log(`✅ Collection created: ${col.$id}`)
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`⚠️  Collection already exists, skipping: ${collection.id}`)
          continue
        } else {
          throw error
        }
      }

      // Create attributes
      for (const attr of collection.attributes) {
        console.log(`  ➕ Adding attribute: ${attr.key}`)

        try {
          if (attr.type === 'string') {
            await databases.createStringAttribute(
              'launchos_db',
              collection.id,
              attr.key,
              attr.size!,
              attr.required,
              attr.default as string | undefined,
              attr.array
            )
          } else if (attr.type === 'integer') {
            await databases.createIntegerAttribute(
              'launchos_db',
              collection.id,
              attr.key,
              attr.required,
              undefined,
              undefined,
              attr.default as number | undefined
            )
          } else if (attr.type === 'double') {
            await databases.createFloatAttribute(
              'launchos_db',
              collection.id,
              attr.key,
              attr.required,
              undefined,
              undefined,
              attr.default as number | undefined
            )
          } else if (attr.type === 'boolean') {
            await databases.createBooleanAttribute(
              'launchos_db',
              collection.id,
              attr.key,
              attr.required,
              attr.default as boolean | undefined
            )
          } else if (attr.type === 'datetime') {
            await databases.createDatetimeAttribute(
              'launchos_db',
              collection.id,
              attr.key,
              attr.required
            )
          }

          // Wait a bit to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (attrError: any) {
          if (attrError.code === 409) {
            console.log(`    ⚠️  Attribute already exists: ${attr.key}`)
          } else {
            throw attrError
          }
        }
      }
    }

    // 3. Create Storage Buckets
    console.log('\n\n🗄️  Creating storage buckets...')

    const buckets = [
      { id: 'avatars', name: 'User Avatars', maxSize: 5000000 },
      { id: 'campaign_media', name: 'Campaign Media', maxSize: 50000000 },
      { id: 'submissions', name: 'Submissions', maxSize: 100000000 }
    ]

    for (const bucket of buckets) {
      console.log(`\n📦 Creating bucket: ${bucket.name}...`)

      try {
        const b = await storage.createBucket(
          bucket.id,
          bucket.name,
          [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
          ],
          false, // fileSecurity
          true,  // enabled
          bucket.maxSize, // maximumFileSize
          ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm', 'mov'], // allowedFileExtensions
          Compression.Gzip, // compression
          false,  // encryption
          true    // antivirus
        )
        console.log(`✅ Bucket created: ${b.$id}`)
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`⚠️  Bucket already exists, skipping: ${bucket.id}`)
        } else {
          throw error
        }
      }
    }

    console.log('\n\n🎉 Appwrite setup complete!')
    console.log('✅ Database created: launchos_db')
    console.log('✅ 13 collections created')
    console.log('✅ 3 storage buckets created')
    console.log('\nYou can now run:')
    console.log('  - npm run seed  (to populate with sample data)')
    console.log('  - npm run dev   (to start the app)')

  } catch (error: any) {
    console.error('❌ Setup failed:', error.message)
    if (error.response) {
      console.error('Response:', error.response)
    }
    process.exit(1)
  }
}

setupAppwrite()
