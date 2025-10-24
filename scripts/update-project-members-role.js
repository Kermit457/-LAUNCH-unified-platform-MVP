#!/usr/bin/env node

/**
 * Update PROJECT_MEMBERS collection to support 'contributor' role
 *
 * This script updates the 'role' attribute in the project_members collection
 * to allow three values: 'owner', 'member', and 'contributor'
 *
 * Run: node scripts/update-project-members-role.js
 */

const { Client, Databases } = require('node-appwrite');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db';
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_MEMBERS_COLLECTION_ID || 'project_members';

// API Key (needs to be set in environment)
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID) {
  console.error('❌ Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID in .env.local');
  process.exit(1);
}

if (!API_KEY) {
  console.error('❌ Missing APPWRITE_API_KEY in .env.local');
  console.error('\n💡 To get an API key:');
  console.error('   1. Open Appwrite Console: https://cloud.appwrite.io/console');
  console.error('   2. Go to your project');
  console.error('   3. Navigate to "Settings" → "API Keys"');
  console.error('   4. Create a new API key with "Database" scope');
  console.error('   5. Add to .env.local: APPWRITE_API_KEY=your_key_here\n');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function updateRoleAttribute() {
  console.log('🚀 Updating PROJECT_MEMBERS collection...\n');
  console.log(`   Endpoint: ${ENDPOINT}`);
  console.log(`   Project: ${PROJECT_ID}`);
  console.log(`   Database: ${DATABASE_ID}`);
  console.log(`   Collection: ${COLLECTION_ID}\n`);

  try {
    // Check if collection exists
    console.log('1️⃣  Checking collection...');
    const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
    console.log(`   ✅ Found collection: ${collection.name}\n`);

    // List attributes to find 'role'
    console.log('2️⃣  Finding role attribute...');
    const attributes = collection.attributes;
    const roleAttribute = attributes.find(attr => attr.key === 'role');

    if (!roleAttribute) {
      console.error('   ❌ Role attribute not found in collection');
      process.exit(1);
    }

    console.log(`   ✅ Found role attribute`);
    console.log(`   Current type: ${roleAttribute.type}`);
    console.log(`   Current values: ${JSON.stringify(roleAttribute.elements || 'N/A')}\n`);

    // Check if already has contributor
    if (roleAttribute.elements && roleAttribute.elements.includes('contributor')) {
      console.log('   ✅ Attribute already includes "contributor" role');
      console.log('\n🎉 Collection is already up to date! No changes needed.\n');
      return;
    }

    console.log('3️⃣  Updating role attribute...');
    console.log('   ⚠️  Note: This requires deleting and recreating the attribute');
    console.log('   ⚠️  Make sure no production data relies on this attribute!\n');

    // Since Appwrite doesn't support modifying enum values directly,
    // we need to provide manual instructions
    console.log('❌ Automatic update not possible via API');
    console.log('\n📋 MANUAL STEPS REQUIRED:');
    console.log('═'.repeat(60));
    console.log('\n1. Open Appwrite Console:');
    console.log(`   ${ENDPOINT.replace('/v1', '')}/console`);
    console.log('\n2. Navigate to:');
    console.log('   Database → launchos_db → project_members collection');
    console.log('\n3. Find the "role" attribute and click "Edit"');
    console.log('\n4. Update the enum values to:');
    console.log('   - owner');
    console.log('   - member');
    console.log('   - contributor  ← ADD THIS');
    console.log('\n5. Save the changes');
    console.log('\n6. Verify by checking existing documents still work');
    console.log('\n═'.repeat(60));
    console.log('\n💡 Alternatively, if this is a new project with no data:');
    console.log('   You can delete the attribute and recreate it with:');
    console.log('   elements: ["owner", "member", "contributor"]');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 401) {
      console.error('\n💡 Authentication failed. Check your APPWRITE_API_KEY has "Database" scope.\n');
    } else if (error.code === 404) {
      console.error('\n💡 Collection not found. Check your environment variables:\n');
      console.error(`   DATABASE_ID: ${DATABASE_ID}`);
      console.error(`   COLLECTION_ID: ${COLLECTION_ID}\n`);
    }
    process.exit(1);
  }
}

// Helper function to create attribute if needed (destructive!)
async function recreateRoleAttribute() {
  console.log('\n⚠️  DESTRUCTIVE OPERATION ⚠️');
  console.log('This will DELETE the existing role attribute and recreate it.');
  console.log('ALL EXISTING DATA WILL BE LOST!\n');

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('Type "DELETE AND RECREATE" to confirm: ', async (answer) => {
    if (answer !== 'DELETE AND RECREATE') {
      console.log('\n❌ Aborted. No changes made.\n');
      process.exit(0);
    }

    try {
      // Delete existing attribute
      console.log('\n1️⃣  Deleting existing role attribute...');
      await databases.deleteAttribute(DATABASE_ID, COLLECTION_ID, 'role');
      console.log('   ✅ Deleted\n');

      // Wait a bit for Appwrite to process
      console.log('   ⏳ Waiting 5 seconds for Appwrite to process...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Create new attribute with contributor
      console.log('2️⃣  Creating new role attribute with contributor...');
      await databases.createEnumAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'role',
        ['owner', 'member', 'contributor'],
        true, // required
        'member' // default value
      );
      console.log('   ✅ Created\n');

      console.log('🎉 Successfully updated role attribute!\n');
      console.log('   New values: ["owner", "member", "contributor"]\n');

    } catch (error) {
      console.error('\n❌ Error during recreation:', error.message);
      process.exit(1);
    }

    readline.close();
  });
}

// Main
console.log('\n');
console.log('═'.repeat(60));
console.log('  UPDATE PROJECT_MEMBERS ROLE ATTRIBUTE');
console.log('═'.repeat(60));
console.log('\n');

updateRoleAttribute().catch(console.error);
