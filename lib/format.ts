import { Money } from './types'

export const fmtUSDC = (n: number) => `$${n.toFixed(2)}`
export const fmtSOL = (n: number) => `${n.toFixed(3)} SOL`
export const fmtMoney = (m: Money) => m.mint === "USDC" ? fmtUSDC(m.amount) : fmtSOL(m.amount)

/**
 * Format USD values with appropriate suffixes
 * @example fmtUsd(1234567) => "$1.23M"
 */
export function fmtUsd(value?: number): string {
  if (value === undefined || value === null) return '-'

  const abs = Math.abs(value)

  if (abs >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  }
  if (abs >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  }
  if (abs >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  }

  // For small values, show more decimals
  if (abs < 0.01) {
    return `$${value.toFixed(6)}`
  }
  if (abs < 1) {
    return `$${value.toFixed(4)}`
  }

  return `$${value.toFixed(2)}`
}

/**
 * Format percentage values
 * @example fmtPct(12.34) => "+12.34%"
 */
export function fmtPct(value?: number): string {
  if (value === undefined || value === null) return '-'

  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Shorten base58 address
 * @example short("AbCdEf123456789") => "AbCd…6789"
 */
export function short(address: string, prefixLen = 4, suffixLen = 4): string {
  if (!address || address.length <= prefixLen + suffixLen) return address

  return `${address.slice(0, prefixLen)}…${address.slice(-suffixLen)}`
}

/**
 * Format large numbers with K/M/B suffixes
 * @example fmtNum(1234567) => "1.23M"
 */
export function fmtNum(value?: number): string {
  if (value === undefined || value === null) return '-'

  const abs = Math.abs(value)

  if (abs >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`
  }
  if (abs >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`
  }
  if (abs >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`
  }

  return String(Math.round(value))
}

/**
 * Format time remaining until a timestamp
 * @example fmtTimeUntil(Date.now() + 3600000) => "in 1h 0m"
 */
export function fmtTimeUntil(timestamp: number): string {
  const now = Date.now()
  const diff = timestamp - now

  if (diff <= 0) return 'Now'

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    const remainingHours = hours % 24
    return remainingHours > 0 ? `in ${days}d ${remainingHours}h` : `in ${days}d`
  }

  if (hours > 0) {
    const remainingMinutes = minutes % 60
    return `in ${hours}h ${remainingMinutes}m`
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60
    return remainingSeconds > 30 ? `in ${minutes}m ${remainingSeconds}s` : `in ${minutes}m`
  }

  return `in ${seconds}s`
}

/**
 * Format timestamp to readable date
 * @example fmtDateTime(1234567890000) => "Feb 13, 2009 11:31 PM"
 */
export function fmtDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Format token age from creation timestamp
 * @example fmtTokenAge(Date.now() - 3600000) => "1h ago"
 */
export function fmtTokenAge(createdAt: number): string {
  const now = Date.now()
  const diff = now - createdAt

  if (diff < 0) return 'Just now'

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ago`
  }
  if (hours > 0) {
    return `${hours}h ago`
  }
  if (minutes > 0) {
    return `${minutes}m ago`
  }

  return 'Just now'
}

/**
 * Check if token is new (< 24h old)
 */
export function isNewToken(createdAt?: number): boolean {
  if (!createdAt) return false
  const ageMs = Date.now() - createdAt
  return ageMs < 24 * 60 * 60 * 1000 // 24 hours
}

/**
 * Format distance to now from timestamp
 * @example formatDistanceToNow(Date.now() - 3600000) => "1h ago"
 */
export function formatDistanceToNow(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}