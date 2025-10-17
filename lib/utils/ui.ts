/**
 * UI utility functions
 */

/**
 * Convert percentage (0-100) to SVG stroke-dasharray value for circular progress
 * Clamps the percentage to maxPct to avoid visual dominance
 *
 * @param pct - Percentage 0-100
 * @param radius - Circle radius in SVG units
 * @param maxPct - Maximum percentage to display (default 75 to avoid full circles)
 * @returns Object with dash offset and circumference
 */
export function percentToStroke(
  pct: number,
  radius: number = 22,
  maxPct: number = 75
): { dash: number; circumference: number } {
  const clampedPct = Math.max(0, Math.min(maxPct, pct))
  const C = 2 * Math.PI * radius
  const dash = C * (clampedPct / 100)

  return {
    dash,
    circumference: C,
  }
}

/**
 * Format number with compact notation (1.2k, 3.4M, etc.)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString()
  if (num < 1_000_000) return `${(num / 1000).toFixed(1)}k`
  if (num < 1_000_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  return `${(num / 1_000_000_000).toFixed(1)}B`
}

/**
 * Format share percentage for display
 */
export function formatSharePct(pct: number): string {
  if (pct === 0) return '0%'
  if (pct < 0.1) return '<0.1%'
  if (pct < 1) return pct.toFixed(1) + '%'
  return Math.round(pct) + '%'
}
