/**
 * Read key balance from on-chain bonding curve PDA
 * Integrates with existing curve program
 */

import { PublicKey, Connection } from '@solana/web3.js'
import { connection } from '../config'

// PDA seeds from your curve program
const CURVE_SEED = 'curve'
const KEY_HOLDER_SEED = 'key_holder'

// Your curve program ID
const CURVE_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_CURVE_PROGRAM_ID ||
  '11111111111111111111111111111111' // Replace with actual program ID
)

/**
 * Get Curve PDA for a given owner (e.g., Twitter handle)
 */
export function getCurvePDA(ownerId: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(CURVE_SEED),
      Buffer.from(ownerId)
    ],
    CURVE_PROGRAM_ID
  )
  return pda
}

/**
 * Get KeyHolder PDA for a given curve and holder wallet
 */
export function getKeyHolderPDA(curvePda: PublicKey, holderWallet: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(KEY_HOLDER_SEED),
      curvePda.toBuffer(),
      holderWallet.toBuffer()
    ],
    CURVE_PROGRAM_ID
  )
  return pda
}

/**
 * Parse KeyHolder account data to extract key balance
 *
 * Account structure (from your Anchor program):
 * - discriminator: 8 bytes
 * - curve: 32 bytes (Pubkey)
 * - holder: 32 bytes (Pubkey)
 * - keys_held: 8 bytes (u64)
 * - total_spent: 8 bytes (u64)
 * - total_earned: 8 bytes (u64)
 */
function parseKeyHolderAccount(data: Buffer): number {
  const KEY_BALANCE_OFFSET = 8 + 32 + 32 // After discriminator + curve + holder

  try {
    const keyBalanceBytes = data.slice(
      KEY_BALANCE_OFFSET,
      KEY_BALANCE_OFFSET + 8
    )

    // Read as little-endian u64
    const balance = Number(keyBalanceBytes.readBigUInt64LE(0))

    return balance
  } catch (error) {
    console.error('Failed to parse KeyHolder account:', error)
    return 0
  }
}

/**
 * Get key balance for a wallet address
 */
export async function getKeyBalance(
  walletAddress: string | PublicKey,
  ownerId: string, // e.g., Twitter handle
  customConnection?: Connection
): Promise<number> {
  const conn = customConnection || connection

  try {
    // Convert wallet to PublicKey if string
    const walletPubkey = typeof walletAddress === 'string'
      ? new PublicKey(walletAddress)
      : walletAddress

    // Get PDAs
    const curvePda = getCurvePDA(ownerId)
    const keyHolderPda = getKeyHolderPDA(curvePda, walletPubkey)

    // Fetch account
    const accountInfo = await conn.getAccountInfo(keyHolderPda)

    // If account doesn't exist, user has 0 keys
    if (!accountInfo) {
      return 0
    }

    // Parse and return balance
    return parseKeyHolderAccount(accountInfo.data)

  } catch (error) {
    console.error('Error fetching key balance:', error)
    return 0
  }
}

/**
 * Get key balances for multiple wallets (batch)
 */
export async function getKeyBalancesBatch(
  walletAddresses: Array<string | PublicKey>,
  ownerId: string,
  customConnection?: Connection
): Promise<Map<string, number>> {
  const conn = customConnection || connection
  const balances = new Map<string, number>()

  try {
    const curvePda = getCurvePDA(ownerId)

    // Generate all KeyHolder PDAs
    const pdas = walletAddresses.map(wallet => {
      const walletPubkey = typeof wallet === 'string'
        ? new PublicKey(wallet)
        : wallet

      return {
        wallet: walletPubkey.toBase58(),
        pda: getKeyHolderPDA(curvePda, walletPubkey)
      }
    })

    // Batch fetch all accounts
    const accounts = await conn.getMultipleAccountsInfo(
      pdas.map(p => p.pda)
    )

    // Parse results
    accounts.forEach((account, index) => {
      const { wallet } = pdas[index]

      if (!account) {
        balances.set(wallet, 0)
        return
      }

      const balance = parseKeyHolderAccount(account.data)
      balances.set(wallet, balance)
    })

    return balances

  } catch (error) {
    console.error('Error fetching batch key balances:', error)

    // Return 0 for all wallets on error
    walletAddresses.forEach(wallet => {
      const walletStr = typeof wallet === 'string' ? wallet : wallet.toBase58()
      balances.set(walletStr, 0)
    })

    return balances
  }
}

