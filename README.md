# $LAUNCH - Unified Platform MVP

**From Twitch to Rich** - Turn entertainment into finance. Connect streamers, clippers, and agencies with a unified platform for content monetization.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🚀 Features

### 7 Card Types
- **🚀 Launches** - Token TGEs and project launches
- **📹 Campaigns** - Clipping and promotion campaigns
- **⚔️ Raids** - Coordinated social media raids
- **🎯 Predictions** - Live betting and outcomes
- **💰 Ads** - Sponsored OBS widgets
- **🎮 Quests** - Daily/weekly engagement tasks
- **⭐ Spotlights** - Featured creators and content

### Pages
- **Home** - Hero, stats, and features
- **Discover** (`/explore`) - Browse all projects with filters
- **Engage** (`/engage`) - StreamWars, raids, quests
- **Tools** (`/tools`) - Widgets, campaigns, launches
- **Community** (`/community`) - Frenwork directory

### OBS Widgets
- Prediction Widget - Live voting
- Social Widget - Follow goals
- Ads Widget - Sponsored banners

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix)
- **Icons**: Lucide React
- **Authentication**: Privy v3.3.0 (Embedded Solana Wallets)
- **Blockchain**: Solana (web3.js + @solana/kit v4.0.0)
- **Backend**: Appwrite (Database, Auth, Storage)
- **State**: React local state + Zustand

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Kermit457/-LAUNCH-unified-platform-MVP.git

# Navigate to project
cd -LAUNCH-unified-platform-MVP

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Privy, Solana, and Appwrite credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### ⚠️ Important Configuration Notes

**Privy + Solana Setup**: This project uses Privy for authentication with embedded Solana wallets. Configuration is critical. See [PRIVY_SOLANA_CONFIG_REFERENCE.md](./PRIVY_SOLANA_CONFIG_REFERENCE.md) for:
- Correct import statements
- PrivyProvider configuration with RPC endpoints
- Transaction signing patterns
- Common errors and solutions

**If you get RPC errors**, always check `PRIVY_SOLANA_CONFIG_REFERENCE.md` first.

## 🗂 Project Structure

```
WIDGETS FOR LAUNCH/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── explore/page.tsx         # Main feed with filters
│   ├── engage/page.tsx          # StreamWars, raids, quests
│   ├── tools/page.tsx           # Creator tools
│   ├── community/page.tsx       # Frenwork directory
│   ├── predictions/page.tsx     # Prediction widget config
│   ├── social/page.tsx          # Social widget config
│   ├── ads/page.tsx             # Ads widget config
│   ├── marketplace/page.tsx     # Project marketplace
│   ├── earnings/page.tsx        # Revenue dashboard
│   └── widget/page.tsx          # Widget viewer
│
├── components/
│   ├── NavBar.tsx               # Main navigation
│   ├── ProjectCard.tsx          # Unified card component
│   ├── ui/                      # ShadCN components
│   └── widgets/                 # Demo widgets
│
├── lib/
│   ├── sampleData.ts            # Mock project data
│   ├── cn.ts                    # Utility functions
│   └── utils.ts
│
└── types/
    └── index.ts                 # TypeScript types
```

## 🎨 Features Breakdown

### Explore Page
- Filter by type (All, Launch, Campaign, Raid, etc.)
- Responsive 1-3 column grid
- Type-specific gradient colors
- Progress bars for campaigns
- Status badges (live/upcoming/ended)

### ProjectCard Component
- Unified design for all 7 types
- Shows: title, subtitle, pill, progress, stats, platforms
- Type-specific gradients
- Responsive hover effects

### Dark Theme
- Background: #0a0a0a → #1a1a1a gradient
- Glassmorphism cards with backdrop blur
- Pink → Purple accent gradient
- White text with opacity variations

## 🔮 Future Enhancements

### Backend Integration
- [ ] Supabase real-time database
- [ ] User authentication
- [ ] Wallet connection (Phantom/MetaMask)
- [ ] $LAUNCH token integration

### Features
- [ ] Real-time updates via WebSockets
- [ ] Search and advanced filters
- [ ] User profiles
- [ ] Analytics dashboard
- [ ] Mobile app

### Monetization
- [ ] Campaign creation wizard
- [ ] Token launch wizard
- [ ] Automated payouts
- [ ] Points redemption system

## 📝 TODOs

See inline comments marked with `// TODO:` throughout the codebase for specific integration points:
- Supabase queries
- Wallet connect logic
- Real-time subscriptions
- Analytics tracking

## 🤝 Contributing

This is a demo MVP. For production use:
1. Replace mock data with Supabase/API calls
2. Add authentication
3. Implement wallet integration
4. Add proper error handling
5. Write tests

## 📄 License

MIT

## 🙏 Credits

Built with [Claude Code](https://claude.com/claude-code)

---

**Status**: Demo MVP (Front-end only)
**Mock Data**: 18 projects across 7 card types
**Ready For**: Backend integration, wallet connect, token launch
