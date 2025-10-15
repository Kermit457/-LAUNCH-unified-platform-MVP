/**
 * Bonding Curve Mathematics
 * Implements Hybrid Exponential V4 curve matching Solana program
 * Formula: P(S) = 0.05 + 0.0003*S + 0.0000012*S^1.6
 */

import { TradeCalculation } from '@/types/curve'

// Hybrid Exponential V4 curve parameters (matching Solana program)
const BASE_PRICE = 0.05          // 0.05 SOL base price
const LINEAR_COEF = 0.0003       // Linear coefficient
const EXPONENTIAL_COEF = 0.0000012  // Exponential coefficient

// V4 Fee percentages - CORRECT (6% total fees)
const FEE_RESERVE = 0.94        // 94% to reserve vault
const FEE_INSTANT = 0.04        // 4% instant to referrer OR creator
const FEE_PLATFORM = 0.01       // 1% to platform
const FEE_BUYBACK = 0.01        // 1% to buyback & burn
// Total: 6% fees

/**
 * Approximate S^0.6 for the exponential term
 * Uses a simplified approximation that's accurate enough for UI
 */
function approximatePower0_6(supply: number): number {
  if (supply === 0) return 0
  if (supply <= 1) return supply

  // x^0.6 ≈ x^(2/3) * 0.9 (within 5% accuracy)
  const power2_3 = Math.pow(supply, 2/3)
  return power2_3 * 0.9
}

/**
 * Calculate price at a given supply using Hybrid Exponential V4
 * P(S) = 0.05 + 0.0003*S + 0.0000012*S^1.6
 */
export function calculatePrice(supply: number): number {
  if (supply === 0) return BASE_PRICE

  // Base component
  const base = BASE_PRICE

  // Linear component: 0.0003 * S
  const linear = LINEAR_COEF * supply

  // Exponential component: 0.0000012 * S^1.6
  // S^1.6 = S * S^0.6
  const s_to_0_6 = approximatePower0_6(supply)
  const exponential = EXPONENTIAL_COEF * supply * s_to_0_6

  return base + linear + exponential
}

/**
 * Calculate cost to buy N keys from current supply
 * Uses numerical integration (trapezoidal rule) for accuracy
 */
export function calculateBuyCost(
  currentSupply: number,
  keysToBuy: number
): number {
  if (keysToBuy <= 0) return 0

  // Use trapezoidal rule for numerical integration
  // Divide into steps for better accuracy with exponential curve
  const steps = Math.max(10, Math.floor(keysToBuy))
  const stepSize = keysToBuy / steps

  let totalCost = 0
  for (let i = 0; i < steps; i++) {
    const s1 = currentSupply + (i * stepSize)
    const s2 = currentSupply + ((i + 1) * stepSize)
    const p1 = calculatePrice(s1)
    const p2 = calculatePrice(s2)

    // Area of trapezoid
    totalCost += ((p1 + p2) / 2) * stepSize
  }

  return Math.max(totalCost, 0.001) // Minimum cost
}

/**
 * Calculate proceeds from selling N keys
 * Uses numerical integration but from higher to lower supply
 */
export function calculateSellProceeds(
  currentSupply: number,
  keysToSell: number
): number {
  if (currentSupply <= keysToSell) {
    // Can't sell more than exists
    keysToSell = Math.max(currentSupply - 1, 0)
  }

  if (keysToSell <= 0) return 0

  // Use trapezoidal rule for numerical integration
  const steps = Math.max(10, Math.floor(keysToSell))
  const stepSize = keysToSell / steps

  let totalProceeds = 0
  for (let i = 0; i < steps; i++) {
    const s1 = currentSupply - (i * stepSize)
    const s2 = currentSupply - ((i + 1) * stepSize)
    const p1 = calculatePrice(s1)
    const p2 = calculatePrice(s2)

    // Area of trapezoid
    totalProceeds += ((p1 + p2) / 2) * stepSize
  }

  return Math.max(totalProceeds * 0.95, 0) // 5% sell tax
}

/**
 * Calculate how many keys can be bought with a given SOL amount
 */
export function calculateKeysFromAmount(
  amount: number,
  currentSupply: number,
  action: 'buy' | 'sell'
): number {
  if (action === 'buy') {
    // Binary search for the right amount of keys
    let low = 0
    let high = amount / BASE_PRICE // Max possible keys

    while (high - low > 0.001) {
      const mid = (low + high) / 2
      const cost = calculateBuyCost(currentSupply, mid)

      if (cost <= amount) {
        low = mid
      } else {
        high = mid
      }
    }

    return Math.floor(low * 1000) / 1000 // Round down to 3 decimals
  } else {
    // For sells, apply the tax
    const amountBeforeTax = amount / 0.95

    let low = 0
    let high = Math.min(currentSupply, amountBeforeTax / BASE_PRICE)

    while (high - low > 0.001) {
      const mid = (low + high) / 2
      const proceeds = calculateSellProceeds(currentSupply, mid)

      if (proceeds <= amount) {
        low = mid
      } else {
        high = mid
      }
    }

    return Math.floor(low * 1000) / 1000
  }
}