/**
 * Get all key holders for a curve (for holder count, leaderboards)
 */
export async function getKeyHolders(
  ownerId: string,
  minKeys?: number,
  customConnection?: Connection
): Promise<Array<{ wallet: string; keys: number }>> {
  const conn = customConnection || connection

  try {
    const curvePda = getCurvePDA(ownerId)

    // Get all KeyHolder accounts for this curve
    // Note: This requires getProgramAccounts which can be expensive
    // Consider caching or using a backend indexer for production

    const accounts = await conn.getProgramAccounts(
      CURVE_PROGRAM_ID,
      {
        filters: [
          {
            memcmp: {
              offset: 8, // After discriminator
              bytes: curvePda.toBase58()
            }
          }
        ]
      }
    )

    // Parse all accounts
    const holders = accounts
      .map(({ pubkey, account }) => {
        const balance = parseKeyHolderAccount(account.data)

        // Extract holder wallet (at offset 8 + 32)
        const holderBytes = account.data.slice(8 + 32, 8 + 32 + 32)
        const holderPubkey = new PublicKey(holderBytes)

        return {
          wallet: holderPubkey.toBase58(),
          keys: balance
        }
      })
      .filter(holder => {
        // Filter by minimum keys if specified
        if (minKeys !== undefined) {
          return holder.keys >= minKeys
        }
        return holder.keys > 0 // Always filter out 0 balance
      })
      .sort((a, b) => b.keys - a.keys) // Sort by keys descending

    return holders

  } catch (error) {
    console.error('Error fetching key holders:', error)
    return []
  }
}

/**
 * Check if wallet has minimum required keys
 */
export async function hasMinimumKeys(
  walletAddress: string | PublicKey,
  ownerId: string,
  minimumKeys: number,
  customConnection?: Connection
): Promise<boolean> {
  const balance = await getKeyBalance(walletAddress, ownerId, customConnection)
  return balance >= minimumKeys
}

/**
 * Subscribe to key balance changes (using WebSocket)
 * Returns unsubscribe function
 */
export function subscribeToKeyBalance(
  walletAddress: string | PublicKey,
  ownerId: string,
  callback: (newBalance: number) => void,
  customConnection?: Connection
): () => void {
  const conn = customConnection || connection

  const walletPubkey = typeof walletAddress === 'string'
    ? new PublicKey(walletAddress)
    : walletAddress

  const curvePda = getCurvePDA(ownerId)
  const keyHolderPda = getKeyHolderPDA(curvePda, walletPubkey)

  // Subscribe to account changes
  const subscriptionId = conn.onAccountChange(
    keyHolderPda,
    (accountInfo) => {
      const newBalance = parseKeyHolderAccount(accountInfo.data)
      callback(newBalance)
    },
    'confirmed'
  )

  // Return unsubscribe function
  return () => {
    conn.removeAccountChangeListener(subscriptionId)
  }
}

/**
 * Validate wallet owns keys (for anti-sybil)
 */
export async function validateKeyOwnership(
  walletAddress: string | PublicKey,
  ownerId: string,
  requiredKeys: number,
  minHoldDuration?: number, // Seconds
  customConnection?: Connection
): Promise<{ valid: boolean; reason?: string }> {
  const balance = await getKeyBalance(walletAddress, ownerId, customConnection)

  // Check minimum balance
  if (balance < requiredKeys) {
    return {
      valid: false,
      reason: `Insufficient keys. Have ${balance}, need ${requiredKeys}`
    }
  }

  // TODO: Check hold duration if required
  // This would require indexing key purchase timestamps
  // For now, just return valid if balance check passes

  return { valid: true }
}
