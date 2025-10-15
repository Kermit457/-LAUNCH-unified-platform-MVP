/**
 * Curve System Type Definitions
 * Unified bonding curve architecture for creators and projects
 */

export type CurveOwnerType = 'user' | 'project'
export type CurveState = 'active' | 'frozen' | 'launched' | 'utility'
export type CurveEventType = 'buy' | 'sell' | 'freeze' | 'launch'

/**
 * Main Curve entity - shared by both users and projects
 */
export interface Curve {
  id: string
  ownerType: CurveOwnerType
  ownerId: string
  state: CurveState

  // Pricing & Supply
  price: number           // Current key price
  reserve: number         // Total reserve (94% of trades)
  supply: number          // Total keys in circulation
  holders: number         // Number of unique holders

  // Volume metrics
  volume24h: number       // 24h trading volume
  volumeTotal: number     // All-time volume
  marketCap: number       // supply * price
  priceChange24h?: number | null // 24h price change percentage

  // Fee configuration (immutable)
  feeSplit: {
    reserve: number     // 0.94 (94%)
    project: number     // 0.03 (3%)
    platform: number    // 0.02 (2%)
    referral: number    // 0.01 (1%)
  }

  // Post-launch data
  tokenMint?: string      // SPL token address after launch
  launchedAt?: string     // Launch timestamp

  // Metadata
  createdAt: string
  updatedAt?: string
}

/**
 * Curve trading event
 */
export interface CurveEvent {
  id: string
  curveId: string
  type: CurveEventType

  // Trade details
  amount: number          // USD amount
  price: number           // Price at time of trade
  keys?: number           // Number of keys traded

  // Participants
  userId: string          // Buyer/seller
  referrerId?: string     // Referrer (for buys)

  // Fee breakdown (for buys)
  reserveFee?: number     // 94% to reserve
  projectFee?: number     // 3% to project
  platformFee?: number    // 2% to platform
  referralFee?: number    // 1% to referrer/pool

  // Blockchain
  txHash?: string         // Transaction hash (future)
  timestamp: string
}

/**
 * Curve holder record
 */
export interface CurveHolder {
  id: string
  curveId: string
  userId: string

  // Position
  balance: number         // Current key balance
  avgPrice: number        // Average buy price
  totalInvested: number   // Total USD invested

  // P&L tracking
  realizedPnl: number     // Profit/loss from sells
  unrealizedPnl: number   // Paper gains/losses

  // Activity
  firstBuyAt: string
  lastTradeAt: string
}

/**
 * Launch snapshot for airdrop
 */
export interface Snapshot {
  id: string
  curveId: string
  merkleRoot: string      // For on-chain verification

  // Holder data at snapshot
  holdersData: {
    address: string
    balance: number
    percentage: number
  }[]

  totalSupply: number
  totalHolders: number
  createdAt: string
}

/**
 * Curve statistics for display
 */
export interface CurveStats {
  price: number
  priceChange24h: number
  priceChange7d: number

  holders: number
  holdersChange24h: number

  volume24h: number
  volume7d: number
  volumeTotal: number

  marketCap: number
  reserve: number

  topHolders: {
    userId: string
    username?: string
    balance: number
    percentage: number
  }[]
}

/**
 * Trade calculation result
 */
export interface TradeCalculation {
  action: 'buy' | 'sell'
  amount: number          // USD amount
  keys: number            // Keys to receive/sell
  price: number           // Current price
  priceAfter: number      // Price after trade
  priceImpact: number     // % price impact
  pricePerKey: number     // Average price per key for this trade
  totalCost: number       // Total cost including fees
  slippage: number        // Slippage %

  // Fee breakdown V4 (buy only)
  fees?: {
    reserve: number
    instant: number      // 4% to referrer OR creator
    platform: number     // 1% to platform
    buyback: number      // 1% to buyback & burn
    total: number
  }

  // Warnings
  warnings?: string[]
}

/**
 * Launch configuration
 */
export interface LaunchConfig {
  curveId: string

  // Token parameters
  name: string
  symbol: string
  decimals: number
  totalSupply: number

  // Distribution
  holderAllocation: number  // % to holders
  lpAllocation: number      // % to LP
  treasuryAllocation: number // % to treasury

  // LP settings
  initialLiquidity: number  // USD from reserve
  lpLockDuration: number    // Days to lock LP
}

/**
 * Curve chart data point
 */
export interface ChartDataPoint {
  timestamp: number
  price: number
  volume: number
  holders: number
  marketCap: number
}

/**
 * Bonding curve formula parameters
 */
export interface CurveFormula {
  type: 'linear' | 'exponential' | 'sigmoid'

  // Linear: price = basePrice + (supply * slope)
  // Exponential: price = basePrice * (1 + rate) ^ supply
  // Sigmoid: S-curve with slow start and end

  basePrice: number
  slope?: number          // For linear
  rate?: number           // For exponential
  maxSupply?: number      // Optional cap
}

/**
 * User with curve data
 */
export interface UserWithCurve {
  id: string
  username: string
  handle: string
  avatar?: string
  bio?: string

  // Curve data
  curveId?: string
  curve?: Curve
  curveStats?: CurveStats

  // Social
  followersCount: number
  followingCount: number
  isVerified: boolean
}

/**
 * Project with curve data
 */
export interface ProjectWithCurve {
  id: string
  slug: string
  name: string
  description: string
  logo?: string

  // Curve data
  curveId?: string
  curve?: Curve
  curveStats?: CurveStats

  // Metadata
  category: string
  tags: string[]
  website?: string
  twitter?: string
}

/**
 * Curve filter/sort options
 */
export interface CurveFilters {
  ownerType?: CurveOwnerType
  state?: CurveState
  minPrice?: number
  maxPrice?: number
  minHolders?: number
  minVolume24h?: number
  searchQuery?: string
}

export interface CurveSortBy {
  field: 'price' | 'holders' | 'volume24h' | 'marketCap' | 'createdAt'
  direction: 'asc' | 'desc'
}

/**
 * Curve API responses
 */
export interface CurveListResponse {
  curves: (Curve & {
    owner?: UserWithCurve | ProjectWithCurve
    stats?: CurveStats
  })[]
  total: number
  page: number
  limit: number
}

export interface CurveTradeResponse {
  success: boolean
  curve: Curve
  event: CurveEvent
  holder: CurveHolder
  txHash?: string
  message?: string
}

export interface CurveLaunchResponse {
  success: boolean
  curve: Curve
  snapshot: Snapshot
  tokenMint: string
  lpAddress?: string
  airdropTx?: string
}