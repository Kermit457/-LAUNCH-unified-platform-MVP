/**
 * ICM Motion Brand Configuration
 * Centralized brand identity constants
 */

export const BRAND = {
  /** Full brand name */
  name: 'ICMotion',

  /** Short brand identifier */
  short: 'ICM',

  /** Brand tagline */
  tagline: 'No Mcap No Motion',

  /** Long description */
  description: 'The Engine of the Internet Capital Market. Launch. Engage. Earn.',

  /** Social links */
  links: {
    twitter: 'https://twitter.com/icmotion',
    discord: 'https://discord.gg/icmotion',
    telegram: 'https://t.me/icmotion',
    github: 'https://github.com/icmotion',
    docs: 'https://docs.icmotion.com',
  },

  /** Asset paths */
  assets: {
    logo: '/icm-motion-logo.svg',
    favicon: '/icm-motion-logo.svg',
    ogImage: '/og-image.png',
  },

  /** Primary colors from ICM Motion palette */
  colors: {
    primary: {
      cyan: '#00FFFF',
      green: '#00FF88',
      yellow: '#FFD700',
    },
    accent: {
      red: '#FF0040',
      orange: '#FF8800',
      blue: '#0088FF',
      lime: '#D1FD0A',
    },
  },
} as const

/** Type-safe brand access */
export type Brand = typeof BRAND
