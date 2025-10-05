// Avatar and Logo Generation Utilities
// Uses DiceBear API to generate consistent gradient avatars and project logos

const DICEBEAR_BASE = 'https://api.dicebear.com/7.x'

// Gradient color schemes for creator avatars (purple/cyan/pink theme)
const AVATAR_GRADIENTS = [
  '8b5cf6,a855f7', // Purple
  'ec4899,8b5cf6', // Pink-Purple
  'a855f7,06b6d4', // Purple-Cyan
  '8b5cf6,ec4899', // Purple-Pink
  'd946ef,8b5cf6', // Magenta-Purple
  '06b6d4,8b5cf6', // Cyan-Purple
  'a855f7,ec4899', // Purple-Pink
  '8b5cf6,06b6d4', // Purple-Cyan
  'ec4899,a855f7', // Pink-Purple
  '06b6d4,a855f7', // Cyan-Purple
]

// Gradient color schemes for project logos
const LOGO_GRADIENTS = [
  'ff6b6b,ffd93d,6bcf7f', // Sunset (orange/yellow/green)
  'a855f7,ec4899,8b5cf6', // Neon (purple/pink)
  '3b82f6,06b6d4,8b5cf6', // Ocean (blue/cyan)
  '10b981,34d399,6ee7b7', // Mint (green)
  'ef4444,f97316,fbbf24', // Fire (red/orange/yellow)
  '8b5cf6,d946ef,ec4899', // Cyber (purple/magenta)
  'eab308,facc15,fde047', // Volt (yellow)
  '06b6d4,0ea5e9,38bdf8', // Wave (cyan)
  'fb7185,f472b6,ec4899', // Coral (pink)
]

/**
 * Generates a gradient avatar URL for a creator/user
 * Uses initials-based avatars with gradient backgrounds
 * @param name - Creator name (e.g., "CryptoKing")
 * @param gradientIndex - Optional gradient index (0-9), auto-generates if not provided
 */
export function getCreatorAvatar(name: string, gradientIndex?: number): string {
  const seed = encodeURIComponent(name)
  const gradient = gradientIndex !== undefined
    ? AVATAR_GRADIENTS[gradientIndex % AVATAR_GRADIENTS.length]
    : AVATAR_GRADIENTS[hashString(name) % AVATAR_GRADIENTS.length]

  return `${DICEBEAR_BASE}/initials/svg?seed=${seed}&backgroundColor=${gradient}&backgroundType=gradientLinear`
}

/**
 * Generates a project logo URL (abstract shapes)
 * @param seed - Project name or ticker (e.g., "AIKIT", "$MEME")
 * @param gradientIndex - Optional gradient index (0-8), auto-generates if not provided
 */
export function getProjectLogo(seed: string, gradientIndex?: number): string {
  const cleanSeed = seed.replace('$', '').replace(/\s+/g, '')
  const encodedSeed = encodeURIComponent(cleanSeed)
  const gradient = gradientIndex !== undefined
    ? LOGO_GRADIENTS[gradientIndex % LOGO_GRADIENTS.length]
    : LOGO_GRADIENTS[hashString(cleanSeed) % LOGO_GRADIENTS.length]

  return `${DICEBEAR_BASE}/shapes/svg?seed=${encodedSeed}&backgroundColor=${gradient}`
}

/**
 * Gets a random gradient color scheme
 * @param type - 'avatar' or 'logo'
 */
export function getRandomGradient(type: 'avatar' | 'logo' = 'avatar'): string {
  const gradients = type === 'avatar' ? AVATAR_GRADIENTS : LOGO_GRADIENTS
  return gradients[Math.floor(Math.random() * gradients.length)]
}

/**
 * Simple hash function to consistently map strings to indices
 * @param str - Input string
 * @returns Hash number
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Creator name database for consistent avatars
 * Use these names across the platform for profile pictures
 */
export const CREATOR_NAMES = [
  'CryptoKing',
  'ClipMaster',
  'TokenQueen',
  'AgencyPro',
  'DegenTrader',
  'StreamLord',
  'MoonWhale',
  'PixelGuru',
  'NeonDev',
  'CyberChad',
  'AlphaBuilder',
  'MetaWizard',
  'VaporArtist',
  'SynthCreator',
  'GalaxyMod',
  'TurboStreamer',
  'DiamondDev',
  'CosmicTrader',
  'RetroKing',
  'HyperCreator',
]

/**
 * Get a creator name by index
 * @param index - Index (0-19)
 */
export function getCreatorName(index: number): string {
  return CREATOR_NAMES[index % CREATOR_NAMES.length]
}

/**
 * Get creator avatar by index (combines name + avatar generation)
 * @param index - Index (0-19)
 */
export function getCreatorByIndex(index: number): { name: string; avatar: string } {
  const name = getCreatorName(index)
  const avatar = getCreatorAvatar(name, index % AVATAR_GRADIENTS.length)
  return { name, avatar }
}