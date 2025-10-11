/**
 * Bonding Curve Mathematics
 * Implements linear bonding curve with configurable parameters
 */

import { TradeCalculation } from '@/types/curve'

// Default curve parameters
const DEFAULT_BASE_PRICE = 0.01  // Starting price in USD
const DEFAULT_SLOPE = 0.0001    // Price increase per key

// Fee percentages
const FEE_RESERVE = 0.94
const FEE_PROJECT = 0.03
const FEE_PLATFORM = 0.02
const FEE_REFERRAL = 0.01

/**
 * Calculate price for a given supply using linear curve
 * Price = basePrice + (supply * slope)
 */
export function calculatePrice(
  supply: number,
  basePrice: number = DEFAULT_BASE_PRICE,
  slope: number = DEFAULT_SLOPE
): number {
  return basePrice + (supply * slope)
}

/**
 * Calculate cost to buy N keys from current supply
 * Uses integral of linear curve: ∫(basePrice + supply * slope) ds
 */
export function calculateBuyCost(
  currentSupply: number,
  keysToBuy: number,
  basePrice: number = DEFAULT_BASE_PRICE,
  slope: number = DEFAULT_SLOPE
): number {
  const startPrice = calculatePrice(currentSupply, basePrice, slope)
  const endPrice = calculatePrice(currentSupply + keysToBuy, basePrice, slope)

  // Area under the curve (trapezoidal rule)
  const cost = (startPrice + endPrice) * keysToBuy / 2

  return Math.max(cost, 0.01) // Minimum cost
}

/**
 * Calculate proceeds from selling N keys
 * Uses integral but from higher to lower supply
 */
export function calculateSellProceeds(
  currentSupply: number,
  keysToSell: number,
  basePrice: number = DEFAULT_BASE_PRICE,
  slope: number = DEFAULT_SLOPE
): number {
  if (currentSupply <= keysToSell) {
    // Can't sell more than exists
    keysToSell = Math.max(currentSupply - 1, 0)
  }

  const startPrice = calculatePrice(currentSupply, basePrice, slope)
  const endPrice = calculatePrice(currentSupply - keysToSell, basePrice, slope)

  // Area under the curve
  const proceeds = (startPrice + endPrice) * keysToSell / 2

  return Math.max(proceeds * 0.95, 0) // 5% sell tax
}

/**
 * Calculate how many keys can be bought with a given USD amount
 */
export function calculateKeysFromAmount(
  amount: number,
  currentSupply: number,
  action: 'buy' | 'sell',
  basePrice: number = DEFAULT_BASE_PRICE,
  slope: number = DEFAULT_SLOPE
): number {
  if (action === 'buy') {
    // Binary search for the right amount of keys
    let low = 0
    let high = amount / basePrice // Max possible keys

    while (high - low > 0.001) {
      const mid = (low + high) / 2
      const cost = calculateBuyCost(currentSupply, mid, basePrice, slope)

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
    let high = Math.min(currentSupply, amountBeforeTax / basePrice)

    while (high - low > 0.001) {
      const mid = (low + high) / 2
      const proceeds = calculateSellProceeds(currentSupply, mid, basePrice, slope)

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

    // Calculate fees
    const reserveFee = actualCost * FEE_RESERVE
    const projectFee = actualCost * FEE_PROJECT
    const platformFee = actualCost * FEE_PLATFORM
    const referralFee = actualCost * FEE_REFERRAL

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
        project: projectFee,
        platform: platformFee,
        referral: referralFee,
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