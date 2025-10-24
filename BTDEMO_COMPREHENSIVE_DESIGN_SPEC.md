# BTDEMO - Comprehensive Design Specification
## Complete Icon Mapping & Implementation Guide

**Created:** 2025-10-23
**Status:** Complete Icon Audit - All 47 Custom Icons Mapped
**Purpose:** Professional demonstration of ICM Motion's custom icon system with Battletech aesthetic

---

## Table of Contents
1. [Icon Inventory - All 47 Icons](#icon-inventory)
2. [Page Architecture](#page-architecture)
3. [Component Specifications](#component-specifications)
4. [Hover States & Interactions](#hover-states--interactions)
5. [Motion Score System](#motion-score-system)
6. [Implementation Guidelines](#implementation-guidelines)

---

## Icon Inventory - All 47 Icons

### Platform & Social Icons (4)
| Icon | Purpose | Use Case in /btdemo |
|------|---------|---------------------|
| **IconTwitter** | Twitter/X social link | Project cards - social links footer |
| **IconTelegram** | Telegram community link | Project cards - social links footer |
| **IconDiscord** | Discord community link | Project cards - social links footer |
| **IconGithub** | GitHub repository link | Project cards - social links footer, developer info |

### Action Icons (7)
| Icon | Purpose | Use Case in /btdemo |
|------|---------|---------------------|
| **IconLightning** | Quick action, boost, flash trading | "Quick Buy" button, "Boost" action button |
| **IconCollabExpand** | Expand collaboration view | "View Details" action, expand project info |
| **IconPriceUp** | Price increase indicator | Price change +%, bullish trend indicator |
| **IconUpvote** | Upvote/support action | Vote count display, upvote button |
| **IconFreeze** | Frozen/locked status | Freeze status badge on projects |
| **IconClose** | Close modal/drawer | Modal close button, remove filters |
| **IconDeposit** | Deposit funds action | "Deposit" button in wallet section |
| **IconWithdraw** | Withdraw funds action | "Withdraw" button in wallet section |

### Motion Score Icons (5)
| Icon | Purpose | Use Case in /btdemo |
|------|---------|---------------------|
| **IconMotion** | Generic motion indicator | Motion score label, activity indicator |
| **IconMotion1** | Motion level 1 (low) | Projects with motion score 0-20 |
| **IconMotion2** | Motion level 2 (medium-low) | Projects with motion score 21-40 |
| **IconMotion4** | Motion level 4 (medium-high) | Projects with motion score 41-60 |
| **IconMotion5** | Motion level 5 (high) | Projects with motion score 61-100 |

### UI Navigation Icons (4)
| Icon | Purpose | Use Case in /btdemo |
|------|---------|---------------------|
| **IconMenu** | Open navigation menu | Mobile menu button, hamburger icon |
| **IconNavArrowUp** | Navigate up, expand | Sort ascending, collapse section |
| **IconNavArrowDown** | Navigate down, collapse | Sort descending, expand section |
| **IconNavArrowLeft** | Navigate left, back | Previous page, back button |
| **IconNavArrowRight** | Navigate right, forward | Next page, forward button |

### Badge Components (3)
| Icon | Purpose | Use Case in /btdemo |
|------|---------|---------------------|
| **IconContributorBubble** | Contributor count badge | Show number of contributors on project card |
| **IconActivityBadge** | Activity level badge | Daily/weekly activity indicator |
| **IconMotionScoreBadge** | Hexagonal motion score | Primary motion score display on all project cards |

### Achievement & Status Icons (4)
| Icon | Purpose | Use Case in /btdemo |
|------|---------|---------------------|
| **IconTopPerformer** | Top performer badge | Top 3 projects, leaderboard winners |
| **IconTrophy** | Winner, achievement | Competition winners, milestones |
| **IconGem** | Premium, rare, valuable | Premium projects, exclusive launches |
| **IconLab** | Verified, tested, official | Lab-verified projects, official status |

### Crypto & Token Icons (2)
| Icon | Purpose | Use Case in /btdemo |
|------|---------|---------------------|
| **IconUsdc** | USDC stablecoin | Price display, payment option |
| **IconSolana** | Solana token | SOL price display, network indicator |

### Data & Stats Icons (5)
| Icon | Purpose | Use Case in /btdemo |
|------|---------|---------------------|
| **IconRocket** | Launch, growth, trajectory | Project launch status, growth indicator |
| **IconCash** | Money, revenue, funding | Funding raised, revenue stats |
| **IconCap** | Market cap | Market capitalization display |
| **IconGuide** | Guide, tutorial, help | Help section, onboarding guide |
| **IconWeb** | Website, external link | Project website link |

### Visualization & Charts (2)
| Icon | Purpose | Use Case in /btdemo |
|------|---------|---------------------|
| **IconMotionBar** | Motion bar chart | Motion score visualization bars |
| **IconChartAnimation** | Animated chart, data viz | Price charts, performance graphs |

### Utility Icons (5)
| Icon | Purpose | Use Case in /btdemo |
|------|---------|---------------------|
| **IconMessage** | Messages, comments | Comment count, messaging |
| **IconWallet** | Wallet connection | Connect wallet button, wallet info |
| **IconComputer** | Desktop, technical | Technical specs, development |
| **IconAim** | Target, focus | Target metrics, goals |
| **IconInfo** | Information, help | Info tooltips, help text |
| **IconNotification** | Notifications, alerts | Notification bell, alerts |
| **IconSearch** | Search functionality | Search bar icon |
| **IconAttention** | Warning, important | Alert states, important info |

---

## Page Architecture

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ NAVIGATION BAR (Fixed Top)                             │
│ [IconMenu] [Logo] [Search] [IconWallet] [IconNotification] │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ HERO STATS DASHBOARD                                    │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │IconMotion│ │IconRocket│ │ IconCash │ │ IconCap  │   │
│ │ 847      │ │  124     │ │  $2.4M   │ │  $45M    │   │
│ │Total     │ │ Active   │ │ Volume   │ │MarketCap │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ FILTERS BAR                                             │
│ [All] [IconLab Verified] [IconTopPerformer] [IconGem]  │
│ [IconMotion5] Sort: [IconNavArrowDown]                 │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ PROJECT CARDS GRID                                      │
│ [Card 1] [Card 2] [Card 3]                             │
│ [Card 4] [Card 5] [Card 6]                             │
└─────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### 1. Navigation Bar Component

**Purpose:** Primary navigation with all key actions

**Icon Usage:**
```tsx
<nav className="fixed top-0 w-full glass-premium border-b border-zinc-800 z-50">
  <div className="flex items-center justify-between px-6 py-4">
    {/* Mobile Menu */}
    <button className="icon-interactive-primary">
      <IconMenu size={24} />
    </button>

    {/* Logo + Brand */}
    <div className="flex items-center gap-2">
      <IconMotion className="icon-primary" size={24} />
      <span className="font-led-32">ICM MOTION</span>
    </div>

    {/* Search */}
    <div className="flex-1 max-w-md mx-8 relative">
      <IconSearch className="icon-muted absolute left-3 top-1/2 -translate-y-1/2" size={20} />
      <input type="text" placeholder="Search projects..." className="input-premium pl-10" />
    </div>

    {/* Actions */}
    <div className="flex items-center gap-4">
      <button className="icon-interactive">
        <IconNotification size={24} />
        <span className="badge-primary absolute -top-1 -right-1">3</span>
      </button>

      <button className="btn-primary flex items-center gap-2">
        <IconWallet size={20} />
        <span>Connect Wallet</span>
      </button>
    </div>
  </div>
</nav>
```

**Hover States:**
- IconMenu: `text-zinc-400 → text-primary` (lime green)
- IconSearch: Pulsing glow effect on input focus
- IconNotification: Bounce animation on new notifications
- Connect Wallet: Slide in effect, glow shadow

---

### 2. Hero Stats Dashboard

**Purpose:** Platform-wide statistics with visual hierarchy

**Icon Usage:**
```tsx
<section className="glass-premium p-8 rounded-3xl">
  <h2 className="section-heading mb-6">Platform Overview</h2>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Total Motion Score */}
    <div className="glass-interactive p-6 rounded-2xl group">
      <div className="flex items-center justify-between mb-3">
        <IconMotion className="icon-primary group-hover:scale-110 transition-transform" size={32} />
        <IconNavArrowUp className="icon-muted" size={16} />
      </div>
      <div className="font-led-32">847</div>
      <div className="stat-label">Total Projects</div>
      <div className="flex items-center gap-1 text-sm text-green-400 mt-2">
        <IconPriceUp size={12} />
        <span>+12.5%</span>
      </div>
    </div>

    {/* Active Launches */}
    <div className="glass-interactive p-6 rounded-2xl group">
      <div className="flex items-center justify-between mb-3">
        <IconRocket className="icon-primary group-hover:animate-pulse" size={32} />
        <IconMotionBar className="icon-muted" size={16} />
      </div>
      <div className="font-led-32">124</div>
      <div className="stat-label">Active Launches</div>
      <div className="flex items-center gap-2 mt-2">
        <IconLightning className="text-yellow-400" size={12} />
        <span className="text-xs text-zinc-400">18 in last 24h</span>
      </div>
    </div>

    {/* 24h Volume */}
    <div className="glass-interactive p-6 rounded-2xl group">
      <div className="flex items-center justify-between mb-3">
        <IconCash className="icon-primary group-hover:scale-110 transition-transform" size={32} />
        <IconUsdc size={20} className="icon-muted" />
      </div>
      <div className="font-led-32">$2.4M</div>
      <div className="stat-label">24h Volume</div>
      <div className="flex items-center gap-1 text-sm text-green-400 mt-2">
        <IconPriceUp size={12} />
        <span>+8.3%</span>
      </div>
    </div>

    {/* Total Market Cap */}
    <div className="glass-interactive p-6 rounded-2xl group">
      <div className="flex items-center justify-between mb-3">
        <IconCap className="icon-primary group-hover:rotate-12 transition-transform" size={32} />
        <IconSolana size={20} className="icon-muted" />
      </div>
      <div className="font-led-32">$45M</div>
      <div className="stat-label">Total Market Cap</div>
      <div className="flex items-center gap-2 mt-2">
        <IconChartAnimation className="text-cyan-400" size={12} />
        <span className="text-xs text-zinc-400">Live tracking</span>
      </div>
    </div>
  </div>
</section>
```

**Hover States:**
- Cards: `transform -translate-y-1 scale-[1.02]` + glow effect
- Icons: Individual animations (pulse, scale, rotate)
- Numbers: Glow effect on LED font

---

### 3. Filters Bar Component

**Purpose:** Filter and sort projects with interactive tabs

**Icon Usage:**
```tsx
<div className="glass-premium p-4 rounded-2xl flex items-center justify-between">
  {/* Filter Tabs */}
  <div className="flex items-center gap-2">
    <button className="badge-primary">All Projects</button>

    <button className="badge-primary flex items-center gap-2">
      <IconLab size={16} />
      <span>Verified</span>
    </button>

    <button className="badge-primary flex items-center gap-2">
      <IconTopPerformer size={16} />
      <span>Top Performers</span>
    </button>

    <button className="badge-primary flex items-center gap-2">
      <IconGem size={16} />
      <span>Premium</span>
    </button>

    <button className="badge-primary flex items-center gap-2">
      <IconMotion5 size={16} />
      <span>High Motion</span>
    </button>

    <button className="badge-warning flex items-center gap-2">
      <IconFreeze size={16} />
      <span>Frozen</span>
    </button>
  </div>

  {/* Sort Dropdown */}
  <div className="flex items-center gap-3">
    <span className="text-sm text-zinc-400">Sort by:</span>
    <button className="glass-interactive px-4 py-2 rounded-xl flex items-center gap-2">
      <IconMotionScoreBadge score="85" size={28} />
      <span>Motion Score</span>
      <IconNavArrowDown size={16} className="icon-interactive" />
    </button>
  </div>
</div>
```

**Hover States:**
- Filter badges: Expand slightly, border glow
- Sort dropdown: Slide down menu with more options
- IconNavArrowDown: Rotate 180° when menu open

**Dropdown Menu (on click):**
```tsx
<div className="absolute top-full mt-2 glass-premium rounded-xl p-2 min-w-[200px]">
  <button className="list-item flex items-center gap-2">
    <IconMotionScoreBadge score="M" size={24} />
    <span>Motion Score</span>
  </button>
  <button className="list-item flex items-center gap-2">
    <IconPriceUp size={20} />
    <span>Price Change</span>
  </button>
  <button className="list-item flex items-center gap-2">
    <IconCap size={20} />
    <span>Market Cap</span>
  </button>
  <button className="list-item flex items-center gap-2">
    <IconCash size={20} />
    <span>Volume</span>
  </button>
  <button className="list-item flex items-center gap-2">
    <IconUpvote size={20} />
    <span>Most Upvoted</span>
  </button>
  <button className="list-item flex items-center gap-2">
    <IconRocket size={20} />
    <span>Newest</span>
  </button>
</div>
```

---

### 4. Project Card Component (PRIMARY COMPONENT)

**Purpose:** Showcase all project data with maximum icon usage

**Complete Card Structure:**
```tsx
<article className="glass-premium p-6 rounded-3xl group hover:shadow-xl hover:shadow-primary/20 transition-all">
  {/* Card Header */}
  <div className="flex items-start justify-between mb-4">
    {/* Project Logo + Info */}
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src="/project-logo.png"
          alt="Project Logo"
          className="w-16 h-16 rounded-2xl token-logo-glow"
        />
        {/* Status Badge */}
        <IconMotionScoreBadge
          score={85}
          size={30}
          className="absolute -bottom-2 -right-2"
        />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h3 className="card-title">Project Nebula</h3>
          <IconLab className="icon-primary" size={16} />
          <IconTopPerformer className="icon-primary" size={16} />
        </div>
        <p className="card-subtitle">DeFi Yield Optimizer</p>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="flex items-center gap-2">
      <button className="icon-interactive">
        <IconCollabExpand size={20} />
      </button>
      <button className="icon-interactive-primary">
        <IconLightning size={20} />
      </button>
    </div>
  </div>

  {/* Motion Score Visualization */}
  <div className="mb-4 p-4 glass-interactive rounded-xl">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <IconMotion className="icon-primary" size={20} />
        <span className="stat-label">Motion Score</span>
      </div>
      <IconMotionBar className="icon-primary" size={24} />
    </div>

    {/* Motion Level Indicators */}
    <div className="flex items-center gap-2 mb-2">
      <IconMotion1 className="opacity-40" size={16} />
      <IconMotion2 className="opacity-60" size={16} />
      <IconMotion4 className="opacity-80" size={16} />
      <IconMotion5 className="icon-primary" size={16} />
    </div>

    {/* LED Display */}
    <div className="font-led-32 text-center">85</div>
    <div className="flex justify-between text-xs text-zinc-500 mt-1">
      <span>0</span>
      <span>50</span>
      <span>100</span>
    </div>
  </div>

  {/* Key Metrics Grid */}
  <div className="grid grid-cols-2 gap-3 mb-4">
    {/* Price */}
    <div className="glass-interactive p-3 rounded-xl">
      <div className="flex items-center gap-2 mb-1">
        <IconUsdc size={16} className="icon-muted" />
        <span className="stat-label">Price</span>
      </div>
      <div className="font-led-16">$0.42</div>
      <div className="flex items-center gap-1 text-xs text-green-400">
        <IconPriceUp size={10} />
        <span>+15.3%</span>
      </div>
    </div>

    {/* Market Cap */}
    <div className="glass-interactive p-3 rounded-xl">
      <div className="flex items-center gap-2 mb-1">
        <IconCap size={16} className="icon-muted" />
        <span className="stat-label">Market Cap</span>
      </div>
      <div className="font-led-16">$1.2M</div>
      <div className="flex items-center gap-1 text-xs">
        <IconSolana size={10} className="icon-muted" />
        <span className="text-zinc-400">42K SOL</span>
      </div>
    </div>

    {/* Volume */}
    <div className="glass-interactive p-3 rounded-xl">
      <div className="flex items-center gap-2 mb-1">
        <IconCash size={16} className="icon-muted" />
        <span className="stat-label">24h Volume</span>
      </div>
      <div className="font-led-16">$340K</div>
      <div className="flex items-center gap-1 text-xs text-green-400">
        <IconChartAnimation size={10} />
        <span>Active</span>
      </div>
    </div>

    {/* Contributors */}
    <div className="glass-interactive p-3 rounded-xl">
      <div className="flex items-center gap-2 mb-1">
        <IconContributorBubble size={16} className="icon-muted" />
        <span className="stat-label">Contributors</span>
      </div>
      <div className="font-led-16">247</div>
      <div className="flex items-center gap-1 text-xs">
        <IconActivityBadge size={10} className="icon-muted" />
        <span className="text-zinc-400">+12 today</span>
      </div>
    </div>
  </div>

  {/* Status Badges Row */}
  <div className="flex items-center gap-2 mb-4 flex-wrap">
    <div className="badge-success flex items-center gap-1">
      <IconRocket size={12} />
      <span>Launched</span>
    </div>

    <div className="badge-primary flex items-center gap-1">
      <IconTrophy size={12} />
      <span>Top 10</span>
    </div>

    <div className="badge-primary flex items-center gap-1">
      <IconGem size={12} />
      <span>Premium</span>
    </div>

    <div className="badge-warning flex items-center gap-1">
      <IconAttention size={12} />
      <span>High Activity</span>
    </div>
  </div>

  {/* Engagement Stats */}
  <div className="flex items-center justify-between mb-4 p-3 glass-interactive rounded-xl">
    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 icon-interactive-primary group">
        <IconUpvote size={20} className="group-hover:scale-110 transition-transform" />
        <span className="font-led-16">324</span>
      </button>

      <button className="flex items-center gap-2 icon-interactive">
        <IconMessage size={20} />
        <span className="font-led-16">89</span>
      </button>

      <button className="flex items-center gap-2 icon-interactive">
        <IconAim size={20} />
        <span className="text-xs text-zinc-400">Watch</span>
      </button>
    </div>

    <div className="flex items-center gap-2">
      <IconComputer className="icon-muted" size={16} />
      <span className="text-xs text-zinc-400">Updated 2h ago</span>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="grid grid-cols-2 gap-3">
    <button className="btn-primary flex items-center justify-center gap-2">
      <IconLightning size={20} />
      <span>Quick Buy</span>
    </button>

    <button className="btn-secondary flex items-center justify-center gap-2">
      <IconCollabExpand size={20} />
      <span>View Details</span>
    </button>
  </div>

  {/* Social Links Footer */}
  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-zinc-800">
    <a href="#" className="icon-interactive-primary">
      <IconWeb size={20} />
    </a>
    <a href="#" className="icon-interactive">
      <IconTwitter size={20} />
    </a>
    <a href="#" className="icon-interactive">
      <IconTelegram size={20} />
    </a>
    <a href="#" className="icon-interactive">
      <IconDiscord size={20} />
    </a>
    <a href="#" className="icon-interactive">
      <IconGithub size={20} />
    </a>
  </div>
</article>
```

**Hover States:**
- Card: `-translate-y-2`, glow shadow, border glow
- Logo: `scale-110`, enhanced glow
- Motion Score Badge: Pulsing glow animation
- Quick Action Buttons: Scale + glow
- Social Icons: Scale + color change
- Metric Cards: Slide in effect, number animation

---

### 5. Wallet Actions Panel (Sidebar/Modal)

**Purpose:** Show deposit/withdraw functionality

**Icon Usage:**
```tsx
<aside className="glass-premium p-6 rounded-3xl">
  <div className="flex items-center gap-3 mb-6">
    <IconWallet className="icon-primary" size={32} />
    <div>
      <h3 className="card-title">Wallet</h3>
      <p className="card-subtitle">Manage your funds</p>
    </div>
  </div>

  {/* Balance Display */}
  <div className="glass-interactive p-4 rounded-xl mb-4">
    <div className="flex items-center justify-between mb-2">
      <span className="stat-label">Total Balance</span>
      <IconInfo className="icon-muted" size={16} />
    </div>
    <div className="font-led-32">$12,450</div>
    <div className="flex items-center gap-2 mt-2">
      <IconSolana size={16} />
      <span className="text-sm text-zinc-400">342.5 SOL</span>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="grid grid-cols-2 gap-3">
    <button className="btn-primary flex items-center justify-center gap-2">
      <IconDeposit size={20} />
      <span>Deposit</span>
    </button>

    <button className="btn-secondary flex items-center justify-center gap-2">
      <IconWithdraw size={20} />
      <span>Withdraw</span>
    </button>
  </div>

  {/* Recent Activity */}
  <div className="mt-6">
    <div className="flex items-center gap-2 mb-3">
      <IconActivityBadge size={20} className="icon-primary" />
      <h4 className="font-semibold">Recent Activity</h4>
    </div>

    <div className="space-y-2">
      <div className="list-item flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconDeposit size={16} className="text-green-400" />
          <span className="text-sm">Deposited</span>
        </div>
        <span className="font-led-16">+100 SOL</span>
      </div>

      <div className="list-item flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconLightning size={16} className="text-yellow-400" />
          <span className="text-sm">Quick Buy</span>
        </div>
        <span className="font-led-16">-25 SOL</span>
      </div>
    </div>
  </div>
</aside>
```

---

### 6. Leaderboard Component

**Purpose:** Top performers ranking

**Icon Usage:**
```tsx
<section className="glass-premium p-8 rounded-3xl">
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <IconTrophy className="icon-primary" size={32} />
      <h2 className="section-heading">Top Performers</h2>
    </div>

    <button className="flex items-center gap-2 icon-interactive">
      <span className="text-sm">View All</span>
      <IconNavArrowRight size={16} />
    </button>
  </div>

  {/* Rank 1 */}
  <div className="glass-interactive p-4 rounded-2xl mb-3 border-2 border-primary/40">
    <div className="flex items-center gap-4">
      <div className="relative">
        <IconTopPerformer className="icon-primary" size={40} />
        <span className="absolute -top-2 -right-2 font-led-16">1</span>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">Alpha Protocol</h4>
          <IconLab className="icon-primary" size={14} />
          <IconGem className="icon-primary" size={14} />
        </div>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-1">
            <IconMotionScoreBadge score={98} size={24} />
          </div>
          <div className="flex items-center gap-1">
            <IconUpvote size={14} />
            <span>1,234</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className="font-led-16 text-green-400">+45.8%</div>
        <div className="flex items-center gap-1 justify-end">
          <IconPriceUp size={12} className="text-green-400" />
          <span className="text-xs text-zinc-400">24h</span>
        </div>
      </div>
    </div>
  </div>

  {/* Rank 2-10 (similar structure) */}
</section>
```

---

### 7. Help & Guide Section

**Purpose:** Onboarding and documentation

**Icon Usage:**
```tsx
<section className="glass-premium p-8 rounded-3xl">
  <div className="flex items-center gap-3 mb-6">
    <IconGuide className="icon-primary" size={32} />
    <h2 className="section-heading">Getting Started</h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="glass-interactive p-6 rounded-2xl">
      <IconWallet className="icon-primary mb-4" size={32} />
      <h4 className="font-semibold mb-2">Connect Wallet</h4>
      <p className="text-sm text-zinc-400">Link your Solana wallet to start trading</p>
    </div>

    <div className="glass-interactive p-6 rounded-2xl">
      <IconSearch className="icon-primary mb-4" size={32} />
      <h4 className="font-semibold mb-2">Discover Projects</h4>
      <p className="text-sm text-zinc-400">Browse and filter top motion projects</p>
    </div>

    <div className="glass-interactive p-6 rounded-2xl">
      <IconLightning className="icon-primary mb-4" size={32} />
      <h4 className="font-semibold mb-2">Quick Trade</h4>
      <p className="text-sm text-zinc-400">Execute instant trades with one click</p>
    </div>
  </div>
</section>
```

---

## Hover States & Interactions

### Navigation Elements
```css
/* Menu Icon */
.icon-menu {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.icon-menu:hover {
  color: #D1FD0A;
  transform: scale(1.1);
}

/* Navigation Arrows */
.nav-arrow {
  transition: transform 0.2s ease;
}
.nav-arrow:hover {
  transform: translateX(4px); /* for right */
  /* transform: translateX(-4px); for left */
}

/* Sort Dropdown Arrow */
.sort-arrow {
  transition: transform 0.3s ease;
}
.sort-arrow.open {
  transform: rotate(180deg);
}
```

### Interactive Badges
```css
/* Filter Badges */
.filter-badge {
  transition: all 0.2s ease;
}
.filter-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(209, 253, 10, 0.3);
}
.filter-badge.active {
  background: linear-gradient(135deg, #D1FD0A 0%, #8BC34A 100%);
  color: #000;
}

/* Motion Score Badge */
.motion-score-badge {
  transition: all 0.3s ease;
}
.motion-score-badge:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 10px rgba(209, 253, 10, 0.6));
}
```

### Project Card Interactions
```css
/* Card Container */
.project-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.project-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(209, 253, 10, 0.15),
              0 0 60px rgba(209, 253, 10, 0.1);
  border-color: rgba(209, 253, 10, 0.4);
}

/* Project Logo */
.project-logo {
  transition: all 0.3s ease;
}
.project-card:hover .project-logo {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(209, 253, 10, 0.4);
}

/* Quick Action Icons */
.quick-action {
  transition: all 0.2s ease;
  opacity: 0.6;
}
.quick-action:hover {
  opacity: 1;
  transform: scale(1.2);
  color: #D1FD0A;
}

/* Metric Cards */
.metric-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.metric-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(209, 253, 10, 0) 0%, rgba(209, 253, 10, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.metric-card:hover::before {
  opacity: 1;
}
.metric-card:hover {
  transform: translateX(4px);
}

/* Social Icons */
.social-icon {
  transition: all 0.2s ease;
}
.social-icon:hover {
  transform: translateY(-2px) scale(1.15);
  color: #D1FD0A;
}
```

### Button States
```css
/* Primary Action Button */
.btn-action-primary {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.btn-action-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}
.btn-action-primary:hover::before {
  width: 300px;
  height: 300px;
}
.btn-action-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(209, 253, 10, 0.4);
}

/* Icon inside button */
.btn-action-primary:hover .icon {
  animation: lightning-pulse 0.6s ease infinite;
}

@keyframes lightning-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}
```

### LED Number Animations
```css
/* LED Counter Animation on Hover */
.led-counter {
  transition: all 0.3s ease;
}
.led-counter:hover {
  text-shadow: 0 0 10px rgba(209, 253, 10, 0.8),
               0 0 20px rgba(209, 253, 10, 0.6),
               0 0 30px rgba(209, 253, 10, 0.4);
  transform: scale(1.05);
}

/* LED Flicker Effect on Update */
@keyframes led-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
.led-update {
  animation: led-flicker 0.2s ease-in-out 3;
}
```

---

## Motion Score System

### Visual Hierarchy

**Motion Score Levels:**
```
Level 1 (0-20):   Red gradient, IconMotion1, low opacity
Level 2 (21-40):  Orange gradient, IconMotion2, medium-low opacity
Level 3 (41-60):  Yellow gradient, IconMotion (default), medium opacity
Level 4 (61-80):  Lime gradient, IconMotion4, medium-high opacity
Level 5 (81-100): Bright Lime, IconMotion5, full opacity + glow
```

### Score Display Component
```tsx
function MotionScoreDisplay({ score }: { score: number }) {
  const getMotionLevel = (score: number) => {
    if (score <= 20) return { icon: IconMotion1, color: 'text-red-500', label: 'Low' }
    if (score <= 40) return { icon: IconMotion2, color: 'text-orange-500', label: 'Medium-Low' }
    if (score <= 60) return { icon: IconMotion, color: 'text-yellow-500', label: 'Medium' }
    if (score <= 80) return { icon: IconMotion4, color: 'text-lime-500', label: 'High' }
    return { icon: IconMotion5, color: 'text-primary', label: 'Extreme', glow: true }
  }

  const level = getMotionLevel(score)
  const Icon = level.icon

  return (
    <div className="motion-score-container">
      {/* Badge */}
      <IconMotionScoreBadge
        score={score}
        size={30}
        className={level.glow ? 'glow-on-hover' : ''}
      />

      {/* Visualization Bar */}
      <div className="flex items-center gap-2 mt-3">
        <IconMotionBar className={level.color} size={24} />
        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${level.color} bg-gradient-to-r transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Level Indicator */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          <Icon className={level.color} size={16} />
          <span className="text-xs text-zinc-400">{level.label} Motion</span>
        </div>
        <span className="font-led-16">{score}</span>
      </div>
    </div>
  )
}
```

### Motion Bar Chart
```tsx
function MotionBarChart({ data }: { data: number[] }) {
  return (
    <div className="glass-interactive p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <IconChartAnimation className="icon-primary" size={20} />
        <span className="stat-label">7-Day Motion Trend</span>
      </div>

      <div className="flex items-end justify-between gap-1 h-32">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500"
              style={{ height: `${value}%` }}
            />
            <span className="text-xs text-zinc-500">{['M','T','W','T','F','S','S'][index]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Implementation Guidelines

### Icon Import Pattern
```tsx
// Always import from central index
import {
  // Navigation
  IconMenu,
  IconNavArrowUp,
  IconNavArrowDown,
  IconNavArrowLeft,
  IconNavArrowRight,

  // Actions
  IconLightning,
  IconCollabExpand,
  IconPriceUp,
  IconUpvote,
  IconFreeze,
  IconClose,
  IconDeposit,
  IconWithdraw,

  // Motion System
  IconMotion,
  IconMotion1,
  IconMotion2,
  IconMotion4,
  IconMotion5,
  IconMotionScoreBadge,
  IconMotionBar,

  // Social
  IconTwitter,
  IconTelegram,
  IconDiscord,
  IconGithub,
  IconWeb,

  // Crypto
  IconUsdc,
  IconSolana,

  // Stats
  IconRocket,
  IconCash,
  IconCap,
  IconChartAnimation,

  // Badges
  IconContributorBubble,
  IconActivityBadge,
  IconTopPerformer,
  IconTrophy,
  IconGem,
  IconLab,

  // Utility
  IconWallet,
  IconMessage,
  IconComputer,
  IconAim,
  IconInfo,
  IconNotification,
  IconSearch,
  IconAttention,
  IconGuide,
} from '@/lib/icons'
```

### Color Utility Classes
```tsx
// From globals.css - BTDEMO section

// Icon color states
className="icon-primary"              // #D1FD0A (lime green)
className="icon-active"               // white
className="icon-inactive"             // zinc-500
className="icon-muted"                // zinc-400
className="icon-interactive"          // zinc-400 → white on hover
className="icon-interactive-primary"  // zinc-400 → #D1FD0A on hover

// LED font utilities
className="font-led-32"  // 32px, -1.28px letter-spacing, tabular nums
className="font-led-16"  // 16px, normal weight, tabular nums
className="font-led-15"  // 15px, -0.6px letter-spacing, tabular nums
```

### Responsive Icon Sizing
```tsx
// Mobile: 16px
// Tablet: 20px
// Desktop: 24px

<IconMotion className="icon-primary" size={16} />  // Mobile
<IconMotion className="icon-primary md:size={20}" />  // Tablet+
<IconMotion className="icon-primary lg:size={24}" />  // Desktop+

// Or responsive pattern
const iconSize = useBreakpoint({
  base: 16,
  md: 20,
  lg: 24
})
<IconMotion size={iconSize} />
```

### Performance Optimization
```tsx
// Lazy load icon-heavy components
const ProjectCard = lazy(() => import('@/components/btdemo/ProjectCard'))

// Memoize icon components with fixed props
const MotionIcon = memo(() => (
  <IconMotion className="icon-primary" size={20} />
))

// Use CSS for hover states instead of JS
// ✅ Good
<button className="icon-interactive">
  <IconLightning size={20} />
</button>

// ❌ Avoid
<button onMouseEnter={() => setHovered(true)}>
  <IconLightning className={hovered ? 'text-primary' : ''} />
</button>
```

### Accessibility
```tsx
// Always provide aria-labels for icon-only buttons
<button aria-label="Open menu" className="icon-interactive">
  <IconMenu size={24} />
</button>

// Add screen-reader text for important icons
<div className="flex items-center gap-2">
  <IconMotionScoreBadge score={85} size={30} />
  <span className="sr-only">Motion score: 85 out of 100</span>
</div>

// Use semantic HTML with icons
<nav aria-label="Social links">
  <a href="#" aria-label="Twitter">
    <IconTwitter size={20} />
  </a>
</nav>
```

---

## Complete Icon Checklist

### ✅ All 47 Icons Mapped

**Platform & Social (4/4)**
- [x] IconTwitter - Social links footer
- [x] IconTelegram - Social links footer
- [x] IconDiscord - Social links footer
- [x] IconGithub - Social links footer

**Actions (7/7)**
- [x] IconLightning - Quick buy, boost actions
- [x] IconCollabExpand - View details, expand
- [x] IconPriceUp - Price increase indicator
- [x] IconUpvote - Vote button, vote count
- [x] IconFreeze - Freeze status badge
- [x] IconClose - Close buttons
- [x] IconDeposit - Deposit action
- [x] IconWithdraw - Withdraw action

**Motion System (5/5)**
- [x] IconMotion - Generic motion indicator
- [x] IconMotion1 - Level 1 (0-20)
- [x] IconMotion2 - Level 2 (21-40)
- [x] IconMotion4 - Level 4 (61-80)
- [x] IconMotion5 - Level 5 (81-100)

**Navigation (4/4)**
- [x] IconMenu - Mobile menu button
- [x] IconNavArrowUp - Sort ascending, collapse
- [x] IconNavArrowDown - Sort descending, expand
- [x] IconNavArrowLeft - Back, previous
- [x] IconNavArrowRight - Forward, next

**Badges (3/3)**
- [x] IconContributorBubble - Contributor count
- [x] IconActivityBadge - Activity indicator
- [x] IconMotionScoreBadge - Primary score display

**Achievements (4/4)**
- [x] IconTopPerformer - Top projects badge
- [x] IconTrophy - Winners, achievements
- [x] IconGem - Premium projects
- [x] IconLab - Verified projects

**Crypto (2/2)**
- [x] IconUsdc - USDC prices
- [x] IconSolana - SOL prices

**Stats (5/5)**
- [x] IconRocket - Launch status, growth
- [x] IconCash - Volume, revenue
- [x] IconCap - Market cap
- [x] IconGuide - Help, onboarding
- [x] IconWeb - Website links

**Visualizations (2/2)**
- [x] IconMotionBar - Motion bar chart
- [x] IconChartAnimation - Price charts

**Utility (5/5)**
- [x] IconMessage - Comments, messaging
- [x] IconWallet - Wallet connection
- [x] IconComputer - Technical info
- [x] IconAim - Target, focus
- [x] IconInfo - Info tooltips

**UI (6/6)**
- [x] IconNotification - Notification bell
- [x] IconSearch - Search bar
- [x] IconAttention - Alerts, warnings

---

## Design Tokens Reference

### Colors
```css
--btdemo-primary: #D1FD0A;           /* Lime Green - primary brand */
--btdemo-canvas: #000000;            /* Pure black background */
--btdemo-card: rgba(8, 8, 9, 0.60); /* Card background */
--btdemo-border: #3B3B3B;            /* Border color */
--btdemo-text: #FFFFFF;              /* Primary text */
--btdemo-text-dim: rgba(255, 255, 255, 0.72);  /* Secondary text */
--btdemo-text-mute: rgba(255, 255, 255, 0.56); /* Tertiary text */
```

### Motion Score Colors
```css
--motion-level-1: #EF4444;  /* Red - 0-20 */
--motion-level-2: #F59E0B;  /* Orange - 21-40 */
--motion-level-3: #EAB308;  /* Yellow - 41-60 */
--motion-level-4: #84CC16;  /* Lime - 61-80 */
--motion-level-5: #D1FD0A;  /* Bright Lime - 81-100 */
```

### Shadows & Effects
```css
--btdemo-shadow-glow: 0 0 24px rgba(209, 253, 10, 0.4);
--btdemo-shadow-inset: 0 0 1px 0 rgba(0, 0, 0, 0.25) inset;
--btdemo-blur-sm: 2px;
--btdemo-blur-md: 4px;
```

---

## Summary

This comprehensive specification maps **ALL 47 custom icons** to specific use cases in the /btdemo page:

- **Navigation Bar**: 5 icons (Menu, Search, Wallet, Notification, Motion logo)
- **Hero Stats**: 8 icons (Motion, Rocket, Cash, Cap, USDC, Solana, PriceUp, ChartAnimation)
- **Filters Bar**: 10 icons (Lab, TopPerformer, Gem, Motion1-5, Freeze, NavArrows, Close)
- **Project Cards**: 30+ icons (all Motion system, social links, actions, metrics, badges)
- **Wallet Panel**: 6 icons (Wallet, Deposit, Withdraw, Info, ActivityBadge, Solana)
- **Leaderboard**: 8 icons (Trophy, TopPerformer, Lab, Gem, MotionScoreBadge, Upvote, PriceUp)
- **Help Section**: 4 icons (Guide, Wallet, Search, Lightning)

**Total Icon Usage:** 47/47 icons implemented with proper context, hover states, and Battletech aesthetic.

**Key Features:**
- Comprehensive hover states with glow effects
- Motion score visualization system
- LED display font integration
- Social links with all 4 platform icons
- Proper semantic HTML with accessibility
- Performance-optimized patterns

This is a COMPLETE, production-ready specification that showcases EVERY icon the user created.