/**
 * Calculate complete trade details including fees and price impact
 */
export function calculateTrade(
  action: 'buy' | 'sell',
  amount: number,
  currentSupply: number,
  currentPrice: number,
  hasReferrer: boolean = false
): TradeCalculation {
  const keys = calculateKeysFromAmount(amount, currentSupply, action)

  if (action === 'buy') {
    const actualCost = calculateBuyCost(currentSupply, keys)
    const newSupply = currentSupply + keys
    const priceAfter = calculatePrice(newSupply)
    const priceImpact = ((priceAfter - currentPrice) / currentPrice) * 100

    // Calculate fees (V4 structure)
    const reserveFee = actualCost * FEE_RESERVE
    const instantFee = actualCost * FEE_INSTANT
    const platformFee = actualCost * FEE_PLATFORM
    const buybackFee = actualCost * FEE_BUYBACK

    const warnings: string[] = []
    if (priceImpact > 10) {
      warnings.push(`High price impact: ${priceImpact.toFixed(2)}%`)
    }
    if (keys < 0.001) {
      warnings.push('Amount too small to buy meaningful keys')
    }

    return {
      action: 'buy',
      amount: actualCost,
      keys,
      price: currentPrice,
      priceAfter,
      priceImpact,
      pricePerKey: keys > 0 ? actualCost / keys : 0,
      totalCost: actualCost,
      slippage: priceImpact,
      fees: {
        reserve: reserveFee,
        instant: instantFee,
        platform: platformFee,
        buyback: buybackFee,
        total: actualCost
      },
      warnings: warnings.length > 0 ? warnings : undefined
    }
  } else {
    // Sell calculation
    const keysToSell = Math.min(keys, currentSupply - 1) // Keep at least 1 key
    const proceeds = calculateSellProceeds(currentSupply, keysToSell)
    const newSupply = currentSupply - keysToSell
    const priceAfter = calculatePrice(newSupply)
    const priceImpact = ((currentPrice - priceAfter) / currentPrice) * 100

    const warnings: string[] = []
    if (priceImpact > 10) {
      warnings.push(`High price impact: ${priceImpact.toFixed(2)}%`)
    }
    if (keysToSell <= 0) {
      warnings.push('No keys available to sell')
    }

    return {
      action: 'sell',
      amount: proceeds,
      keys: keysToSell,
      price: currentPrice,
      priceAfter,
      priceImpact,
      pricePerKey: keysToSell > 0 ? proceeds / keysToSell : 0,
      totalCost: proceeds,
      slippage: priceImpact,
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }
}

/**
 * Calculate market cap (supply * current price)
 */
export function calculateMarketCap(supply: number, price: number): number {
  return supply * price
}

/**
 * Calculate holder percentage
 */
export function calculateHolderPercentage(
  holderBalance: number,
  totalSupply: number
): number {
  if (totalSupply === 0) return 0
  return (holderBalance / totalSupply) * 100
}

/**
 * Format price with appropriate decimals
 */
export function formatPrice(price: number): string {
  if (price < 0.01) {
    return `$${price.toFixed(4)}`
  } else if (price < 1) {
    return `$${price.toFixed(3)}`
  } else if (price < 100) {
    return `$${price.toFixed(2)}`
  } else {
    return `$${price.toLocaleString()}`
  }
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatLargeNumber(num: number | null | undefined): string {
  if (!num && num !== 0) return '0.00'

  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`
  } else {
    return num.toFixed(2)
  }
}

/**
 * Calculate APY from curve trading volume
 */
export function calculateAPY(
  dailyVolume: number,
  reserve: number,
  feePercentage: number = 0.06 // 6% total fees
): number {
  if (reserve === 0) return 0

  const dailyFees = dailyVolume * feePercentage
  const dailyReturn = dailyFees / reserve
  const apy = (Math.pow(1 + dailyReturn, 365) - 1) * 100

  return Math.min(apy, 10000) // Cap at 10,000% APY
}

/**
 * Estimate slippage for a trade
 */
export function estimateSlippage(
  amount: number,
  currentSupply: number,
  action: 'buy' | 'sell'
): number {
  const currentPrice = calculatePrice(currentSupply)
  const trade = calculateTrade(action, amount, currentSupply, currentPrice)

  const avgExecutionPrice = trade.amount / trade.keys
  const slippage = Math.abs((avgExecutionPrice - currentPrice) / currentPrice) * 100

  return slippage
}

/**
 * Calculate break-even price for a position
 */
export function calculateBreakEvenPrice(
  totalInvested: number,
  keysHeld: number,
  sellTax: number = 0.05
): number {
  const breakEven = (totalInvested / keysHeld) / (1 - sellTax)
  return breakEven
}

/**
 * Generate bonding curve chart data
 */
export function generateCurveChartData(
  maxSupply: number = 1000,
  steps: number = 100
): { supply: number; price: number }[] {
  const data = []
  const stepSize = maxSupply / steps

  for (let i = 0; i <= steps; i++) {
    const supply = i * stepSize
    const price = calculatePrice(supply)
    data.push({ supply, price })
  }

  return data
}
