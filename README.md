# OBS Widgets - Prediction & Social Actions

A Next.js application for creating interactive OBS widgets with predictions and social media engagement buttons.

## Features

### Prediction Widget
- Create viewer predictions with custom options
- Real-time voting with live tallies
- Lock predictions to stop voting
- Settle predictions and declare winners
- Export winner list as CSV for manual payouts

### Social Actions Widget
- Configurable social media buttons (Telegram, Twitter, Discord, etc.)
- Click tracking with anti-abuse controls
- Progress bars with goals
- Confetti animation on goal completion

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** (PostgreSQL ORM)
- **PostgreSQL** database

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database and add the connection URL to your environment:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/obs_widgets?schema=public"
```

### 3. Initialize Database

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

### Control Panel

Navigate to the control panel at `/` to manage predictions and social actions.

#### Create Prediction
1. Go to `/control/predictions`
2. Enter your streamer ID (wallet address or username)
3. Add question and options
4. Click "Create Prediction"

#### Manage Predictions
- **Lock**: `POST /api/predictions/:id/lock`
- **Settle**: `POST /api/predictions/:id/settle` with `{ winningOption: "UP" }`
- **Export Winners**: `GET /api/predictions/:id/export` (downloads CSV)

#### Create Social Action
1. Go to `/control/social`
2. Enter streamer ID
3. Configure action (key, label, URL, goal)
4. Click "Create Social Action"

### OBS Browser Source Setup

Add a Browser Source in OBS with the following URLs:

**Prediction Widget:**
```
http://localhost:3000/widget?mode=prediction&streamer=YOUR_WALLET
```

**Social Widget:**
```
http://localhost:3000/widget?mode=social&streamer=YOUR_WALLET
```

**Recommended OBS Settings:**
- Width: 400px
- Height: 220px
- FPS: 30
- ✅ Shutdown source when not visible
- ✅ Refresh browser when scene becomes active

## API Endpoints

### Predictions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/predictions` | Create new prediction |
| `GET` | `/api/predictions/active?streamer=<id>` | Get active prediction |
| `POST` | `/api/predictions/:id/lock` | Lock prediction (stop voting) |
| `POST` | `/api/predictions/:id/settle` | Settle and declare winner |
| `POST` | `/api/predictions/:id/vote` | Submit a vote |
| `GET` | `/api/predictions/:id/results` | Get results with winners |
| `GET` | `/api/predictions/:id/export` | Export winners CSV |

### Social Actions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/social` | Create social action |
| `GET` | `/api/social?streamer=<id>` | List active social actions |
| `POST` | `/api/social/:id/toggle` | Toggle active state |
| `POST` | `/api/social/:id/click` | Record a click |

## Anti-Abuse Features

- **IP Hashing**: User IPs are hashed with daily salt for privacy
- **Vote Deduplication**: One vote per user per prediction
- **Click Throttling**: 30-second cooldown per IP per action
- **Anonymous Users**: Automatic generation of anonymous user IDs based on IP+UA hash

## Manual Reward Flow

1. Create and run prediction
2. Lock when voting should close
3. Settle with winning option
4. Export winners: `GET /api/predictions/:id/export`
5. Pay rewards manually (USDC, points, etc.)

## Database Schema

```prisma
model Streamer {
  id            String
  displayName   String?
  predictions   Prediction[]
  socialActions SocialAction[]
}

model Prediction {
  id             String
  streamerId     String
  question       String
  options        Json        // ["UP","DOWN"]
  state          String      // "OPEN" | "LOCKED" | "SETTLED"
  winningOption  String?
  votes          PredictionVote[]
}

model PredictionVote {
  id           String
  predictionId String
  userId       String
  option       String
  weight       Float
}

model SocialAction {
  id         String
  streamerId String
  actionKey  String
  label      String
  targetUrl  String
  counter    Int
  goal       Int
  active     Boolean
  clicks     SocialClick[]
}

model SocialClick {
  id        String
  actionId  String
  userId    String?
  ipHash    String
}
```

## Widget Customization

Widgets use Tailwind CSS and can be customized in:
- `components/PredictionWidget.tsx`
- `components/SocialWidget.tsx`

Widget dimensions: **400×220px** (optimized for stream overlays)

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

## Future Enhancements

- [ ] WebSocket/SSE for real-time updates (replace polling)
- [ ] On-chain escrow integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] QR code generation for social actions
- [ ] Streamer authentication

## License

MIT
