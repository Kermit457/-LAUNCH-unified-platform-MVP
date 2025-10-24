/**
 * BTDEMO Design System Utilities
 *
 * Utility functions for the BTDEMO design system.
 * Includes the cn() helper for merging Tailwind classes.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with proper precedence
 *
 * This is the standard cn() utility used throughout the app.
 * It combines clsx for conditional classes and tailwind-merge
 * to handle Tailwind class conflicts intelligently.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 * cn('text-sm', 'text-lg') // Returns 'text-lg' (latter wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate BTDEMO-specific class names with namespace
 *
 * This helper ensures BTDEMO classes don't conflict with
 * existing app styles by prefixing with 'btdemo-'.
 *
 * @example
 * btdemoClass('card', 'hover') // Returns 'btdemo-card-hover'
 */
export function btdemoClass(...parts: string[]): string {
  return `btdemo-${parts.join('-')}`
}

/**
 * Responsive class helper for BTDEMO components
 *
 * Applies desktop classes by default and mobile classes
 * at the sm: breakpoint (640px and below).
 *
 * @example
 * responsive('p-5', 'p-4') // Returns 'p-5 sm:p-4'
 */
export function responsive(desktop: string, mobile: string): string {
  return `${desktop} sm:${mobile}`
}

/**
 * Focus visible ring for accessibility
 *
 * Consistent focus outline for all interactive BTDEMO elements.
 * Matches WCAG 2.1 requirements for keyboard navigation.
 *
 * @example
 * <button className={cn('btn', focusRing())}>Click me</button>
 */
export function focusRing(): string {
  return 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btdemo-primary focus-visible:ring-offset-2 focus-visible:ring-offset-btdemo-canvas'
}

/**
 * Transition utility for smooth state changes
 *
 * Standard transition timing for hover, active, focus states.
 *
 * @example
 * <div className={cn('opacity-50', transition())}>Fades smoothly</div>
 */
export function transition(
  properties: string = 'all',
  duration: string = '150ms'
): string {
  return `transition-${properties} duration-${duration} ease-in-out`
}

/**
 * Glassmorphism effect for BTDEMO cards
 *
 * Combines backdrop blur, transparency, and border
 * for the signature BTDEMO glass aesthetic.
 *
 * @param blur - 'sm' (2px) or 'md' (4px)
 * @param opacity - Card background opacity (default: 0.6)
 */
export function glass(
  blur: 'sm' | 'md' = 'md',
  opacity: number = 0.6
): string {
  const blurClass = blur === 'sm' ? 'backdrop-blur-btdemo-sm' : 'backdrop-blur-btdemo-md'
  const bgClass = opacity === 0.6 ? 'bg-btdemo-card' : `bg-btdemo-card/[${opacity}]`
  return cn(blurClass, bgClass, 'border border-btdemo')
}

/**
 * Active state styling for interactive elements
 *
 * Applies lime border glow when element is selected/active.
 */
export function activeState(isActive: boolean): string {
  return isActive
    ? 'border-btdemo-border-active shadow-btdemo-glow'
    : 'border-btdemo-border'
}

/**
 * Truncate text with ellipsis
 *
 * @param lines - Number of lines before truncation (default: 1)
 */
export function truncate(lines: number = 1): string {
  if (lines === 1) {
    return 'truncate'
  }
  return `line-clamp-${lines}`
}

/**
 * Screen reader only text (for accessibility)
 *
 * Visually hides text but keeps it available for screen readers.
 *
 * @example
 * <span className={srOnly()}>Opens in new window</span>
 */
export function srOnly(): string {
  return 'sr-only'
}

/**
 * Convert hex color to RGB values
 *
 * Useful for creating rgba() values with dynamic opacity.
 *
 * @example
 * hexToRgb('#D1FD0A') // Returns 'rgb(209, 253, 10)'
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return 'rgb(0, 0, 0)'

  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Format number with LED display styling
 *
 * Adds tabular-nums and monospace font for consistent digit alignment.
 *
 * @example
 * <span className={ledNumber()}>$1,234.56</span>
 */
export function ledNumber(size: 'xs' | 'sm' | 'md' = 'md'): string {
  const sizeClass = size === 'xs' ? 'font-led-15' : size === 'sm' ? 'font-led-16' : 'font-led-32'
  return cn(sizeClass, 'tabular-nums')
}
