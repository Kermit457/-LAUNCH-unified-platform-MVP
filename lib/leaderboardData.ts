import { CreatorEntry, ProjectEntry, AgencyEntry, SeasonInfo, HallOfFameEntry } from '@/types/leaderboard'

export const CREATORS: CreatorEntry[] = [
  {
    id: '1',
    handle: '@cryptoking',
    name: 'CryptoKing',
    roles: ['Streamer', 'Trader'],
    verified: true,
    isLive: true,
    stats: {
      earnUsd30d: 12500,
      verifiedViews30d: 450000,
      avgCpm30d: 8.5,
      approvedSubs30d: 145,
      liveHours30d: 82,
      convictionPct: 78,
      convictionDelta7d: 12.5,
      boostStakedUsd: 5000
    },
    social: {
      twitter: 'https://twitter.com/cryptoking',
      twitch: 'https://twitch.tv/cryptoking',
      youtube: 'https://youtube.com/@cryptoking'
    },
    avatar: 'CK'
  },
  {
    id: '2',
    handle: '@degenace',
    name: 'Degen Ace',
    roles: ['Degen', 'Clipper'],
    verified: true,
    isLive: false,
    stats: {
      earnUsd30d: 8200,
      verifiedViews30d: 320000,
      avgCpm30d: 7.2,
      approvedSubs30d: 198,
      liveHours30d: 45,
      convictionPct: 65,
      convictionDelta7d: 8.3,
      boostStakedUsd: 2500
    },
    social: {
      twitter: 'https://twitter.com/degenace',
      twitch: 'https://twitch.tv/degenace'
    },
    avatar: 'DA'
  },
  {
    id: '3',
    handle: '@pixelvault',
    name: 'PixelVault',
    roles: ['Editor', 'Designer'],
    verified: true,
    isLive: false,
    stats: {
      earnUsd30d: 9800,
      verifiedViews30d: 280000,
      avgCpm30d: 9.5,
      approvedSubs30d: 167,
      liveHours30d: 28,
      convictionPct: 72,
      convictionDelta7d: 15.7,
      boostStakedUsd: 3500
    },
    social: {
      twitter: 'https://twitter.com/pixelvault',
      youtube: 'https://youtube.com/@pixelvault'
    },
    avatar: 'PV'
  },
  {
    id: '4',
    handle: '@solwizard',
    name: 'Sol Wizard',
    roles: ['Streamer', 'Trader', 'Degen'],
    verified: true,
    isLive: true,
    stats: {
      earnUsd30d: 15200,
      verifiedViews30d: 520000,
      avgCpm30d: 10.2,
      approvedSubs30d: 203,
      liveHours30d: 95,
      convictionPct: 85,
      convictionDelta7d: 18.2,
      boostStakedUsd: 7500
    },
    social: {
      twitter: 'https://twitter.com/solwizard',
      twitch: 'https://twitch.tv/solwizard'
    },
    avatar: 'SW'
  },
  {
    id: '5',
    handle: '@moonqueen',
    name: 'Moon Queen',
    roles: ['Clipper', 'Trader'],
    verified: false,
    isLive: false,
    stats: {
      earnUsd30d: 6100,
      verifiedViews30d: 195000,
      avgCpm30d: 6.8,
      approvedSubs30d: 124,
      liveHours30d: 18,
      convictionPct: 58,
      convictionDelta7d: 5.2,
      boostStakedUsd: 1500
    },
    social: {
      twitter: 'https://twitter.com/moonqueen'
    },
    avatar: 'MQ'
  },
  {
    id: '6',
    handle: '@basedbuilder',
    name: 'Based Builder',
    roles: ['Project Ops', 'Streamer'],
    verified: true,
    isLive: false,
    stats: {
      earnUsd30d: 7400,
      verifiedViews30d: 240000,
      avgCpm30d: 8.0,
      approvedSubs30d: 89,
      liveHours30d: 52,
      convictionPct: 68,
      convictionDelta7d: 9.8,
      boostStakedUsd: 4000
    },
    social: {
      twitter: 'https://twitter.com/basedbuilder',
      twitch: 'https://twitch.tv/basedbuilder'
    },
    avatar: 'BB'
  },
  {
    id: '7',
    handle: '@alphasniper',
    name: 'Alpha Sniper',
    roles: ['Trader', 'Degen'],
    verified: true,
    isLive: true,
    stats: {
      earnUsd30d: 11300,
      verifiedViews30d: 380000,
      avgCpm30d: 9.8,
      approvedSubs30d: 156,
      liveHours30d: 67,
      convictionPct: 74,
      convictionDelta7d: 11.4,
      boostStakedUsd: 6000
    },
    social: {
      twitter: 'https://twitter.com/alphasniper',
      twitch: 'https://twitch.tv/alphasniper'
    },
    avatar: 'AS'
  },
  {
    id: '8',
    handle: '@clipmaster',
    name: 'ClipMaster',
    roles: ['Clipper', 'Editor'],
    verified: true,
    isLive: false,
    stats: {
      earnUsd30d: 8900,
      verifiedViews30d: 310000,
      avgCpm30d: 7.5,
      approvedSubs30d: 245,
      liveHours30d: 12,
      convictionPct: 62,
      convictionDelta7d: 6.7,
      boostStakedUsd: 2000
    },
    social: {
      twitter: 'https://twitter.com/clipmaster',
      youtube: 'https://youtube.com/@clipmaster'
    },
    avatar: 'CM'
  },
  {
    id: '9',
    handle: '@ethmaxi',
    name: 'ETH Maxi',
    roles: ['Streamer', 'Project Ops'],
    verified: false,
    isLive: false,
    stats: {
      earnUsd30d: 5800,
      verifiedViews30d: 175000,
      avgCpm30d: 7.8,
      approvedSubs30d: 78,
      liveHours30d: 38,
      convictionPct: 55,
      convictionDelta7d: 4.1,
      boostStakedUsd: 1800
    },
    social: {
      twitter: 'https://twitter.com/ethmaxi',
      twitch: 'https://twitch.tv/ethmaxi'
    },
    avatar: 'EM'
  },
  {
    id: '10',
    handle: '@raidsquad',
    name: 'Raid Squad',
    roles: ['Streamer', 'Community'],
    verified: true,
    isLive: true,
    stats: {
      earnUsd30d: 9500,
      verifiedViews30d: 350000,
      avgCpm30d: 8.3,
      approvedSubs30d: 134,
      liveHours30d: 71,
      convictionPct: 70,
      convictionDelta7d: 10.2,
      boostStakedUsd: 3800
    },
    social: {
      twitter: 'https://twitter.com/raidsquad',
      twitch: 'https://twitch.tv/raidsquad'
    },
    avatar: 'RS'
  },
  {
    id: '11',
    handle: '@nftflip',
    name: 'NFT Flipper',
    roles: ['Trader', 'Clipper'],
    verified: false,
    isLive: false,
    stats: {
      earnUsd30d: 4200,
      verifiedViews30d: 128000,
      avgCpm30d: 6.2,
      approvedSubs30d: 92,
      liveHours30d: 22,
      convictionPct: 48,
      convictionDelta7d: 3.5,
      boostStakedUsd: 1000
    },
    social: {
      twitter: 'https://twitter.com/nftflip'
    },
    avatar: 'NF'
  },
  {
    id: '12',
    handle: '@tokenomist',
    name: 'The Tokenomist',
    roles: ['Project Ops', 'Streamer'],
    verified: true,
    isLive: false,
    stats: {
      earnUsd30d: 10200,
      verifiedViews30d: 295000,
      avgCpm30d: 9.2,
      approvedSubs30d: 112,
      liveHours30d: 58,
      convictionPct: 76,
      convictionDelta7d: 13.1,
      boostStakedUsd: 5500
    },
    social: {
      twitter: 'https://twitter.com/tokenomist',
      twitch: 'https://twitch.tv/tokenomist',
      youtube: 'https://youtube.com/@tokenomist'
    },
    avatar: 'TT'
  },
  {
    id: '13',
    handle: '@memequeen',
    name: 'Meme Queen',
    roles: ['Designer', 'Clipper'],
    verified: true,
    isLive: false,
    stats: {
      earnUsd30d: 7100,
      verifiedViews30d: 215000,
      avgCpm30d: 7.0,
      approvedSubs30d: 187,
      liveHours30d: 15,
      convictionPct: 60,
      convictionDelta7d: 7.4,
      boostStakedUsd: 2200
    },
    social: {
      twitter: 'https://twitter.com/memequeen'
    },
    avatar: 'MQ'
  },
  {
    id: '14',
    handle: '@hodlgang',
    name: 'HODL Gang',
    roles: ['Trader', 'Community'],
    verified: true,
    isLive: true,
    stats: {
      earnUsd30d: 8600,
      verifiedViews30d: 265000,
      avgCpm30d: 8.7,
      approvedSubs30d: 142,
      liveHours30d: 63,
      convictionPct: 67,
      convictionDelta7d: 9.0,
      boostStakedUsd: 3200
    },
    social: {
      twitter: 'https://twitter.com/hodlgang',
      twitch: 'https://twitch.tv/hodlgang'
    },
    avatar: 'HG'
  },
  {
    id: '15',
    handle: '@chainchaser',
    name: 'Chain Chaser',
    roles: ['Streamer', 'Trader'],
    verified: false,
    isLive: false,
    stats: {
      earnUsd30d: 5500,
      verifiedViews30d: 162000,
      avgCpm30d: 7.3,
      approvedSubs30d: 98,
      liveHours30d: 41,
      convictionPct: 53,
      convictionDelta7d: 4.8,
      boostStakedUsd: 1600
    },
    social: {
      twitter: 'https://twitter.com/chainchaser'
    },
    avatar: 'CC'
  },
  {
    id: '16',
    handle: '@pumplord',
    name: 'Pump Lord',
    roles: ['Degen', 'Trader'],
    verified: true,
    isLive: false,
    stats: {
      earnUsd30d: 13800,
      verifiedViews30d: 485000,
      avgCpm30d: 9.0,
      approvedSubs30d: 178,
      liveHours30d: 55,
      convictionPct: 81,
      convictionDelta7d: 14.6,
      boostStakedUsd: 6500
    },
    social: {
      twitter: 'https://twitter.com/pumplord',
      twitch: 'https://twitch.tv/pumplord'
    },
    avatar: 'PL'
  },
  {
    id: '17',
    handle: '@vibecheck',
    name: 'Vibe Check',
    roles: ['Clipper', 'Editor'],
    verified: true,
    isLive: false,
    stats: {
      earnUsd30d: 6700,
      verifiedViews30d: 198000,
      avgCpm30d: 7.6,
      approvedSubs30d: 215,
      liveHours30d: 9,
      convictionPct: 59,
      convictionDelta7d: 6.1,
      boostStakedUsd: 1900
    },
    social: {
      twitter: 'https://twitter.com/vibecheck'
    },
    avatar: 'VC'
  },
  {
    id: '18',
    handle: '@gainsgoblin',
    name: 'Gains Goblin',
    roles: ['Trader', 'Streamer'],
    verified: true,
    isLive: true,
    stats: {
      earnUsd30d: 10800,
      verifiedViews30d: 335000,
      avgCpm30d: 8.9,
      approvedSubs30d: 159,
      liveHours30d: 74,
      convictionPct: 73,
      convictionDelta7d: 11.9,
      boostStakedUsd: 4800
    },
    social: {
      twitter: 'https://twitter.com/gainsgoblin',
      twitch: 'https://twitch.tv/gainsgoblin'
    },
    avatar: 'GG'
  },
  {
    id: '19',
    handle: '@tokentech',
    name: 'Token Tech',
    roles: ['Project Ops', 'Designer'],
    verified: false,
    isLive: false,
    stats: {
      earnUsd30d: 4900,
      verifiedViews30d: 145000,
      avgCpm30d: 6.5,
      approvedSubs30d: 67,
      liveHours30d: 19,
      convictionPct: 51,
      convictionDelta7d: 3.8,
      boostStakedUsd: 1200
    },
    social: {
      twitter: 'https://twitter.com/tokentech'
    },
    avatar: 'TT'
  },
  {
    id: '20',
    handle: '@apehunter',
    name: 'Ape Hunter',
    roles: ['Degen', 'Clipper'],
    verified: true,
    isLive: false,
    stats: {
      earnUsd30d: 7900,
      verifiedViews30d: 252000,
      avgCpm30d: 7.9,
      approvedSubs30d: 168,
      liveHours30d: 34,
      convictionPct: 64,
      convictionDelta7d: 8.7,
      boostStakedUsd: 2800
    },
    social: {
      twitter: 'https://twitter.com/apehunter'
    },
    avatar: 'AH'
  }
]

