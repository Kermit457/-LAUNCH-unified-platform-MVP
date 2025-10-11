require('dotenv').config()
const { Client, Databases } = require('node-appwrite')

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY)

const databases = new Databases(client)
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_SNAPSHOTS_COLLECTION_ID || 'snapshots'

async function addAirdropFields() {
  console.log('📦 Adding airdrop fields to snapshots collection...\n')

  try {
    // Add airdropCompleted boolean
    console.log('Adding airdropCompleted attribute...')
    await databases.createBooleanAttribute(
      databaseId,
      collectionId,
      'airdropCompleted',
      false,
      false // default value
    )
    console.log('✅ airdropCompleted added')

    // Add airdropCompletedAt timestamp
    console.log('Adding airdropCompletedAt attribute...')
    await databases.createStringAttribute(
      databaseId,
      collectionId,
      'airdropCompletedAt',
      255,
      false
    )
    console.log('✅ airdropCompletedAt added')

    console.log('\n🎉 Airdrop fields added successfully!')
    console.log('The snapshots collection now tracks automatic airdrop completion.')
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  Attributes already exist')
    } else {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  }
}

addAirdropFields()
