/**
 * Appwrite Database Setup Script
 * Adds viewCount and boostCount fields to launches collection
 *
 * Run with: npx tsx scripts/setup-realtime-fields.ts
 */

import { Client, Databases } from 'node-appwrite'

// Environment variables
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1'
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '68e34a030010f2321359'
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY

// Database configuration
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'
const LAUNCHES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID || 'launches'

if (!APPWRITE_API_KEY) {
  console.error('❌ Error: APPWRITE_API_KEY not found in environment variables')
  console.log('\nPlease add your API key to .env file:')
  console.log('APPWRITE_API_KEY=your_api_key_here')
  process.exit(1)
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY)

const databases = new Databases(client)

async function setupRealtimeFields() {
  console.log('🚀 Starting Appwrite Real-time Fields Setup...\n')
  console.log(`📊 Database: ${DB_ID}`)
  console.log(`📁 Collection: ${LAUNCHES_COLLECTION_ID}\n`)

  try {
    // Add viewCount field
    console.log('➕ Adding viewCount field...')
    try {
      await databases.createIntegerAttribute(
        DB_ID,
        LAUNCHES_COLLECTION_ID,
        'viewCount',
        false, // not required
        0,     // default value
        undefined, // min (optional)
        undefined  // max (optional)
      )
      console.log('✅ viewCount field created successfully')
    } catch (error: any) {
      if (error.message?.includes('already exists') || error.code === 409) {
        console.log('⚠️  viewCount field already exists - skipping')
      } else {
        throw error
      }
    }

    // Add boostCount field
    console.log('➕ Adding boostCount field...')
    try {
      await databases.createIntegerAttribute(
        DB_ID,
        LAUNCHES_COLLECTION_ID,
        'boostCount',
        false, // not required
        0,     // default value
        undefined, // min (optional)
        undefined  // max (optional)
      )
      console.log('✅ boostCount field created successfully')
    } catch (error: any) {
      if (error.message?.includes('already exists') || error.code === 409) {
        console.log('⚠️  boostCount field already exists - skipping')
      } else {
        throw error
      }
    }

    // Wait for attributes to be available
    console.log('\n⏳ Waiting for Appwrite to process attributes (30 seconds)...')
    await new Promise(resolve => setTimeout(resolve, 30000))

    console.log('\n✨ Setup Complete! ✨\n')
    console.log('Next steps:')
    console.log('1. Refresh your app (Ctrl/Cmd + R)')
    console.log('2. Visit any launch page: http://localhost:3000/discover')
    console.log('3. Click on a launch to view details')
    console.log('4. Check Appwrite Console to see viewCount increment')
    console.log('\n📊 Real-time features are now active!')

  } catch (error: any) {
    console.error('\n❌ Setup failed:', error.message)
    console.error('\nFull error:', error)
    process.exit(1)
  }
}

// Run the setup
setupRealtimeFields()
