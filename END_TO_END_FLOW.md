# Complete End-to-End Flow

This guide shows you the **complete streamer workflow** from dashboard to OBS widgets.

## 🎯 The Complete Flow

```
Streamer Dashboard → Create Content → Generate Widget URLs → Add to OBS → Go Live!
```

---

## 1️⃣ Start: Access the Dashboard

**URL**: `http://localhost:3000`

### What You See:
- 🎨 **StreamWidgets** branded homepage
- **Streamer ID input** (defaults to "demo")
- Two control panels:
  - 📊 **Predictions** - Create viewer predictions
  - 🎯 **Social Actions** - Add engagement buttons
- **Widget URLs** with copy buttons
- **OBS setup instructions**
- **Preview buttons** to test widgets

### Your Actions:
1. Enter your Streamer ID (wallet address or username)
   - Use `demo` for testing
   - Or enter your actual wallet: `0x1234...`
2. Click the **Preview** buttons to see widgets in action

---

## 2️⃣ Create a Prediction

**URL**: `http://localhost:3000/control/predictions`

### The Form:
```
Streamer ID: demo
Question: BTC price in next 15 minutes?
Options:
  - UP 📈
  - DOWN 📉
```

### What Happens:
1. Fill in the form
2. Click **"Create Prediction"**
3. See success message with widget URL
4. Prediction is now **LIVE** and **OPEN** for voting

### Widget URL Created:
```
http://localhost:3000/widget?mode=prediction&streamer=demo
```

### Prediction States:
- **OPEN** 🟢 - Viewers can vote
- **LOCKED** 🔒 - Voting closed, tallies visible
- **SETTLED** ✅ - Winner declared

---

## 3️⃣ Create Social Actions

**URL**: `http://localhost:3000/control/social`

### Example Social Action:
```
Streamer ID: demo
Action Key: join_telegram
Label: 💬 Join Telegram
Target URL: https://t.me/yourchannel
Goal: 100
```

### What Happens:
1. Fill in the social action details
2. Click **"Create Social Action"**
3. See success message
4. Button appears in Social Widget

### Widget URL Created:
```
http://localhost:3000/widget?mode=social&streamer=demo
```

### Common Action Types:
- `join_telegram` → Telegram group
- `follow_x` → Twitter/X profile
- `join_discord` → Discord server
- `retweet` → Specific tweet
- `subscribe_youtube` → YouTube channel

---

## 4️⃣ Get Widget URLs

Back on the **Dashboard** (`http://localhost:3000`):

### Prediction Widget URL:
```
http://localhost:3000/widget?mode=prediction&streamer=demo
```
**Copy button** → Copies to clipboard ✓

### Social Widget URL:
```
http://localhost:3000/widget?mode=social&streamer=demo
```
**Copy button** → Copies to clipboard ✓

---

## 5️⃣ Add to OBS

### Step-by-Step:

#### For Prediction Widget:

1. **Open OBS Studio**
2. **Sources** → Click `+` → **Browser**
3. Name it: `Prediction Widget`
4. **URL**: Paste the prediction widget URL
5. **Width**: `400`
6. **Height**: `220`
7. **FPS**: `30`
8. ✅ Check: **Shutdown source when not visible**
9. ✅ Check: **Refresh browser when scene becomes active**
10. Click **OK**

#### For Social Widget:

1. **Sources** → Click `+` → **Browser**
2. Name it: `Social Widget`
3. **URL**: Paste the social widget URL
4. **Width**: `400`
5. **Height**: `220`
6. **FPS**: `30`
7. ✅ Check: **Shutdown source when not visible**
8. ✅ Check: **Refresh browser when scene becomes active**
9. Click **OK**

### Position the Widgets:
- Drag to desired position on your stream layout
- Typical placement: **bottom-left** or **bottom-right** corner
- Widgets have **transparent backgrounds** - perfect for overlays!

---

## 6️⃣ Go Live & Interact

### What Viewers See:

#### Prediction Widget (OPEN state):
```
┌─────────────────────────────────────┐
│ BTC price next 15 minutes?          │
│ 🟢 Voting Open                      │
├─────────────────────────────────────┤
│  UP 📈          42 (52%)            │
│  DOWN 📉        38 (48%)            │
└─────────────────────────────────────┘
```

#### Social Widget:
```
┌─────────────────────────────────────┐
│ Social Actions                      │
├─────────────────────────────────────┤
│  💬 Join Telegram    87/100         │
│  [████████░░] 87%                   │
│  🐦 Follow on X      45/80          │
│  [█████░░░░░] 56%                   │
└─────────────────────────────────────┘
```