export const PROJECTS: ProjectEntry[] = [
  {
    id: '1',
    symbol: 'PUMP',
    name: 'pump.fun',
    chain: 'SOL',
    verified: true,
    isLive: true,
    stats: {
      feesUsd30d: 285000,
      uniqueContributors30d: 1243,
      completionRate30d: 0.94,
      buybacksUsd30d: 45000,
      convictionPct: 88,
      retention30d: 0.72
    },
    social: {
      twitter: 'https://twitter.com/pumpdotfun',
      website: 'https://pump.fun'
    },
    logo: 'P'
  },
  {
    id: '2',
    symbol: 'RAID',
    name: 'RaidOS',
    chain: 'BASE',
    verified: true,
    isLive: true,
    stats: {
      feesUsd30d: 142000,
      uniqueContributors30d: 687,
      completionRate30d: 0.89,
      buybacksUsd30d: 28000,
      convictionPct: 76,
      retention30d: 0.68
    },
    social: {
      twitter: 'https://twitter.com/raidos',
      website: 'https://raid.os'
    },
    logo: 'R'
  },
  {
    id: '3',
    symbol: 'SIGIL',
    name: 'Sigil Protocol',
    chain: 'SOL',
    verified: true,
    isLive: false,
    stats: {
      feesUsd30d: 98000,
      uniqueContributors30d: 452,
      completionRate30d: 0.92,
      buybacksUsd30d: 18500,
      convictionPct: 72,
      retention30d: 0.65
    },
    social: {
      twitter: 'https://twitter.com/sigilprotocol',
      website: 'https://sigil.xyz'
    },
    logo: 'S'
  },
  {
    id: '4',
    symbol: 'BOOST',
    name: 'BoostFi',
    chain: 'BASE',
    verified: true,
    isLive: true,
    stats: {
      feesUsd30d: 167000,
      uniqueContributors30d: 823,
      completionRate30d: 0.96,
      buybacksUsd30d: 32000,
      convictionPct: 81,
      retention30d: 0.74
    },
    social: {
      twitter: 'https://twitter.com/boostfi',
      website: 'https://boost.fi',
      discord: 'https://discord.gg/boostfi'
    },
    logo: 'B'
  },
  {
    id: '5',
    symbol: 'CLIP',
    name: 'ClipChain',
    chain: 'ETH',
    verified: false,
    isLive: false,
    stats: {
      feesUsd30d: 54000,
      uniqueContributors30d: 298,
      completionRate30d: 0.85,
      buybacksUsd30d: 12000,
      convictionPct: 58,
      retention30d: 0.61
    },
    social: {
      twitter: 'https://twitter.com/clipchain',
      website: 'https://clipchain.io'
    },
    logo: 'C'
  },
  {
    id: '6',
    symbol: 'FARM',
    name: 'FarmOS',
    chain: 'SOL',
    verified: true,
    isLive: true,
    stats: {
      feesUsd30d: 198000,
      uniqueContributors30d: 956,
      completionRate30d: 0.91,
      buybacksUsd30d: 38000,
      convictionPct: 79,
      retention30d: 0.70
    },
    social: {
      twitter: 'https://twitter.com/farmos',
      website: 'https://farm.os'
    },
    logo: 'F'
  },
  {
    id: '7',
    symbol: 'DEGEN',
    name: 'Degen Protocol',
    chain: 'BASE',
    verified: true,
    isLive: false,
    stats: {
      feesUsd30d: 124000,
      uniqueContributors30d: 534,
      completionRate30d: 0.87,
      buybacksUsd30d: 22000,
      convictionPct: 68,
      retention30d: 0.63
    },
    social: {
      twitter: 'https://twitter.com/degenprotocol',
      website: 'https://degen.xyz'
    },
    logo: 'D'
  },
  {
    id: '8',
    symbol: 'PIXEL',
    name: 'PixelDAO',
    chain: 'ETH',
    verified: true,
    isLive: false,
    stats: {
      feesUsd30d: 87000,
      uniqueContributors30d: 412,
      completionRate30d: 0.93,
      buybacksUsd30d: 16500,
      convictionPct: 70,
      retention30d: 0.67
    },
    social: {
      twitter: 'https://twitter.com/pixeldao',
      website: 'https://pixel.dao'
    },
    logo: 'P'
  },
  {
    id: '9',
    symbol: 'MOON',
    name: 'MoonFarm',
    chain: 'SOL',
    verified: false,
    isLive: true,
    stats: {
      feesUsd30d: 63000,
      uniqueContributors30d: 327,
      completionRate30d: 0.82,
      buybacksUsd30d: 9800,
      convictionPct: 54,
      retention30d: 0.59
    },
    social: {
      twitter: 'https://twitter.com/moonfarm',
      website: 'https://moon.farm'
    },
    logo: 'M'
  },
  {
    id: '10',
    symbol: 'ALPHA',
    name: 'Alpha Protocol',
    chain: 'BASE',
    verified: true,
    isLive: true,
    stats: {
      feesUsd30d: 215000,
      uniqueContributors30d: 1089,
      completionRate30d: 0.95,
      buybacksUsd30d: 42000,
      convictionPct: 84,
      retention30d: 0.76
    },
    social: {
      twitter: 'https://twitter.com/alphaprotocol',
      website: 'https://alpha.xyz',
      discord: 'https://discord.gg/alpha'
    },
    logo: 'A'
  },
  {
    id: '11',
    symbol: 'VIBE',
    name: 'VibeChain',
    chain: 'ETH',
    verified: true,
    isLive: false,
    stats: {
      feesUsd30d: 105000,
      uniqueContributors30d: 478,
      completionRate30d: 0.90,
      buybacksUsd30d: 20000,
      convictionPct: 73,
      retention30d: 0.66
    },
    social: {
      twitter: 'https://twitter.com/vibechain',
      website: 'https://vibe.chain'
    },
    logo: 'V'
  },
  {
    id: '12',
    symbol: 'RAID2',
    name: 'Raid Engine',
    chain: 'SOL',
    verified: true,
    isLive: true,
    stats: {
      feesUsd30d: 178000,
      uniqueContributors30d: 834,
      completionRate30d: 0.98,
      buybacksUsd30d: 35000,
      convictionPct: 80,
      retention30d: 0.71
    },
    social: {
      twitter: 'https://twitter.com/raidengine',
      website: 'https://raid.engine'
    },
    logo: 'R'
  },
  {
    id: '13',
    symbol: 'MEME',
    name: 'Meme Factory',
    chain: 'BASE',
    verified: false,
    isLive: false,
    stats: {
      feesUsd30d: 72000,
      uniqueContributors30d: 365,
      completionRate30d: 0.84,
      buybacksUsd30d: 14000,
      convictionPct: 62,
      retention30d: 0.60
    },
    social: {
      twitter: 'https://twitter.com/memefactory',
      website: 'https://meme.factory'
    },
    logo: 'M'
  },
  {
    id: '14',
    symbol: 'GAINS',
    name: 'GainsDAO',
    chain: 'ETH',
    verified: true,
    isLive: true,
    stats: {
      feesUsd30d: 134000,
      uniqueContributors30d: 612,
      completionRate30d: 0.88,
      buybacksUsd30d: 26000,
      convictionPct: 75,
      retention30d: 0.69
    },
    social: {
      twitter: 'https://twitter.com/gainsdao',
      website: 'https://gains.dao'
    },
    logo: 'G'
  },
  {
    id: '15',
    symbol: 'HODL',
    name: 'HODL Protocol',
    chain: 'SOL',
    verified: true,
    isLive: false,
    stats: {
      feesUsd30d: 156000,
      uniqueContributors30d: 721,
      completionRate30d: 0.93,
      buybacksUsd30d: 29500,
      convictionPct: 77,
      retention30d: 0.73
    },
    social: {
      twitter: 'https://twitter.com/hodlprotocol',
      website: 'https://hodl.protocol'
    },
    logo: 'H'
  }
]

