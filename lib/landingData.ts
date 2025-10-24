export const landingData = {
  hero: {
    headline: "LaunchOS — The Viral Launch Engine for Builders, Creators & Degens",
    subline: "Powering Internet Capital Markets & Creator Monetization in one unified stack. Build. Boost. Earn.",
    ctas: [
      { label: "Create Launch", href: "/create", variant: "primary" as const },
      { label: "Explore Projects", href: "/discover", variant: "secondary" as const },
      { label: "Start Earning", href: "/earn", variant: "ghost" as const }
    ]
  },

  counters: {
    totalEarned: 2436789,
    contributions: 127453,
    feesGenerated: 186234,
    updateInterval: 5000
  },

  socialProof: {
    partners: [
      { name: "Pumpfun", logo: "/logos/pumpfun.png" },
      { name: "Bagwork", logo: "/logos/bagwork.png" },
      { name: "BaseD", logo: "/logos/based.png" },
      { name: "Solana", logo: "/logos/solana.png" },
      { name: "Jupiter", logo: "/logos/jupiter.png" }
    ],
    stats: {
      creators: "12K+",
      label: "Trusted by creators"
    }
  },

  stories: [
    {
      id: "pumpfun",
      name: "Pumpfun",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=PUMP&backgroundColor=a855f7",
      stat: "$115M total valuation driven by creator clips",
      quote: "Ark Invest's Cathie Wood called Pumpfun the new economy of meme coin launches.",
      category: "Clipping Campaign",
      color: "lime" as const
    },
    {
      id: "bagwork",
      name: "Bagwork",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=BAG&backgroundColor=06b6d4",
      stat: "$2.8M earned by 800+ clippers in 90 days",
      quote: "LaunchOS turned our community into a viral marketing engine.",
      category: "Raid Campaign",
      color: "cyan" as const
    },
    {
      id: "based",
      name: "BaseD",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=BASE&backgroundColor=8b5cf6",
      stat: "45K+ network interactions, 12x engagement boost",
      quote: "The conviction score system helped us find real believers early.",
      category: "ICM Launch",
      color: "lime" as const
    }
  ],

  icmccm: {
    headline: "What is ICM + CCM? The Future of Capital Formation.",
    subline: "LaunchOS combines token launches (ICM) with creator monetization (CCM) to build capital AND community simultaneously.",
    benefits: [
      {
        icon: "Rocket",
        title: "Launch Ideas Into Markets",
        description: "Deploy tokens, set conviction thresholds, attract capital",
        tagline: "Turn your idea into a liquid market in minutes"
      },
      {
        icon: "Video",
        title: "Monetize Content & Campaigns",
        description: "Clipping, raids, bounties, predictions",
        tagline: "Creators earn while builders gain viral reach"
      },
      {
        icon: "Globe",
        title: "Network Effects Win",
        description: "Contributions, conviction scores, reputation",
        tagline: "Trust and engagement compound over time"
      }
    ]
  },

  features: [
    {
      id: "launch",
      icon: "Rocket",
      title: "Create & Launch",
      description: "Deploy ICM tokens or CCM campaigns. Set rules, pool funds, go live in minutes.",
      cta: { label: "Start Building", href: "/create" },
      gradient: "from-lime-500 to-lime-500"
    },
    {
      id: "engage",
      icon: "Zap",
      title: "Engage & Amplify",
      description: "Raids, clipping, bounties, predictions. Turn your community into a growth engine.",
      cta: { label: "View Campaigns", href: "/engage" },
      gradient: "from-lime-500 to-cyan-500"
    },
    {
      id: "earn",
      icon: "DollarSign",
      title: "Earn & Grow",
      description: "Creators earn per contribution. Builders pay for results. Fair, transparent, automated.",
      cta: { label: "See Earnings", href: "/earn" },
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      id: "network",
      icon: "Users",
      title: "Build Trust & Reputation",
      description: "Conviction scores, verified contributions, network effects. Your actions build your brand.",
      cta: { label: "Join Network", href: "/network" },
      gradient: "from-cyan-500 to-blue-500"
    }
  ],

  testimonials: [
    {
      id: "builder",
      quote: "We launched our token AND our creator network on LaunchOS. Hit $2M FDV in 48 hours with 300+ verified contributors.",
      author: "Alex Chen",
      role: "Founder @ SolFi",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AC&backgroundColor=a855f7"
    },
    {
      id: "creator",
      quote: "I've earned $12K in 6 weeks just clipping launches I believe in. LaunchOS changed my life.",
      author: "@cryptokelsey",
      role: "Top Clipper",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=CK&backgroundColor=06b6d4"
    },
    {
      id: "investor",
      quote: "The conviction score system filters noise. I only invest in launches with real community backing now.",
      author: "Sarah Martinez",
      role: "VC Partner",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SM&backgroundColor=10b981"
    }
  ],

  press: [
    { outlet: "CoinDesk", quote: "LaunchOS is redefining token launches" },
    { outlet: "The Block", quote: "Creator economy meets DeFi" },
    { outlet: "Decrypt", quote: "The platform bridging memes and markets" }
  ],

  network: {
    headline: "Your Network IS Your Net Worth",
    subline: "LaunchOS isn't just a platform—it's a reputation layer for the new internet economy.",
    benefits: [
      {
        title: "Conviction Scores",
        description: "Your contributions build credibility"
      },
      {
        title: "Verified Identity",
        description: "Twitter, wallet, on-chain history"
      },
      {
        title: "Referral Economy",
        description: "Earn from your network's success"
      }
    ]
  },

  finalCTA: {
    headline: "Ready to Launch Your Future?",
    subline: "Join 12K+ builders and creators turning ideas into capital.",
    ctas: [
      { label: "Create Your First Launch", href: "/create", variant: "primary" as const },
      { label: "Explore Live Projects", href: "/discover", variant: "secondary" as const }
    ],
    incentive: "Early users get: ✓ Fee discounts ✓ Priority support ✓ Network boost"
  }
}
