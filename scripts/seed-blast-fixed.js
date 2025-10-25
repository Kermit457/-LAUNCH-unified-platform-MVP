#!/usr/bin/env node
const sdk = require('node-appwrite');

const IS_PRODUCTION = process.argv.includes('--production');
const BASE_URL = IS_PRODUCTION ? 'https://widgets-for-launch.vercel.app' : 'http://localhost:3003';

const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68e34a030010f2321359';
const APPWRITE_API_KEY = 'standard_55e5cb8f8869951e637cc9005d4e2f76b94fb76307905e8ee555c3c52bd2ba6c7eba85edeea800b62cc060a851727ad3b5353a2d47f6867551fea378fa74f5aa2319071ba24358610a1b745de1394c6532c29296967d3381dc7d6d62179645e3ea4a1322e4f6f4769dea0b7ac1dd7706a348116c9eb3738a9fdbfaa6f79c5ece';
const DATABASE_ID = 'launchos_db';

const COLLECTIONS = {
  ROOMS: 'blast_rooms',
  APPLICANTS: 'blast_applicants',
  VAULT: 'blast_vault',
  MOTION_SCORES: 'blast_motion_scores',
};

const client = new sdk.Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

const SAMPLE_USERS = [
  { id: 'user_alice', name: 'Alice Chen', wallet: 'ALiCe7xK2mN8PqR4sT6vW9yB', motionScore: 850, keysHeld: 12 },
  { id: 'user_bob', name: 'Bob Martinez', wallet: 'BoB4mN6pQ8rS1tU3vW5xY7', motionScore: 720, keysHeld: 8 },
  { id: 'user_carol', name: 'Carol Wang', wallet: 'CaRoL9pQ2rS4tU6vW8xY1', motionScore: 650, keysHeld: 15 },
  { id: 'user_dave', name: 'Dave Johnson', wallet: 'DaVe3rS5tU7vW9xY2zA4', motionScore: 580, keysHeld: 6 },
  { id: 'user_eve', name: 'Eve Patel', wallet: 'EvE7tU9vW2xY4zA6bC8d', motionScore: 920, keysHeld: 20 },
];

const SAMPLE_ROOMS = [
  {
    type: 'deal',
    title: 'Seed Round for AI SaaS Platform',
    description: 'Looking for strategic investors for our AI-powered sales automation platform. $500k raise at $5M valuation.',
    creatorId: 'user_alice',
    duration: '72h',
    totalSlots: 8,
    tags: ['ai', 'saas', 'seed-round'],
  },
  {
    type: 'airdrop',
    title: 'Early Supporter Token Airdrop',
    description: '10,000 tokens distributed to first 50 community members.',
    creatorId: 'user_eve',
    duration: '48h',
    totalSlots: 50,
    tags: ['airdrop', 'community'],
  },
  {
    type: 'job',
    title: 'Senior Solana Developer',
    description: 'Building next-gen DeFi protocol on Solana. Remote OK.',
    creatorId: 'user_bob',
    duration: '72h',
    totalSlots: 5,
    tags: ['solana', 'rust', 'defi'],
  },
];

function log(message, type = 'info') {
  const colors = { info: '\x1b[36m', success: '\x1b[32m', error: '\x1b[31m', warn: '\x1b[33m' };
  console.log(`${colors[type]}${message}\x1b[0m`);
}

async function clearCollection(collectionId, name) {
  try {
    const response = await databases.listDocuments(DATABASE_ID, collectionId);
    for (const doc of response.documents) {
      await databases.deleteDocument(DATABASE_ID, collectionId, doc.$id);
    }
    log(`✓ Cleared ${response.total} documents from ${name}`, 'success');
  } catch (error) {
    log(`✗ Error clearing ${name}: ${error.message}`, 'error');
  }
}