export const AGENCIES: AgencyEntry[] = [
  {
    id: '1',
    name: 'Crypto Media Labs',
    verified: true,
    stats: {
      totalCampaigns30d: 42,
      avgCampaignSuccessRate: 0.96,
      totalSpendUsd30d: 285000,
      activeCreators30d: 127,
      convictionPct: 82,
      convictionDelta7d: 11.2
    },
    social: {
      twitter: 'https://twitter.com/cryptomedialabs',
      website: 'https://cryptomedialabs.io'
    },
    logo: 'CM'
  },
  {
    id: '2',
    name: 'Degen Studios',
    verified: true,
    stats: {
      totalCampaigns30d: 28,
      avgCampaignSuccessRate: 0.92,
      totalSpendUsd30d: 178000,
      activeCreators30d: 89,
      convictionPct: 74,
      convictionDelta7d: 8.5
    },
    social: {
      twitter: 'https://twitter.com/degenstudios',
      website: 'https://degen.studios'
    },
    logo: 'DS'
  },
  {
    id: '3',
    name: 'Alpha Agency',
    verified: true,
    stats: {
      totalCampaigns30d: 35,
      avgCampaignSuccessRate: 0.98,
      totalSpendUsd30d: 215000,
      activeCreators30d: 104,
      convictionPct: 86,
      convictionDelta7d: 13.8
    },
    social: {
      twitter: 'https://twitter.com/alphaagency',
      website: 'https://alpha.agency'
    },
    logo: 'AA'
  },
  {
    id: '4',
    name: 'Viral Vault',
    verified: false,
    stats: {
      totalCampaigns30d: 19,
      avgCampaignSuccessRate: 0.87,
      totalSpendUsd30d: 124000,
      activeCreators30d: 56,
      convictionPct: 68,
      convictionDelta7d: 6.2
    },
    social: {
      twitter: 'https://twitter.com/viralvault'
    },
    logo: 'VV'
  },
  {
    id: '5',
    name: 'Meme Marketing Co',
    verified: true,
    stats: {
      totalCampaigns30d: 31,
      avgCampaignSuccessRate: 0.94,
      totalSpendUsd30d: 198000,
      activeCreators30d: 95,
      convictionPct: 78,
      convictionDelta7d: 9.7
    },
    social: {
      twitter: 'https://twitter.com/mememarketing',
      website: 'https://meme.marketing'
    },
    logo: 'MM'
  }
]

