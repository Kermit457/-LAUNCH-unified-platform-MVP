# StreamWidgets - Setup Instructions

## 🚀 Quick Start

### 1. Install Dependencies
```powershell
npm install
```

### 2. Start Development Server
```powershell
npm run dev
```

### 3. Open Browser
Navigate to: **http://localhost:3000**

---

## 📁 Project Structure

```
WIDGETS FOR LAUNCH/
├── app/
│   ├── page.tsx                    # Landing page (/)
│   ├── predictions/page.tsx        # Predictions page
│   ├── social/page.tsx             # Social actions page
│   ├── ads/page.tsx                # Ads page
│   ├── marketplace/page.tsx        # Marketplace page
│   ├── earnings/page.tsx           # Earnings page
│   ├── widget/page.tsx             # Widget viewer (existing)
│   ├── layout.tsx                  # Root layout with NavBar
│   └── globals.css                 # Global styles
│
├── components/
│   ├── NavBar.tsx                  # Main navigation
│   ├── ui/                         # ShadCN UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── progress.tsx
│   ├── widgets/                    # Demo widgets
│   │   ├── PredictionWidgetDemo.tsx
│   │   ├── SocialWidgetDemo.tsx
│   │   └── AdsWidgetDemo.tsx
│   ├── PredictionWidget.tsx       # Existing widget
│   └── SocialWidget.tsx            # Existing widget
│
├── lib/
│   ├── cn.ts                       # Utility for className merging
│   ├── db.ts                       # Database utilities
│   └── utils.ts                    # General utilities
│
└── package.json
```

---

## 🎨 Features

### ✅ Landing Page (/)
- Hero section with tagline
- 3 widget previews (scaled down)
- Feature highlights
- Navigation to all pages

### ✅ Predictions Page (/predictions)
- Create prediction form
- Live widget preview
- Active prediction stats
- Lock/Settle controls

### ✅ Social Actions Page (/social)
- Add social action form
- Platform icons (Telegram, Twitter, Discord)
- Progress tracking
- Live widget preview
- QR code support info

### ✅ Ads Page (/ads)
- Ad campaign configuration
- Banner image URL input
- Budget management
- Performance metrics
- Pricing model display

### ✅ Marketplace Page (/marketplace)
- Grid of active predictions
- Category badges
- Live vote tallies
- Prize pool display
- Time remaining countdown

### ✅ Earnings Page (/earnings)
- Streamer ID search
- Total earnings display
- Revenue breakdown (Predictions vs Ads)
- Performance metrics
- Transaction history
- Payout requests

---

## 🎯 Demo Mode

All pages work in **front-end only demo mode**:
- ✅ No backend required
- ✅ Mock data for all features
- ✅ Local state management
- ✅ Fully interactive UI

---

## 🎨 Design System

### Color Scheme
- **Primary Gradient**: Pink → Purple (`from-pink-500 to-purple-600`)
- **Background**: Dark gradient (`#0a0a0a` → `#1a1a1a`)
- **Glass Cards**: `bg-white/5` with `backdrop-blur`

### Components
All using **ShadCN UI** with custom theming:
- Glassmorphism effects
- Gradient buttons
- Smooth animations
- Consistent spacing

---

## 📊 Widget URLs

### Prediction Widget
```
http://localhost:3000/widget?mode=prediction&streamer=demo
```

### Social Widget
```
http://localhost:3000/widget?mode=social&streamer=demo
```

### Ads Widget (to be implemented)
```
http://localhost:3000/widget?mode=ad&id=demo
```

---

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI)
- **Icons**: Lucide React
- **State**: React useState (local)

---

## 🎥 OBS Integration

1. Add **Browser Source** in OBS
2. Paste widget URL
3. Set dimensions: **420×240** (new) or **400×220** (legacy)
4. Enable: "Shutdown when not visible"
5. Enable: "Refresh when scene becomes active"

---

## ✨ Next Steps

- Connect to real backend API
- Add WebSocket for real-time updates
- Implement authentication
- Add wallet integration
- Deploy to Vercel

---

**Built with ❤️ using Next.js + ShadCN UI**
