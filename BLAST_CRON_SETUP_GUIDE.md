# BLAST Cron Job Setup Guide

## Why Cron is Critical

The BLAST cron job is **required for production** because it handles:

1. **Auto-close rooms** when 72h deadline passes
2. **Process refunds** for active participants
3. **Update room status** (open → hot → closing → closed)
4. **Calculate Motion Scores** (exponential decay)
5. **Trigger Flash Airdrops** when Motion hits 95
6. **Clean up expired locks** in vault

**Without cron:** Rooms stay open forever, no refunds, no status updates.

---

## Option 1: cron-job.org (Recommended - Free)

### Step 1: Deploy to Vercel
```bash
vercel --prod
```

Copy your deployment URL: `https://your-app.vercel.app`

### Step 2: Create cron-job.org Account
1. Visit https://cron-job.org
2. Sign up (free account)
3. Verify email

### Step 3: Add Cron Job
1. Click "Create cronjob"
2. **Title:** `BLAST Room Manager`
3. **URL:** `https://your-app.vercel.app/api/blast/cron`
4. **Schedule:** `*/5 * * * *` (every 5 minutes)
5. **Request method:** `POST`
6. **Headers:**
   - `Authorization: Bearer YOUR_SECRET_KEY`
   - `Content-Type: application/json`

### Step 4: Generate Secret Key
```bash
# Add to .env.local and Vercel env
BLAST_CRON_SECRET=your-random-secret-key-here
```

Generate secure key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Test
```bash
curl -X POST https://your-app.vercel.app/api/blast/cron \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "processed": {
    "closedRooms": 3,
    "processedRefunds": 12,
    "updatedScores": 45
  }
}
```

---

## Option 2: Vercel Cron (Pro Plan - $20/month)

Already configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/blast/cron",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### Setup:
1. Upgrade to Vercel Pro
2. Deploy: `vercel --prod`
3. Vercel automatically runs cron
4. No external service needed

**Pros:**
- Native integration
- Auto-scaled
- No external dependencies

**Cons:**
- Costs $20/month
- Only available on Pro plan

---

## Option 3: GitHub Actions (Free)

Create `.github/workflows/blast-cron.yml`:

```yaml
name: BLAST Cron Job

on:
  schedule:
    - cron: '*/5 * * * *' # Every 5 minutes

jobs:
  blast-cron:
    runs-on: ubuntu-latest
    steps:
      - name: Call BLAST Cron Endpoint
        run: |
          curl -X POST https://your-app.vercel.app/api/blast/cron \
            -H "Authorization: Bearer ${{ secrets.BLAST_CRON_SECRET }}" \
            -H "Content-Type: application/json"
```

Add secret:
1. GitHub repo → Settings → Secrets
2. Add `BLAST_CRON_SECRET`
3. Commit workflow file

**Pros:**
- Free for public repos
- Integrated with Git workflow

**Cons:**
- GitHub rate limits (max 1 run per 5min)
- Less reliable than dedicated services

---

## Monitoring Cron Jobs

### 1. Check Logs
```bash
# Vercel logs
vercel logs --follow

# Or in Vercel dashboard
https://vercel.com/your-project/deployments
```

### 2. Add Monitoring Endpoint
```typescript
// app/api/blast/cron/status/route.ts
export async function GET() {
  const lastRun = await getLastCronRun()
  const nextRun = lastRun + 300000 // +5 minutes

  return NextResponse.json({
    lastRun: new Date(lastRun).toISOString(),
    nextRun: new Date(nextRun).toISOString(),
    healthy: Date.now() - lastRun < 600000, // <10 minutes
  })
}
```

### 3. Alert on Failures

**Option A: Email alerts (cron-job.org)**
- Enable "Email on failure" in settings
- Get notified if endpoint returns error

**Option B: Sentry integration**
```typescript
import * as Sentry from '@sentry/nextjs'

try {
  await processCronJobs()
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

---

## Testing Locally

Run cron job manually:

```bash
# Start dev server
npm run dev

# In another terminal
curl -X POST http://localhost:3000/api/blast/cron \
  -H "Authorization: Bearer test-secret" \
  -H "Content-Type: application/json"
```

---

## Security Checklist

- [ ] BLAST_CRON_SECRET is strong (32+ characters)
- [ ] Secret is in Vercel environment variables
- [ ] Secret is NOT in git/public files
- [ ] Endpoint validates Authorization header
- [ ] Rate limiting applied (max 1 call per minute)
- [ ] Logs don't expose sensitive data

---

## Troubleshooting

### "401 Unauthorized"
- Check `BLAST_CRON_SECRET` in Vercel env
- Verify `Authorization: Bearer YOUR_SECRET` header

### "Timeout"
- Cron job takes >10s (Vercel limit)
- Optimize queries or use background jobs

### "No rooms closed"
- Check room deadlines in database
- Verify current time vs `endsAt` timestamps

### "Refunds not processing"
- Check vault locks exist
- Verify applicant `activityCount >= 2`

---

## What the Cron Job Does

See [`app/api/blast/cron/route.ts`](app/api/blast/cron/route.ts) for full implementation.

**Every 5 minutes:**

1. **Close expired rooms**
   - Query: `status = 'open' AND endsAt < NOW()`
   - Update: `status = 'closed'`

2. **Process refunds**
   - Query: Applicants with `activityCount >= 2`
   - Action: Unlock keys from vault

3. **Update room statuses**
   - `open` → `hot` (if 10+ boosts in 10min OR Motion >90)
   - `hot` → `closing` (if <6h remaining)

4. **Decay Motion Scores**
   - Apply exponential decay: `e^(-Δt / 72h)`
   - Update cached scores

5. **Trigger viral mechanics**
   - Flash Airdrop (Motion 95)
   - Slot Snipe (last slot + <5min)

---

## Next Steps

1. Choose option (cron-job.org recommended)
2. Deploy to Vercel: `vercel --prod`
3. Get deployment URL
4. Set up cron service
5. Test endpoint manually
6. Monitor for 24h
7. Verify rooms auto-close

---

**Status:** ⚠️ REQUIRED FOR PRODUCTION

Contact: Your deployment URL needed to complete setup.