export const CURRENT_SEASON: SeasonInfo = {
  number: 3,
  name: 'Impact Season',
  startDate: '2025-01-01',
  endDate: '2025-03-31',
  prizePoolUsd: 500000,
  rulesUrl: '/season-rules'
}

export const HALL_OF_FAME: HallOfFameEntry[] = [
  { rank: 1, handle: '@solwizard', name: 'Sol Wizard', finalScore: 98.7, avatar: 'SW' },
  { rank: 2, handle: '@pumplord', name: 'Pump Lord', finalScore: 96.3, avatar: 'PL' },
  { rank: 3, handle: '@cryptoking', name: 'CryptoKing', finalScore: 94.8, avatar: 'CK' },
  { rank: 4, handle: '@alphasniper', name: 'Alpha Sniper', finalScore: 92.5, avatar: 'AS' },
  { rank: 5, handle: '@tokenomist', name: 'The Tokenomist', finalScore: 90.2, avatar: 'TT' },
  { rank: 6, handle: '@gainsgoblin', name: 'Gains Goblin', finalScore: 88.6, avatar: 'GG' },
  { rank: 7, handle: '@pixelvault', name: 'PixelVault', finalScore: 86.9, avatar: 'PV' },
  { rank: 8, handle: '@raidsquad', name: 'Raid Squad', finalScore: 84.3, avatar: 'RS' },
  { rank: 9, handle: '@degenace', name: 'Degen Ace', finalScore: 82.1, avatar: 'DA' },
  { rank: 10, handle: '@clipmaster', name: 'ClipMaster', finalScore: 79.8, avatar: 'CM' }
]
