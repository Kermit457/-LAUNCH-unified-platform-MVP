# Quick Start Guide - Mock Mode (No Database Needed!)

This guide lets you test the widgets **immediately** without setting up PostgreSQL.

## Setup (2 minutes)

### 1. Install Dependencies

Open PowerShell or Command Prompt in this folder and run:

```bash
npm install
```

### 2. Start the Dev Server

```bash
npm run dev
```

The server will start at: **http://localhost:3000**

## Test the Widgets

### Prediction Widget

Open in your browser:
```
http://localhost:3000/widget?mode=prediction&streamer=demo
```

**What you'll see:**
- Live prediction: "BTC price next 15 minutes?"
- Two options: "UP 📈" and "DOWN 📉"
- Live vote tallies (starts at 42 vs 38)
- Click to vote and watch the numbers update!

### Social Widget

Open in your browser:
```
http://localhost:3000/widget?mode=social&streamer=demo
```

**What you'll see:**
- 3 social buttons: Telegram, X (Twitter), Discord
- Live counters with progress bars
- Click any button to increment the counter
- Confetti when goal is reached! 🎉

## Test in OBS

### Add as Browser Source

1. Open OBS
2. Add **Browser Source** to your scene
3. Use these settings:

**For Prediction Widget:**
- URL: `http://localhost:3000/widget?mode=prediction&streamer=demo`
- Width: `400`
- Height: `220`
- ✅ Shutdown source when not visible
- ✅ Refresh browser when scene becomes active

**For Social Widget:**
- URL: `http://localhost:3000/widget?mode=social&streamer=demo`
- Width: `400`
- Height: `220`
- ✅ Shutdown source when not visible
- ✅ Refresh browser when scene becomes active

### Transparent Background

The widgets have transparent backgrounds by default - perfect for overlays!

## Mock Data

The demo uses pre-configured data in [lib/mock-data.ts](lib/mock-data.ts):

- **Streamer ID**: `demo`
- **Prediction**: BTC price prediction (UP/DOWN)
- **Social Actions**: 3 buttons with different goals

### Customize Mock Data

Edit [lib/mock-data.ts](lib/mock-data.ts) to test different scenarios:

```typescript
// Change the question
question: 'Your custom question?',

// Change options
options: ['OPTION A', 'OPTION B', 'OPTION C'],

// Adjust vote counts
tallies: { 'OPTION A': 100, 'OPTION B': 50 },

// Change state to test locked/settled
state: 'LOCKED', // or 'SETTLED'
```

## Features Working in Mock Mode

✅ Live voting (updates tallies in real-time)
✅ Vote deduplication (one vote per user)
✅ Social button clicks
✅ Progress bars and counters
✅ Rate limiting (30s throttle)
✅ Confetti on goal completion
✅ Transparent backgrounds
✅ Auto-refresh (12s for predictions, 15s for social)

## Next Steps

Once you're happy with the mockup:

1. **Set up PostgreSQL** - See [README.md](README.md) for full setup
2. **Switch to real database** - Replace mock imports with Prisma
3. **Build control panel** - Manage predictions via `/control/predictions`
4. **Deploy** - Push to Vercel or your hosting platform

## Troubleshooting

**Widgets not loading?**
- Make sure `npm run dev` is running
- Check console for errors (F12 in browser)

**Can't vote?**
- Each browser can vote once (uses IP hash)
- Try incognito mode to vote again

**Want to reset data?**
- Restart the dev server (`Ctrl+C` then `npm run dev`)

## Widget Screenshots

### Prediction Widget States

- **OPEN**: Green indicator, clickable vote buttons
- **LOCKED**: Lock icon, voting disabled, live tallies
- **SETTLED**: Check mark, winner highlighted in green

### Social Widget

- Progress bars show counter/goal
- Buttons open URLs in new tab
- Counter increments with each click
- Confetti animation on goal completion

---

**Ready for production?** Follow the full setup in [README.md](README.md) to connect PostgreSQL and enable the control panel!