async function seedMotionScores() {
  log('\n[1/4] Seeding Motion Scores...', 'info');
  for (const user of SAMPLE_USERS) {
    try {
      await databases.createDocument(DATABASE_ID, COLLECTIONS.MOTION_SCORES, user.id, {
        userId: user.id,
        currentScore: user.motionScore,
        baseScore: Math.floor(user.motionScore * 0.8),
        decayAmount: Math.floor(user.motionScore * 0.2),
        tau: 7,
        lastDecayAt: new Date().toISOString(),
        signals: {
          room_created: Math.floor(Math.random() * 100),
          applicant_accepted: Math.floor(Math.random() * 50),
        },
        updatedAt: new Date().toISOString(),
      });
      log(`  ✓ ${user.name} (${user.motionScore})`, 'success');
    } catch (error) {
      log(`  ✗ ${user.name}: ${error.message}`, 'error');
    }
  }
}

async function seedVaults() {
  log('\n[2/4] Seeding Vaults...', 'info');
  for (const user of SAMPLE_USERS) {
    try {
      await databases.createDocument(DATABASE_ID, COLLECTIONS.VAULT, user.id, {
        userId: user.id,
        walletAddress: user.wallet,
        totalKeysLocked: user.keysHeld,
        solBalance: Math.floor(Math.random() * 5000) / 100,
        usdcBalance: Math.floor(Math.random() * 10000) / 100,
        pointsBalance: Math.floor(Math.random() * 5000),
        fromRooms: Math.floor(Math.random() * 2000),
        fromIntros: Math.floor(Math.random() * 1000),
        fromReferrals: Math.floor(Math.random() * 1500),
        fromCurating: Math.floor(Math.random() * 1500),
        pendingRefunds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      log(`  ✓ ${user.name} (${user.keysHeld} keys)`, 'success');
    } catch (error) {
      log(`  ✗ ${user.name}: ${error.message}`, 'error');
    }
  }
}

async function seedRooms() {
  log('\n[3/4] Seeding Rooms...', 'info');
  const createdRooms = [];
  for (const room of SAMPLE_ROOMS) {
    const creator = SAMPLE_USERS.find(u => u.id === room.creatorId);
    const durationHours = room.duration === '24h' ? 24 : room.duration === '48h' ? 48 : 72;
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + durationHours);

    try {
      const roomDoc = await databases.createDocument(DATABASE_ID, COLLECTIONS.ROOMS, sdk.ID.unique(), {
        type: room.type,
        title: room.title,
        description: room.description,
        tags: room.tags,
        creatorId: creator.id,
        creatorName: creator.name,
        creatorMotionScore: creator.motionScore,
        totalSlots: room.totalSlots,
        filledSlots: 0,
        minKeysToApply: 1,
        minKeysToCurate: 5,
        entryDeposit: 0,
        status: 'open',
        startTime: new Date().toISOString(),
        endTime: endTime.toISOString(),
        extended: false,
        motionScore: Math.floor(Math.random() * 500) + 200,
        applicantCount: 0,
        acceptedCount: 0,
        watcherCount: Math.floor(Math.random() * 20),
        totalKeysLocked: 0,
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      createdRooms.push(roomDoc);
      log(`  ✓ ${room.type}: "${room.title}"`, 'success');
    } catch (error) {
      log(`  ✗ "${room.title}": ${error.message}`, 'error');
    }
  }
  return createdRooms;
}

async function seedApplicants(rooms) {
  log('\n[4/4] Seeding Applicants...', 'info');
  let count = 0;
  for (const room of rooms) {
    const numApplicants = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numApplicants; i++) {
      const applicant = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)];
      if (applicant.id === room.creatorId) continue;

      try {
        await databases.createDocument(DATABASE_ID, COLLECTIONS.APPLICANTS, sdk.ID.unique(), {
          roomId: room.$id,
          applicantId: applicant.id,
          applicantName: applicant.name,
          applicantMotionScore: applicant.motionScore,
          keysLocked: Math.floor(Math.random() * 5) + 1,
          status: 'pending',
          pitch: `Interested in this ${room.type} opportunity.`,
          appliedAt: new Date().toISOString(),
          respondedAt: null,
          updatedAt: new Date().toISOString(),
        });
        count++;
      } catch (error) {
        // Skip duplicates
      }
    }
  }
  log(`  ✓ Created ${count} applicants`, 'success