### Viewer Actions:
- **Click vote buttons** → Vote recorded
- **Click social buttons** → Opens URL + increments counter
- **Live updates** every 10-15 seconds

---

## 7️⃣ Manage Predictions (Streamer)

### Lock Voting:
When you want to stop accepting votes:
```
POST http://localhost:3000/api/predictions/pred_001/lock
```

Widget shows: **🔒 Locked** (voting disabled, tallies still update)

### Settle & Declare Winner:
```
POST http://localhost:3000/api/predictions/pred_001/settle
Body: { "winningOption": "UP 📈" }
```

Widget shows: **✅ Settled** (winner highlighted in green)

### Export Winners for Payout:
```
GET http://localhost:3000/api/predictions/pred_001/export
```

Downloads **CSV file**:
```csv
user_id,option,weight
0xabc...,UP 📈,1
0xdef...,UP 📈,1
0x123...,UP 📈,1
```

Pay winners manually (USDC, points, etc.)

---

## 8️⃣ Monitor Social Engagement

### Real-time Tracking:
- Watch counters increment live on widget
- Progress bars show % to goal
- **Confetti animation** 🎉 when goal reached!

### Toggle Actions:
```
POST http://localhost:3000/api/social/social_001/toggle
```
Enables/disables specific social actions

---

## 🔄 Complete Workflow Example

### Pre-Stream:
1. Open dashboard at `http://localhost:3000`
2. Enter your streamer ID: `mystream`
3. Create prediction: "Will I win this game?"
4. Add social actions: Telegram, Discord, Twitter
5. Copy widget URLs
6. Add both widgets to OBS
7. Position on stream layout

### During Stream:
1. Start stream
2. Viewers see widgets
3. Viewers vote on prediction
4. Viewers click social buttons
5. Watch engagement grow live!

### Mid-Stream Management:
1. Lock prediction when event starts
2. Settle prediction when outcome is known
3. Winners see "Claim with streamer" message

### Post-Stream:
1. Export winner CSV
2. Pay out rewards manually
3. Review social metrics

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│   Streamer   │
│   Dashboard  │
└──────┬───────┘
       │ Creates prediction/social
       ▼
┌──────────────┐
│  Mock Data   │ (or Database in production)
│   Storage    │
└──────┬───────┘
       │ Fetched by widget
       ▼
┌──────────────┐
│ OBS Browser  │
│    Widget    │
└──────┬───────┘
       │ Rendered on stream
       ▼
┌──────────────┐
│   Viewers    │
│    Vote      │
└──────────────┘
```

---

## 🎨 Customization Options

### Change Widget Colors:
Edit `components/PredictionWidget.tsx`:
```tsx
// Change gradient colors
className="bg-gradient-to-br from-purple-900/95 to-blue-900/95"
```

### Adjust Poll Interval:
```tsx
// In widget components
const interval = setInterval(fetchPrediction, 12000) // 12s
```

### Widget Dimensions:
Standard: **400×220px**

For larger overlays:
- Width: `600px`
- Height: `300px`

---

## 🚀 Production Deployment

When ready to go live with real database:

1. **Set up PostgreSQL** (see [README.md](README.md))
2. **Update `.env`** with database URL
3. **Run migrations**: `npx prisma db push`
4. **Remove mock imports** from API routes
5. **Uncomment database code** in control panels
6. **Deploy to Vercel/hosting**
7. **Update widget URLs** to production domain

---

## ⚡ Quick Reference

| Action | URL |
|--------|-----|
| Dashboard | `http://localhost:3000` |
| Predictions Control | `http://localhost:3000/control/predictions` |
| Social Control | `http://localhost:3000/control/social` |
| Prediction Widget | `http://localhost:3000/widget?mode=prediction&streamer=YOURID` |
| Social Widget | `http://localhost:3000/widget?mode=social&streamer=YOURID` |

---

## 💡 Tips & Best Practices

1. **Test before stream** - Always preview widgets
2. **Start simple** - 2 options for first predictions
3. **Set realistic goals** - Start with achievable social goals
4. **Lock predictions early** - Prevent last-second votes
5. **Manual payouts** - Review winners before paying
6. **Engage viewers** - Announce predictions on stream
7. **Track metrics** - Monitor click rates and engagement

---

## 🆘 Troubleshooting

**Widget not showing in OBS?**
- Check URL is correct
- Refresh the browser source
- Verify dev server is running

**Votes not updating?**
- Wait 12 seconds for poll refresh
- Check browser console for errors
- Ensure prediction state is OPEN

**Can't create prediction?**
- Verify streamer ID is entered
- Check all fields are filled
- Look for success message

---

**Ready to start?** Run `npm run dev` and visit `http://localhost:3000`! 🎉
