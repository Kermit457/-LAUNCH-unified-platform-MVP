import {
  ActivitySquare,
  Users,
  Zap,
  Activity,
  Swords,
  BadgeCheck,
  Megaphone,
  CandlestickChart,
  TrendingUp,
  Rocket,
  Download,
  Video,
  UserCheck,
  Gauge,
  Bot,
  PlugZap,
  Link2
} from 'lucide-react'

export type ToolCard = {
  id: string
  group: "OBS Widgets" | "Growth & Campaigns" | "Launch" | "Creator Ops" | "Integrations"
  title: string
  desc: string
  icon: React.ComponentType<{ className?: string }>
  actionLabel: "Configure" | "Open" | "Create" | "Start"
  href: string
  badges?: string[]
  enabled?: boolean
}

export const TOOL_CARDS: ToolCard[] = [
  // OBS Widgets
  { id: "prediction", group: "OBS Widgets", title: "Prediction Widget", desc: "Live voting, outcomes, and winner tracking.", icon: ActivitySquare, actionLabel: "Configure", href: "/predictions" },
  { id: "social", group: "OBS Widgets", title: "Social Goals Widget", desc: "Follow/subscribe goals for X, YouTube, Twitch, Discord.", icon: Users, actionLabel: "Configure", href: "/social" },
  { id: "ads", group: "OBS Widgets", title: "Ads Widget", desc: "Sponsored banners with payouts and tracking.", icon: Zap, actionLabel: "Configure", href: "/ads" },
  { id: "buybot", group: "OBS Widgets", title: "Buy-Bot / TX Ticker", desc: "Real-time trades and volume overlay.", icon: Activity, actionLabel: "Configure", href: "/widget", enabled: false },
  { id: "raid", group: "OBS Widgets", title: "Raid Overlay", desc: "One-click raid targets and progress.", icon: Swords, actionLabel: "Configure", href: "/widget", enabled: false },
  { id: "sigil", group: "OBS Widgets", title: "Sigil Watermark", desc: "Platform badge + watermark for streams.", icon: BadgeCheck, actionLabel: "Configure", href: "/widget", enabled: false },

  // Growth & Campaigns
  { id: "clipping", group: "Growth & Campaigns", title: "Clipping Campaign", desc: "Clipping, bounties, or paid promos. Set budgets and CPM.", icon: Video, actionLabel: "Create", href: "/earn" },
  { id: "raid-campaign", group: "Growth & Campaigns", title: "Raid", desc: "Organize coordinated raids and team actions.", icon: Swords, actionLabel: "Create", href: "/earn" },
  { id: "bounty", group: "Growth & Campaigns", title: "Bounty", desc: "Create task-based bounties with rewards.", icon: TrendingUp, actionLabel: "Create", href: "/earn" },
  { id: "pools", group: "Growth & Campaigns", title: "Prediction Pools", desc: "Create and settle markets for your stream.", icon: CandlestickChart, actionLabel: "Open", href: "/predictions", enabled: false },
  { id: "boosts", group: "Growth & Campaigns", title: "Boost Manager", desc: "Stake $LAUNCH to amplify discovery.", icon: Megaphone, actionLabel: "Open", href: "/discover", enabled: false },

  // Launch
  { id: "create-launch", group: "Launch", title: "Create Launch", desc: "Token or creator route with built-in tools.", icon: Rocket, actionLabel: "Start", href: "/discover" },
  { id: "import-token", group: "Launch", title: "Import Existing Token", desc: "Attach widgets, campaigns, and analytics.", icon: Download, actionLabel: "Open", href: "/discover" },

  // Creator Ops
  { id: "clips", group: "Creator Ops", title: "Clip Intake & Review", desc: "Approve submissions and manage payouts.", icon: Video, actionLabel: "Open", href: "/ops/clips", enabled: false },
  { id: "profile", group: "Creator Ops", title: "Profile & Verification", desc: "Wallets, socials, proof-of-stream.", icon: UserCheck, actionLabel: "Open", href: "/ops/profile", enabled: false },
  { id: "analytics", group: "Creator Ops", title: "Analytics & Conviction", desc: "On-chain, social, and campaign insights.", icon: Gauge, actionLabel: "Open", href: "/ops/analytics", enabled: false },

  // Integrations
  { id: "bots", group: "Integrations", title: "Discord & Telegram Bots", desc: "Alerts, tasks, and campaign sync.", icon: Bot, actionLabel: "Open", href: "/integrations/bots", enabled: false },
  { id: "api", group: "Integrations", title: "API & Webhooks", desc: "Programmatic access to tools and events.", icon: PlugZap, actionLabel: "Open", href: "/integrations/api", enabled: false },
  { id: "links", group: "Integrations", title: "Link-in-Bio / Shortlinks / QR", desc: "Trackable links for creators and teams.", icon: Link2, actionLabel: "Open", href: "/integrations/links", enabled: false },
]

export const GROUPS = [
  "OBS Widgets",
  "Growth & Campaigns",
  "Launch",
  "Creator Ops",
  "Integrations"
] as const
