import { useState, useEffect } from 'react'

export type LiveLaunch = {
  id: string
  name: string
  symbol: string
  mcap: number
  ageSec: number
  viewers?: number
  // Pump.fun API fields
  mint: string
  description: string
  image_uri: string
  metadata_uri: string
  twitter: string | null
  telegram: string | null
  bonding_curve: string
  associated_bonding_curve: string
  creator: string
  created_timestamp: number
  raydium_pool: string | null
  complete: boolean
  virtual_sol_reserves: number
  virtual_token_reserves: number
  total_supply: number
  website: string | null
  show_name: boolean
  king_of_the_hill_timestamp: number | null
  market_cap: number
  reply_count: number
  last_reply: number
  nsfw: boolean
  market_id: string | null
  inverted: boolean | null
  is_currently_live: boolean
  username: string | null
  profile_image: string | null
  usd_market_cap: number
}

export type LivePage = {
  page: number
  pageSize: number
  totalPages: number
  items: LiveLaunch[]
}

export type LiveTotals = {
  liveCount: number
  viewerCount: number
  totalPages: number
}

const API_URL = 'https://frontend-api-v3.pump.fun/coins/currently-live'

// Mock data fallback when API is down
function generateMockData(page: number, pageSize: number): LiveLaunch[] {
  const baseTimestamp = Date.now() - 24 * 60 * 60 * 1000 // 24 hours ago
  const mockCoins: LiveLaunch[] = []

  // Project logo placeholder URLs (inspired by uploaded examples)
  const projectLogos = [
    'https://api.dicebear.com/7.x/shapes/svg?seed=sunset&backgroundColor=ff6b6b,ffd93d,6bcf7f',
    'https://api.dicebear.com/7.x/shapes/svg?seed=neon&backgroundColor=a855f7,ec4899,8b5cf6',
    'https://api.dicebear.com/7.x/shapes/svg?seed=ocean&backgroundColor=3b82f6,06b6d4,8b5cf6',
    'https://api.dicebear.com/7.x/shapes/svg?seed=mint&backgroundColor=10b981,34d399,6ee7b7',
    'https://api.dicebear.com/7.x/shapes/svg?seed=fire&backgroundColor=ef4444,f97316,fbbf24',
    'https://api.dicebear.com/7.x/shapes/svg?seed=cyber&backgroundColor=8b5cf6,d946ef,ec4899',
    'https://api.dicebear.com/7.x/shapes/svg?seed=volt&backgroundColor=eab308,facc15,fde047',
    'https://api.dicebear.com/7.x/shapes/svg?seed=wave&backgroundColor=06b6d4,0ea5e9,38bdf8',
    'https://api.dicebear.com/7.x/shapes/svg?seed=coral&backgroundColor=fb7185,f472b6,ec4899',
  ]

  // Profile picture placeholder URLs (matching the gradient avatar style from examples)
  // Using initials-based avatars with purple/cyan/pink gradients like CryptoKing, ClipMaster, etc.
  const profilePics = [
    'https://api.dicebear.com/7.x/initials/svg?seed=CryptoKing&backgroundColor=8b5cf6,a855f7&backgroundType=gradientLinear',
    'https://api.dicebear.com/7.x/initials/svg?seed=ClipMaster&backgroundColor=ec4899,8b5cf6&backgroundType=gradientLinear',
    'https://api.dicebear.com/7.x/initials/svg?seed=TokenQueen&backgroundColor=a855f7,06b6d4&backgroundType=gradientLinear',
    'https://api.dicebear.com/7.x/initials/svg?seed=AgencyPro&backgroundColor=8b5cf6,ec4899&backgroundType=gradientLinear',
    'https://api.dicebear.com/7.x/initials/svg?seed=DegenTrader&backgroundColor=d946ef,8b5cf6&backgroundType=gradientLinear',
    'https://api.dicebear.com/7.x/initials/svg?seed=StreamLord&backgroundColor=06b6d4,8b5cf6&backgroundType=gradientLinear',
    'https://api.dicebear.com/7.x/initials/svg?seed=MoonWhale&backgroundColor=a855f7,ec4899&backgroundType=gradientLinear',
    'https://api.dicebear.com/7.x/initials/svg?seed=PixelGuru&backgroundColor=8b5cf6,06b6d4&backgroundType=gradientLinear',
    'https://api.dicebear.com/7.x/initials/svg?seed=NeonDev&backgroundColor=ec4899,a855f7&backgroundType=gradientLinear',
    'https://api.dicebear.com/7.x/initials/svg?seed=CyberChad&backgroundColor=06b6d4,a855f7&backgroundType=gradientLinear',
  ]

  // Creator usernames matching the style
  const creatorNames = [
    'CryptoKing', 'ClipMaster', 'TokenQueen', 'AgencyPro', 'DegenTrader',
    'StreamLord', 'MoonWhale', 'PixelGuru', 'NeonDev', 'CyberChad',
    'AlphaBuilder', 'MetaWizard', 'VaporArtist', 'SynthCreator', 'GalaxyMod',
    'TurboStreamer', 'DiamondDev', 'CosmicTrader', 'RetroKing', 'HyperCreator'
  ]

  const tokenNames = [
    'Moon Rocket', 'Degen Ape', 'Laser Eyes', 'Diamond Hands', 'Cyber Punk',
    'Neon Dreams', 'Pixel Pepe', 'Astro Cat', 'Void Walker', 'Blue Chip',
    'Giga Chad', 'Alpha Wolf', 'Sigma Grind', 'Based Token', 'Meme Lord',
    'Quantum Leap', 'Shadow Realm', 'Golden Bull', 'Turbo Boost', 'Meta Verse',
    'Cosmic Doge', 'Space Ape', 'Retro Wave', 'Infinity Stone', 'Hyper Beast',
    'Neon Samurai', 'Crypto Wizard', 'Galaxy Brain', 'Turbo Chad', 'Pixel Wojak',
    'Synthwave Fox', 'Vaporwave Pepe', 'Glitch Art', 'Holographic Mint', 'Cyber Dragon',
    'Stellar Punk', 'Quantum Cat', 'Digital Sunset', 'Neon Genesis', 'Retro Future',
    'Pixel Paradise', 'Cosmic Journey', 'Electric Dreams', 'Synthwave City', 'Vapor Trail',
    'Astro Vibes', 'Neon Horizon', 'Cyber Space', 'Digital Ocean', 'Pixel Storm'
  ]

  // More varied emojis for visual interest
  const tokenEmojis = ['🚀', '🦍', '👁️', '💎', '🤖', '✨', '🐸', '🐱', '👻', '💠', '💪', '🐺', '⚡', '🔥', '👑', '🌌', '🌙', '🐂', '⚙️', '🌐']

  for (let i = 0; i < pageSize; i++) {
    const index = (page - 1) * pageSize + i
    // Vary timestamps more - some very recent, some older
    const ageVariation = Math.floor(Math.random() * 20 * 60 * 60 * 1000) // 0-20 hours
    const timestamp = baseTimestamp + ageVariation
    const nameIndex = index % tokenNames.length
    const logoIndex = index % projectLogos.length
    const profileIndex = index % profilePics.length
    const creatorIndex = index % creatorNames.length
    const emojiIndex = index % tokenEmojis.length

    // More varied market caps - some pumping, some stable
    const baseMarketCap = 10000 + (Math.random() * 500000)
    const marketCapMultiplier = Math.random() > 0.7 ? (1 + Math.random() * 5) : 1 // 30% chance of 2-6x pump
    const finalMarketCap = Math.floor(baseMarketCap * marketCapMultiplier)

    // More varied viewer counts - some with lots of hype
    const viewerMultiplier = Math.random() > 0.8 ? (2 + Math.random() * 8) : 1 // 20% chance of viral stream
    const viewerCount = Math.floor((50 + Math.random() * 500) * viewerMultiplier)

    mockCoins.push({
      id: `mock-${index}`,
      mint: `mock-${index}`,
      name: `${tokenEmojis[emojiIndex]} ${tokenNames[nameIndex]}`,
      symbol: tokenNames[nameIndex].split(' ').map(w => w[0]).join('').toUpperCase(),
      description: `🔴 LIVE NOW - ${tokenNames[nameIndex]} - Join the stream!`,
      image_uri: projectLogos[logoIndex],
      metadata_uri: '',
      twitter: Math.random() > 0.3 ? `https://twitter.com/${tokenNames[nameIndex].toLowerCase().replace(' ', '')}` : null,
      telegram: Math.random() > 0.4 ? `https://t.me/${tokenNames[nameIndex].toLowerCase().replace(' ', '')}` : null,
      bonding_curve: '',
      associated_bonding_curve: '',
      creator: `creator-${index}`,
      created_timestamp: timestamp,
      raydium_pool: Math.random() > 0.6 ? `raydium-${index}` : null,
      complete: Math.random() > 0.85,
      virtual_sol_reserves: 500 + Math.floor(Math.random() * 5000),
      virtual_token_reserves: 500000 + Math.floor(Math.random() * 5000000),
      total_supply: 1000000000,
      website: Math.random() > 0.5 ? `https://${tokenNames[nameIndex].toLowerCase().replace(' ', '')}.com` : null,
      show_name: true,
      king_of_the_hill_timestamp: Math.random() > 0.85 ? timestamp : null,
      market_cap: finalMarketCap,
      usd_market_cap: finalMarketCap,
      mcap: finalMarketCap,
      ageSec: Math.floor((Date.now() - timestamp) / 1000),
      reply_count: Math.floor(Math.random() * 200) + 5,
      last_reply: Date.now() - Math.floor(Math.random() * 300000), // Last reply within 5 mins
      nsfw: false,
      market_id: Math.random() > 0.7 ? `market-${index}` : null,
      inverted: null,
      is_currently_live: true,
      username: creatorNames[creatorIndex],
      profile_image: profilePics[profileIndex],
      viewers: viewerCount,
    })
  }

  return mockCoins
}

