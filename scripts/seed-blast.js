#!/usr/bin/env node
/**
 * BLAST Seed Script - Fixed Schema
 * Populates BLAST with sample data
 *
 * Usage:
 *   node scripts/seed-blast.js              # Seed local
 *   node scripts/seed-blast.js --production # Seed production
 */

const sdk = require('node-appwrite');

// Configuration
const IS_PRODUCTION = process.argv.includes('--production');
const BASE_URL = IS_PRODUCTION
  ? 'https://widgets-for-launch.vercel.app'
  : 'http://localhost:3003';

// Appwrite setup
const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68e34a030010f2321359';
const APPWRITE_API_KEY = 'standard_55e5cb8f8869951e637cc9005d4e2f76b94fb76307905e8ee555c3c52bd2ba6c7eba85edeea800b62cc060a851727ad3b5353a2d47f6867551fea378fa74f5aa2319071ba24358610a1b745de1394c6532c29296967d3381dc7d6d62179645e3ea4a1322e4f6f4769dea0b7ac1dd7706a348116c9eb3738a9fdbfaa6f79c5ece';
const DATABASE_ID = 'launchos_db';

// Collections
const COLLECTIONS = {
  ROOMS: 'blast_rooms',
  APPLICANTS: 'blast_applicants',
  VAULT: 'blast_vault',
  MOTION_SCORES: 'blast_motion_scores',
};

// Initialize Appwrite
const client = new sdk.Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

// Sample data
const SAMPLE_USERS = [
  { id: 'user_alice', name: 'Alice Chen', wallet: 'ALiCe7xK2mN8PqR4sT6vW9yB1cD3fG5hJ7kL9mN2pQ', motionScore: 850, keysHeld: 12 },
  { id: 'user_bob', name: 'Bob Martinez', wallet: 'BoB4mN6pQ8rS1tU3vW5xY7zA9bC2dE4fG6hI8jK1lM', motionScore: 720, keysHeld: 8 },
  { id: 'user_carol', name: 'Carol Wang', wallet: 'CaRoL9pQ2rS4tU6vW8xY1zA3bC5dE7fG9hI2jK4lMn', motionScore: 650, keysHeld: 15 },
  { id: 'user_dave', name: 'Dave Johnson', wallet: 'DaVe3rS5tU7vW9xY2zA4bC6dE8fG1hI3jK5lM7nO9p', motionScore: 580, keysHeld: 6 },
  { id: 'user_eve', name: 'Eve Patel', wallet: 'EvE7tU9vW2xY4zA6bC8dE1fG3hI5jK7lM9nO2pQ4rS', motionScore: 920, keysHeld: 20 },
];

const SAMPLE_ROOMS = [
  {
    type: 'deal',
    title: 'Seed Round for AI SaaS Platform',
    description: 'Looking for strategic investors for our AI-powered sales automation platform. $500k raise at $5M valuation. Strong traction with 50+ enterprise clients.',
    creatorId: 'user_alice',
    duration: '72h',
    totalSlots: 8,
    tags: ['ai', 'saas', 'seed-round'],
  },
  {
    type: 'airdrop',
    title: 'Early Supporter Token Airdrop',
    description: '10,000 tokens distributed to first 50 community members. Must hold minimum 3 keys and have Motion Score above 500.',
    creatorId: 'user_eve',
    duration: '48h',
    totalSlots: 50,
    tags: ['airdrop', 'community', 'rewards'],
  },
  {
    type: 'job',
    title: 'Senior Solana Developer',
    description: 'Building next-gen DeFi protocol on Solana. Need experienced Rust/Anchor developer. Remote OK. Equity + competitive salary.',
    creatorId: 'user_bob',
    duration: '72h',
    totalSlots: 5,
    tags: ['solana', 'rust', 'defi'],
  },
  {
    type: 'collab',
    title: 'NFT Collection Partnership',
    description: 'Established NFT project (5k holders) seeking collaboration with gaming studio for P2E integration.',
    creatorId: 'user_carol',
    duration: '48h',
    totalSlots: 3,
    tags: ['nft', 'gaming', 'p2e'],
  },
  {
    type: 'funding',
    title: 'Pre-seed for Climate Tech Startup',
    description: 'Carbon credit marketplace on blockchain. $250k pre-seed round. Former Google/Tesla engineers. Revenue generating.',
    creatorId: 'user_dave',
    duration: '72h',
    totalSlots: 6,
    tags: ['climate', 'pre-seed', 'impact'],
  },
];

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
  };
  const reset = '\x1b[0m';
  console.log(`${colors[type]}${message}${reset}`);
}

async function clearCollection(collectionId, collectionName) {
  try {
    log(`Clearing ${collectionName}...`, 'info');
    const response = await databases.listDocuments(DATABASE_ID, collectionId);

    for (const doc of response.documents) {
      await databases.deleteDocument(DATABASE_ID, collectionId, doc.$id);
    }

    log(`✓ Cleared ${response.total} documents from ${collectionName}`, 'success');
  } catch (error) {
    log(`✗ Failed to clear ${collectionName}: ${error.message}`, 'error');
  }
}

async function seedMotionScores() {
  log('\n[1/4] Seeding Motion Scores...', 'info');

  for (const user of SAMPLE_USERS) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.MOTION_SCORES,
        user.id,
        {
          userId: user.id,
          currentScore: user.motionScore,
          baseScore: Math.floor(user.motionScore * 0.8),
          decayAmount: user.motionScore * 0.02, // 2% decay
          tau: 72, // 72 hours decay constant
          lastDecayAt: new Date().toISOString(),
          peakScore: user.motionScore,
          updatedAt: new Date().toISOString(),
        }
      );
      log(`  ✓ Created Motion Score for ${user.name} (${user.motionScore})`, 'success');
    } catch (error) {
      log(`  ✗ Failed to create Motion Score for ${user.name}: ${error.message}`, 'error');
    }
  }
}

