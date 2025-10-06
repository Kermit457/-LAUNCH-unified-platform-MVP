import { ProfileCardData } from '@/types/profile'

export const mockProfiles: ProfileCardData[] = [
  {
    id: '1',
    username: 'degen_trader',
    displayName: 'DegenTrader',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DT&backgroundColor=a855f7',
    verified: true,
    roles: ['Trader', 'Degen'],
    bio: 'Building in public. Always learning. 🚀 Top 10 trader on LaunchOS.',
    tagline: 'Top 10 trader on LaunchOS',
    contributions: [
      { name: 'PumpHub', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=PUMP&backgroundColor=a855f7', role: 'Creator' },
      { name: 'ClipFi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=CLIP&backgroundColor=06b6d4', role: 'Advisor' },
      { name: 'RaidDAO', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=RAID&backgroundColor=10b981', role: 'Contributor' }
    ],
    mutuals: [
      { username: 'cryptoking', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CK&backgroundColor=8b5cf6', sharedProject: 'PumpHub' },
      { username: 'streamlord', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SL&backgroundColor=ec4899', sharedProject: 'ClipFi' }
    ],
    socials: {
      twitter: 'https://twitter.com/degen_trader',
      discord: 'https://discord.gg/degen',
      website: 'https://degen.com'
    },
    connected: true,
    onInvite: () => console.log('Invite degen_trader'),
    onMessage: () => console.log('Message degen_trader')
  },
  {
    id: '2',
    username: 'crypto_kelsey',
    displayName: 'Crypto Kelsey',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CK&backgroundColor=ec4899',
    verified: true,
    roles: ['Creator', 'Streamer'],
    bio: 'Content creator & educator. Making crypto accessible for everyone. 💜',
    tagline: 'Making crypto accessible',
    contributions: [
      { name: 'EduChain', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=EDU&backgroundColor=f59e0b', role: 'Creator' },
      { name: 'StreamFi', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=STREAM&backgroundColor=8b5cf6', role: 'Creator' }
    ],
    mutuals: [
      { username: 'degen_trader', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DT&backgroundColor=a855f7' },
      { username: 'solana_dev', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SD&backgroundColor=06b6d4' },
      { username: 'web3_builder', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WB&backgroundColor=10b981' }
    ],
    socials: {
      twitter: 'https://twitter.com/crypto_kelsey',
      website: 'https://cryptokelsey.com'
    },
    connected: false,
    onInvite: () => console.log('Invite crypto_kelsey')
  },
  {
    id: '3',
    username: 'solana_dev',
    displayName: 'Solana Dev',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SD&backgroundColor=06b6d4',
    verified: false,
    roles: ['Builder', 'Advisor'],
    bio: 'Building the next generation of decentralized apps on Solana. Open source contributor.',
    contributions: [
      { name: 'DevTools', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=DEV&backgroundColor=3b82f6', role: 'Creator' },
      { name: 'SolKit', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=SOLKIT&backgroundColor=14f195', role: 'Creator' },
      { name: 'Web3SDK', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=SDK&backgroundColor=6366f1', role: 'Contributor' }
    ],
    mutuals: [],
    socials: {
      twitter: 'https://twitter.com/solana_dev',
      website: 'https://solanadev.io'
    },
    connected: false,
    onInvite: () => console.log('Invite solana_dev')
  },
  {
    id: '4',
    username: 'nft_collector',
    displayName: 'NFT Collector',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=NC&backgroundColor=f59e0b',
    verified: true,
    roles: ['Investor', 'Degen'],
    bio: 'Collecting digital art & supporting creators. 🎨 Portfolio: 500+ NFTs',
    tagline: '500+ NFT portfolio',
    contributions: [
      { name: 'ArtDAO', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ART&backgroundColor=ec4899', role: 'Advisor' },
      { name: 'NFTMarket', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=NFT&backgroundColor=a855f7', role: 'Investor' }
    ],
    mutuals: [
      { username: 'degen_trader', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DT&backgroundColor=a855f7', sharedProject: 'ArtDAO' }
    ],
    socials: {
      twitter: 'https://twitter.com/nft_collector',
      discord: 'https://discord.gg/nftcollector'
    },
    connected: true,
    onInvite: () => console.log('Invite nft_collector'),
    onMessage: () => console.log('Message nft_collector')
  },
  {
    id: '5',
    username: 'meme_lord',
    displayName: 'Meme Lord',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ML&backgroundColor=10b981',
    verified: false,
    roles: ['Creator', 'Degen'],
    bio: 'Professional meme creator. Turning jokes into profits since 2021. 😂',
    contributions: [
      { name: 'MemeDAO', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=MEME&backgroundColor=f59e0b', role: 'Creator' }
    ],
    mutuals: [
      { username: 'crypto_kelsey', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CK&backgroundColor=ec4899' },
      { username: 'nft_collector', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=NC&backgroundColor=f59e0b' }
    ],
    socials: {
      twitter: 'https://twitter.com/meme_lord'
    },
    connected: false,
    onInvite: () => console.log('Invite meme_lord')
  },
  {
    id: '6',
    username: 'whale_watcher',
    displayName: 'Whale Watcher',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WW&backgroundColor=8b5cf6',
    verified: true,
    roles: ['Trader', 'Investor'],
    bio: 'Tracking whale movements & market trends. Data-driven investing. 📊',
    tagline: 'Data-driven whale tracking',
    contributions: [
      { name: 'WhaleAlert', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=WHALE&backgroundColor=06b6d4', role: 'Creator' },
      { name: 'TradingBot', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BOT&backgroundColor=8b5cf6', role: 'Creator' }
    ],
    mutuals: [
      { username: 'degen_trader', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DT&backgroundColor=a855f7' }
    ],
    socials: {
      twitter: 'https://twitter.com/whale_watcher',
      website: 'https://whalewatcher.io'
    },
    connected: true,
    onInvite: () => console.log('Invite whale_watcher'),
    onMessage: () => console.log('Message whale_watcher')
  }
]
