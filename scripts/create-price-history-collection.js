/**
 * Script to create the price_history collection in Appwrite
 * Run with: node scripts/create-price-history-collection.js
 */

const { Client, Databases, Permission, Role } = require('node-appwrite');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');

  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found at:', envPath);
    process.exit(1);
  }

  const envFile = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envFile.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      if (key && value) {
        env[key.trim()] = value;
      }
    }
  });

  return env;
}

const env = loadEnv();

// Configuration
const ENDPOINT = env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = env.APPWRITE_API_KEY;
const DATABASE_ID = env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db';
const COLLECTION_ID = 'price_history';

async function createPriceHistoryCollection() {
  console.log('🚀 Creating price_history collection in Appwrite...\n');

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  const databases = new Databases(client);

  try {
    // Step 1: Create Collection
    console.log('📦 Step 1: Creating collection...');
    const collection = await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Price History',
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
      ],
      false, // documentSecurity
      true   // enabled
    );
    console.log('✅ Collection created:', collection.$id);
    console.log('');

    // Step 2: Create Attributes
    console.log('📝 Step 2: Creating attributes...');

    // Attribute 1: curveId (String)
    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'curveId',
      256,
      true // required
    );
    console.log('  ✅ Created attribute: curveId (String, 256, required)');

    // Wait a bit between attribute creations
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Attribute 2: supply (Float/Double)
    await databases.createFloatAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'supply',
      true, // required
      null, // min
      null, // max
      null  // default
    );
    console.log('  ✅ Created attribute: supply (Float, required)');

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Attribute 3: price (Float/Double)
    await databases.createFloatAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'price',
      true, // required
      null, // min
      null, // max
      null  // default
    );
    console.log('  ✅ Created attribute: price (Float, required)');

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Attribute 4: timestamp (String)
    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'timestamp',
      256,
      true // required
    );
    console.log('  ✅ Created attribute: timestamp (String, 256, required)');
    console.log('');

    // Wait for attributes to be available
    console.log('⏳ Waiting for attributes to be available...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 3: Create Indexes
    console.log('🔍 Step 3: Creating indexes...');

    // Index 1: curveId
    try {
      await databases.createIndex(
        DATABASE_ID,
        COLLECTION_ID,
        'curveId_idx',
        'key',
        ['curveId'],
        ['ASC']
      );
      console.log('  ✅ Created index: curveId_idx');
    } catch (error) {
      console.log('  ⚠️  Index curveId_idx may already exist or attributes not ready');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Index 2: timestamp
    try {
      await databases.createIndex(
        DATABASE_ID,
        COLLECTION_ID,
        'timestamp_idx',
        'key',
        ['timestamp'],
        ['DESC']
      );
      console.log('  ✅ Created index: timestamp_idx');
    } catch (error) {
      console.log('  ⚠️  Index timestamp_idx may already exist or attributes not ready');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Index 3: Composite (curveId + timestamp)
    try {
      await databases.createIndex(
        DATABASE_ID,
        COLLECTION_ID,
        'curve_time_idx',
        'key',
        ['curveId', 'timestamp'],
        ['ASC', 'DESC']
      );
      console.log('  ✅ Created index: curve_time_idx (composite)');
    } catch (error) {
      console.log('  ⚠️  Index curve_time_idx may already exist or attributes not ready');
    }

    console.log('');
    console.log('🎉 SUCCESS! Price history collection created successfully!');
    console.log('');
    console.log('📋 Collection Details:');
    console.log('  • Database ID:', DATABASE_ID);
    console.log('  • Collection ID:', COLLECTION_ID);
    console.log('  • Attributes: 4 (curveId, supply, price, timestamp)');
    console.log('  • Indexes: 3 (curveId_idx, timestamp_idx, curve_time_idx)');
    console.log('');
    console.log('✨ You can now:');
    console.log('  1. Buy/sell keys to record price snapshots');
    console.log('  2. View 24h price changes after 24 hours of trading');
    console.log('  3. Check the Appwrite console to see recorded snapshots');
    console.log('');

  } catch (error) {
    if (error.code === 409) {
      console.error('❌ Error: Collection already exists!');
      console.log('');
      console.log('The price_history collection already exists in your database.');
      console.log('If you need to recreate it:');
      console.log('  1. Go to Appwrite Console');
      console.log('  2. Delete the existing price_history collection');
      console.log('  3. Run this script again');
    } else {
      console.error('❌ Error creating collection:', error.message);
      console.error('');
      console.error('Details:', error);
      console.log('');
      console.log('Troubleshooting:');
      console.log('  • Check your .env.local file has correct Appwrite credentials');
      console.log('  • Ensure APPWRITE_API_KEY has sufficient permissions');
      console.log('  • Verify DATABASE_ID exists in your Appwrite project');
    }
    process.exit(1);
  }
}

// Run the script
console.log('');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║   Appwrite Price History Collection Setup Script          ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');
console.log('📌 Configuration:');
console.log('  • Endpoint:', ENDPOINT);
console.log('  • Project:', PROJECT_ID);
console.log('  • Database:', DATABASE_ID);
console.log('  • Collection:', COLLECTION_ID);
console.log('');

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error('❌ Missing required environment variables!');
  console.error('');
  console.error('Please ensure your .env.local file contains:');
  console.error('  • NEXT_PUBLIC_APPWRITE_ENDPOINT');
  console.error('  • NEXT_PUBLIC_APPWRITE_PROJECT_ID');
  console.error('  • APPWRITE_API_KEY');
  console.error('');
  console.error('Current values:');
  console.error('  • ENDPOINT:', ENDPOINT || 'NOT SET');
  console.error('  • PROJECT_ID:', PROJECT_ID || 'NOT SET');
  console.error('  • API_KEY:', API_KEY ? '[SET]' : 'NOT SET');
  console.error('');
  process.exit(1);
}

createPriceHistoryCollection().catch(console.error);