async function seedVaults() {
  log('\n[2/4] Seeding Vaults...', 'info');

  for (const user of SAMPLE_USERS) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.VAULT,
        user.id,
        {
          userId: user.id,
          walletAddress: user.wallet,
          totalLocked: user.keysHeld,
          totalEarned: Math.floor(Math.random() * 10000), // 0-10000 points earned
          activeRooms: Math.floor(Math.random() * 3), // 0-2 active rooms
          lifetimeRooms: Math.floor(Math.random() * 20) + 5, // 5-24 lifetime rooms
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      log(`  ✓ Created Vault for ${user.name} (${user.keysHeld} keys)`, 'success');
    } catch (error) {
      log(`  ✗ Failed to create Vault for ${user.name}: ${error.message}`, 'error');
    }
  }
}

async function seedRooms() {
  log('\n[3/4] Seeding Rooms...', 'info');

  const createdRooms = [];

  for (let i = 0; i < SAMPLE_ROOMS.length; i++) {
    const room = SAMPLE_ROOMS[i];
    const creator = SAMPLE_USERS.find(u => u.id === room.creatorId);

    try {
      // Calculate end time based on duration
      const durationHours = room.duration === '24h' ? 24 : room.duration === '48h' ? 48 : 72;
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + durationHours);

      const roomDoc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ROOMS,
        sdk.ID.unique(),
        {
          type: room.type,
          title: room.title,
          description: room.description,
          tags: room.tags,
          creatorId: creator.id,
          creatorName: creator.name,
          creatorMotionScore: creator.motionScore,
          status: 'open',
          duration: room.duration,
          minKeys: 1,
          totalSlots: room.totalSlots,
          filledSlots: Math.floor(Math.random() * 2), // 0-1 filled
          applicantCount: Math.floor(Math.random() * 5), // 0-4 applicants
          acceptedCount: Math.floor(Math.random() * 2),
          watcherCount: Math.floor(Math.random() * 20),
          totalKeysLocked: Math.floor(Math.random() * 30),
          motionScore: Math.floor(Math.random() * 500) + 200,
          extended: false,
          startTime: new Date().toISOString(),
          endTime: endTime.toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      createdRooms.push(roomDoc);
      log(`  ✓ Created ${room.type} room: "${room.title}"`, 'success');
    } catch (error) {
      log(`  ✗ Failed to create room "${room.title}": ${error.message}`, 'error');
    }
  }

  return createdRooms;
}

async function seedApplicants(rooms) {
  log('\n[4/4] Seeding Applicants...', 'info');

  let applicantCount = 0;

  for (const room of rooms) {
    // Each room gets 2-4 random applicants
    const numApplicants = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < numApplicants; i++) {
      const applicant = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)];

      // Don't apply to own room
      if (applicant.id === room.creatorId) continue;

      try {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.APPLICANTS,
          sdk.ID.unique(),
          {
            roomId: room.$id,
            userId: applicant.id,
            userName: applicant.name,
            userMotionScore: applicant.motionScore,
            status: ['pending', 'pending', 'accepted'][Math.floor(Math.random() * 3)],
            message: `I'm interested in this ${room.type} opportunity. I have ${applicant.keysHeld} keys and a Motion Score of ${applicant.motionScore}.`,
            keysStaked: Math.floor(Math.random() * 5) + 1,
            priorityScore: Math.floor(Math.random() * 1000),
            depositAmount: 0,
            depositRefunded: false,
            depositForfeit: false,
            lockId: `lock_${sdk.ID.unique()}`,
            activityCount: Math.floor(Math.random() * 10),
            lastActiveAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
            appliedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            respondedAt: null,
          }
        );
        applicantCount++;
      } catch (error) {
        // Skip duplicate applications
        if (!error.message.includes('unique')) {
          log(`  ✗ Failed to create applicant: ${error.message}`, 'error');
        }
      }
    }
  }

  log(`  ✓ Created ${applicantCount} applicants across ${rooms.length} rooms`, 'success');
}

async function main() {
  console.log(`
╔════════════════════════════════════════╗
║  BLAST Seed Script                     ║
╚════════════════════════════════════════╝

Environment: ${IS_PRODUCTION ? 'PRODUCTION' : 'LOCAL'}
Database: ${DATABASE_ID}

  `);

  try {
    // Clear existing data
    log('Clearing existing data...', 'warn');
    await clearCollection(COLLECTIONS.ROOMS, 'Rooms');
    await clearCollection(COLLECTIONS.APPLICANTS, 'Applicants');
    await clearCollection(COLLECTIONS.MOTION_SCORES, 'Motion Scores');
    await clearCollection(COLLECTIONS.VAULT, 'Vaults');

    // Seed new data
    await seedMotionScores();
    await seedVaults();
    const rooms = await seedRooms();
    await seedApplicants(rooms);

    console.log(`
╔════════════════════════════════════════╗
║  Seed Complete!                        ║
╚════════════════════════════════════════╝

Summary:
  ✓ ${SAMPLE_USERS.length} Motion Scores
  ✓ ${SAMPLE_USERS.length} Vaults
  ✓ ${rooms.length} Rooms
  ✓ ~${rooms.length * 3} Applicants

Next Steps:
  1. Visit: ${BASE_URL}/BLAST
  2. Browse rooms and leaderboard
  3. Test application flow

Test the API:
  curl ${BASE_URL}/api/blast/rooms
  curl ${BASE_URL}/api/blast/leaderboard
    `);

  } catch (error) {
    log(`\n✗ Seed failed: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

main();
