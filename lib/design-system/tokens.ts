/**
 * BTDEMO Design Tokens
 *
 * Centralized design system tokens for the /btdemo preview page.
 * These tokens match the CSS custom properties in globals.css and
 * Tailwind config extensions.
 *
 * Zero impact on existing app - these are only used in BTDEMO components.
 */

export const btdemoTokens = {
  // Colors
  colors: {
    canvas: '#000000',
    card: 'rgba(8, 8, 9, 0.60)',
    cardHover: 'rgba(23, 23, 23, 0.60)',
    primary: '#D1FD0A',
    primaryHover: '#B8E309',
    border: '#3B3B3B',
    borderActive: '#D1FD0A',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.60)',
    textDisabled: 'rgba(255, 255, 255, 0.40)',
  },

  // Spacing (responsive)
  spacing: {
    // Desktop values
    desktop: {
      padding: '20px',
      iconButton: '68px',
      gap: '16px',
    },
    // Mobile values (≤640px)
    mobile: {
      padding: '16px',
      iconButton: '56px',
      gap: '12px',
    },
  },

  // Border Radius (consistent across breakpoints)
  radius: {
    md: '15px', // Cards, boxes, buttons
    lg: '20px', // Icon buttons, large elements
  },

  // Border Width (consistent across breakpoints)
  borderWidth: {
    standard: '0.8px',
    thick: '1px',
  },

  // Backdrop Blur (consistent across breakpoints)
  blur: {
    sm: '2px', // Navigation, light blur
    md: '4px', // Cards, medium blur
  },

  // Shadows
  shadows: {
    inset: '0 0 1px 0 rgba(0, 0, 0, 0.25) inset',
    glow: '0 0 20px rgba(209, 253, 10, 0.3)',
  },

  // Typography
  typography: {
    // LED Display Font (DSEG14)
    led: {
      fontFamily: "'DSEG14', monospace",
      sizes: {
        xs: '15px',
        sm: '16px',
        md: '32px',
      },
      letterSpacing: '-1.28px',
    },
    // Standard fonts
    display: "'Inter', sans-serif",
    body: "'Inter Tight', 'Inter', sans-serif",
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(180deg, #D1FD0A 0%, #B8E309 100%)',
  },

  // Breakpoints (matching Tailwind defaults)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const

// Type exports for TypeScript
export type BtdemoColors = typeof btdemoTokens.colors
export type BtdemoSpacing = typeof btdemoTokens.spacing
export type BtdemoRadius = typeof btdemoTokens.radius
export type BtdemoBorderWidth = typeof btdemoTokens.borderWidth
export type BtdemoBlur = typeof btdemoTokens.blur
export type BtdemoShadows = typeof btdemoTokens.shadows
export type BtdemoTypography = typeof btdemoTokens.typography
export type BtdemoGradients = typeof btdemoTokens.gradients
export type BtdemoBreakpoints = typeof btdemoTokens.breakpoints

// Helper function to get responsive spacing
export function getResponsiveSpacing(
  property: keyof typeof btdemoTokens.spacing.desktop,
  isMobile: boolean = false
): string {
  return isMobile
    ? btdemoTokens.spacing.mobile[property]
    : btdemoTokens.spacing.desktop[property]
}

// Helper function to generate LED text classes
export function getLedClass(size: 'xs' | 'sm' | 'md' = 'md'): string {
  const sizeMap = {
    xs: 'font-led-15',
    sm: 'font-led-16',
    md: 'font-led-32',
  }
  return sizeMap[size]
}

// Icon color semantic classes (for migration from hardcoded colors)
export const iconColorClasses = {
  primary: 'text-btdemo-primary',
  muted: 'text-btdemo-text-muted',
  disabled: 'text-btdemo-text-disabled',
  interactive: 'text-btdemo-text hover:text-btdemo-primary',
  active: 'text-btdemo-border-active',
} as const

export type IconColorClass = keyof typeof iconColorClasses
