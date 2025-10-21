#!/usr/bin/env node

/**
 * Seed Chat Data Script
 * Creates test threads and messages in Appwrite for testing chat UI
 *
 * Usage: node scripts/seed-chat-data.mjs
 */

import { Client, Databases, ID, Query } from 'node-appwrite'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '68e34a030010f2321359')
  .setKey(process.env.APPWRITE_API_KEY) // Server-side API key required

const databases = new Databases(client)

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'
const COLLECTIONS = {
  THREADS: process.env.NEXT_PUBLIC_APPWRITE_THREADS_COLLECTION_ID || 'threads',
  MESSAGES: process.env.NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID || 'messages'
}

// Test user IDs - using wallet addresses as user IDs (compatible with Privy)
const TEST_USERS = {
  user1: 'crypto_mike',
  user2: 'sarah_dev',
  user3: 'scout_anna',
  you: '9b7peEZzAf3QUCgc2cYdVDETJV3DDqmGmv1MswAMX7x1' // Real Solana embedded wallet address
}

// Sample messages for different conversation types
const SAMPLE_CONVERSATIONS = [
  {
    type: 'dm',
    name: null,
    participants: [TEST_USERS.you, TEST_USERS.user1],
    messages: [
      { sender: TEST_USERS.user1, content: 'Hey! Saw your project on the platform. Looks interesting!' },
      { sender: TEST_USERS.you, content: 'Thanks! Working on a Solana bonding curve system' },
      { sender: TEST_USERS.user1, content: 'Nice! I have experience with AMM protocols. Want to collaborate?' },
      { sender: TEST_USERS.you, content: 'Definitely! Let\'s hop on a call this week' },
      { sender: TEST_USERS.user1, content: 'Perfect. I\'ll DM you my calendar link' }
    ]
  },
  {
    type: 'dm',
    name: null,
    participants: [TEST_USERS.you, TEST_USERS.user2],
    messages: [
      { sender: TEST_USERS.user2, content: 'Quick question about your referral program' },
      { sender: TEST_USERS.you, content: 'Sure, what\'s up?' },
      { sender: TEST_USERS.user2, content: 'What\'s the commission structure?' },
      { sender: TEST_USERS.you, content: '3% on all trades from your referrals' },
      { sender: TEST_USERS.user2, content: 'That\'s solid! Signing up now 🚀' }
    ]
  },
  {
    type: 'group',
    name: 'Solana Builders',
    participants: [TEST_USERS.you, TEST_USERS.user1, TEST_USERS.user2, TEST_USERS.user3],
    projectId: 'project_test_1',
    messages: [
      { sender: TEST_USERS.user1, content: 'Welcome to the Solana Builders project room!' },
      { sender: TEST_USERS.user2, content: 'Excited to be part of this' },
      { sender: TEST_USERS.you, content: 'Let\'s build something amazing' },
      { sender: TEST_USERS.user3, content: 'I can help with frontend work' },
      { sender: TEST_USERS.user1, content: 'Perfect! I\'ll share the Figma designs' }
    ]
  },
  {
    type: 'group',
    name: 'Marketing Campaign',
    participants: [TEST_USERS.you, TEST_USERS.user2],
    campaignId: 'campaign_test_1',
    messages: [
      { sender: TEST_USERS.user2, content: 'Campaign is live! 🎉' },
      { sender: TEST_USERS.you, content: 'Great work on the graphics' },
      { sender: TEST_USERS.user2, content: 'Thanks! Already seeing good engagement' }
    ]
  }
]

async function clearExistingData() {
  console.log('🧹 Clearing existing test data...')

  try {
    // Get all threads
    const threads = await databases.listDocuments(DB_ID, COLLECTIONS.THREADS, [
      Query.limit(100)
    ])

    // Delete all messages first
    for (const thread of threads.documents) {
      const messages = await databases.listDocuments(DB_ID, COLLECTIONS.MESSAGES, [
        Query.equal('threadId', thread.$id),
        Query.limit(100)
      ])

      for (const message of messages.documents) {
        await databases.deleteDocument(DB_ID, COLLECTIONS.MESSAGES, message.$id)
      }

      // Delete thread
      await databases.deleteDocument(DB_ID, COLLECTIONS.THREADS, thread.$id)
    }

    console.log(`✅ Cleared ${threads.documents.length} threads`)
  } catch (error) {
    console.log('⚠️  No existing data to clear or error:', error.message)
  }
}

async function seedConversations() {
  console.log('\n📝 Creating test conversations...\n')

  for (const conv of SAMPLE_CONVERSATIONS) {
    const threadId = ID.unique()
    const threadLabel = conv.name || `DM with ${conv.participants[1].substring(0, 10)}...`

    console.log(`Creating: ${threadLabel}`)

    // Create thread
    const thread = await databases.createDocument(
      DB_ID,
      COLLECTIONS.THREADS,
      threadId,
      {
        threadId: `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: conv.type,
        name: conv.name,
        participantIds: conv.participants,
        projectId: conv.projectId || null,
        campaignId: conv.campaignId || null,
        lastMessageAt: new Date().toISOString()
      }
    )

    console.log(`  ✅ Thread created: ${thread.$id}`)

    // Add messages with delays
    for (let i = 0; i < conv.messages.length; i++) {
      const msg = conv.messages[i]
      const timestamp = new Date(Date.now() - (conv.messages.length - i) * 60000) // 1 min apart

      // Determine receiverId: for DMs it's the other participant, for groups use first non-sender
      const receiverId = conv.type === 'dm'
        ? conv.participants.find(p => p !== msg.sender)
        : conv.participants.find(p => p !== msg.sender) || conv.participants[0]

      await databases.createDocument(
        DB_ID,
        COLLECTIONS.MESSAGES,
        ID.unique(),
        {
          messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          threadId: thread.$id,
          senderId: msg.sender,
          receiverId: receiverId,
          text: msg.content,
          read: false
        }
      )

      console.log(`  💬 Message ${i + 1}/${conv.messages.length}: ${msg.content.substring(0, 40)}...`)
    }

    // Update thread lastMessageAt
    await databases.updateDocument(
      DB_ID,
      COLLECTIONS.THREADS,
      threadId,
      {
        lastMessageAt: new Date().toISOString()
      }
    )

    console.log(`  ✅ ${conv.messages.length} messages added\n`)
  }
}

async function showResults() {
  console.log('📊 Summary:\n')

  const threads = await databases.listDocuments(DB_ID, COLLECTIONS.THREADS, [
    Query.limit(100)
  ])

  console.log(`Total threads: ${threads.total}`)

  for (const thread of threads.documents) {
    const messages = await databases.listDocuments(DB_ID, COLLECTIONS.MESSAGES, [
      Query.equal('threadId', thread.$id),
      Query.limit(100)
    ])

    console.log(`  • ${thread.name || 'DM'} (${thread.type}): ${messages.total} messages`)
  }

  console.log('\n✅ Chat data seeded successfully!')
  console.log('\n📱 Now you can test the chat UI at /chat')
  console.log(`👤 Make sure to update TEST_USERS.you in this script with your actual user ID`)
}

async function main() {
  console.log('🚀 Seeding Chat Data for Appwrite\n')
  console.log(`Database: ${DB_ID}`)
  console.log(`Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}\n`)

  try {
    await clearExistingData()
    await seedConversations()
    await showResults()
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    if (error.type) {
      console.error(`Type: ${error.type}`)
    }
    if (error.response) {
      console.error(`Response:`, error.response)
    }
    process.exit(1)
  }
}

main()