export function useLive(pageSize = 48) {
  const [page, setPage] = useState(1)
  const [pagesTotal, setPagesTotal] = useState<number>(1)
  const [items, setItems] = useState<LiveLaunch[]>([])
  const [totals, setTotals] = useState<LiveTotals>({
    liveCount: 0,
    viewerCount: 0,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)

  const fetchPage = async (p: number): Promise<LivePage> => {
    const offset = (p - 1) * pageSize

    try {
      const response = await fetch(
        `${API_URL}?offset=${offset}&limit=${pageSize}&sort=market_cap&order=ASC&includeNsfw=false`,
        {
          signal: AbortSignal.timeout(5000) // 5 second timeout
        }
      )

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data: LiveLaunch[] = await response.json()

      // Map pump.fun data to our LiveLaunch type
      const mappedItems: LiveLaunch[] = data.map((coin) => ({
        ...coin,
        id: coin.mint,
        mcap: coin.usd_market_cap,
        ageSec: Math.floor((Date.now() - coin.created_timestamp) / 1000),
        viewers: coin.viewers ?? 0,
      }))

      // Determine if there are more pages based on response size
      const hasMore = data.length === pageSize
      const estimatedTotalPages = hasMore ? p + 1 : p

      return {
        page: p,
        pageSize,
        totalPages: estimatedTotalPages,
        items: mappedItems,
      }
    } catch (err) {
      // Fallback to mock data when API fails
      console.warn('API fetch failed, using mock data:', err)
      setUseMockData(true)

      const mockData = generateMockData(p, pageSize)
      // Simulate 3 pages of mock data
      const totalMockPages = 3
      const hasMore = p < totalMockPages

      return {
        page: p,
        pageSize,
        totalPages: hasMore ? p + 1 : p,
        items: mockData,
      }
    }
  }

  // Effect 1: Fetch current page
  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchPage(page)
      .then((r) => {
        setItems(r.items)
        setPagesTotal(r.totalPages)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'An error occurred')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, pageSize])

  // Effect 2: Background aggregation across all pages
  useEffect(() => {
    let abort = false

    ;(async () => {
      let live = 0
      let viewers = 0
      let currentPage = 1
      let hasMore = true

      try {
        while (hasMore && !abort) {
          const r = await fetchPage(currentPage)
          live += r.items.length
          viewers += r.items.reduce((s, x) => s + (x.viewers ?? 0), 0)

          // Check if there's another page
          hasMore = r.items.length === pageSize
          if (hasMore) {
            currentPage++
          }

          if (abort) return
        }

        if (!abort) {
          setTotals({
            liveCount: live,
            viewerCount: viewers,
            totalPages: currentPage,
          })
          setPagesTotal(currentPage)
        }
      } catch (err) {
        // Silent fail for background aggregation
        console.error('Background aggregation error:', err)
      }
    })()

    return () => {
      abort = true
    }
  }, [pageSize])

  return {
    page,
    setPage,
    pagesTotal,
    items,
    totals,
    loading,
    error,
    useMockData,
  }
}