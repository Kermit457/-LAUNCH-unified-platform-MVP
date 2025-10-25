# BLAST Background Jobs Setup

## Overview

BLAST requires background jobs to handle:
- **Room status transitions** (open → hot → closing → closed)
- **Automatic refund processing** (when rooms close)
- **Motion Score decay** (exponential decay over time)

## Setup Options

### Option 1: Vercel Cron (Recommended)

**Pro:** Built-in, reliable, no external dependencies
**Con:** Requires Vercel Pro plan

1. **Already configured!** The `vercel.json` includes:
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

2. **Deploy to Vercel** - Cron automatically activates on Pro plan

3. **Monitor** at: `https://yourapp.vercel.app/api/blast/cron/status`

---

### Option 2: External Cron Service (Free)

Use services like:
- **Cron-job.org** (free, reliable)
- **EasyCron** (free tier available)
- **GitHub Actions** (free for public repos)

#### Setup with Cron-job.org:

1. **Create account** at https://cron-job.org

2. **Add new cron job:**
   - URL: `https://yourapp.vercel.app/api/blast/cron`
   - Schedule: `*/5 * * * *` (every 5 minutes)
   - Method: `GET`

3. **Optional: Add auth header:**
   - Add to `.env.local`:
     ```
     CRON_SECRET=your-random-secret-here
     ```
   - Add header in cron-job.org:
     ```
     Authorization: Bearer your-random-secret-here
     ```

---

### Option 3: GitHub Actions (Free)

**Pro:** Free, version controlled
**Con:** Requires GitHub repo

Create `.github/workflows/blast-cron.yml`:

```yaml
name: BLAST Background Jobs

on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:  # Allow manual trigger

jobs:
  run-cron:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger BLAST cron
        run: |
          curl -X POST https://yourapp.vercel.app/api/blast/cron \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

Add `CRON_SECRET` to GitHub repository secrets.

---

## What Each Job Does

### Room Status Transitions
- **open → hot**: When 3+ applicants
- **hot → closing**: Last 3 hours before end
- **closing → closed**: Time expired
- Runs: Every 5 minutes

### Refund Processing
- Refunds keys for active applicants (2+ activities)
- Forfeits keys for no-shows (<2 activities)
- Runs: When rooms close

### Motion Score Decay
- Applies exponential decay: `Score(t) = Σ (weight × e^(-Δt/72))`
- Updates all user scores
- Runs: Every 5 minutes (efficient, only recalculates on change)

---

## Monitoring

### Health Check Endpoint
```bash
curl https://yourapp.vercel.app/api/blast/cron/status
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "stats": {
    "activeRooms": 42,
    "closingSoonRooms": 8,
    "expiredRooms": 0,
    "activeUsers": 156
  },
  "healthy": true
}
```

If `expiredRooms > 0`, cron jobs may not be running!

---

## Manual Trigger

For testing or emergency runs:

```bash
curl -X POST https://yourapp.vercel.app/api/blast/cron \
  -H "Authorization: Bearer your-secret"
```

---

## Development

In development, background jobs **do NOT run automatically**. You must:

1. **Manual trigger** via API endpoint
2. **Or** rooms will stay in old states until manually closed
3. **Or** use `setInterval` in a dev-only component (not recommended)

---

## Environment Variables

Optional security:

```env
CRON_SECRET=generate-random-secret-here
```

Use: https://generate-secret.vercel.app/32

---

## Troubleshooting

### Rooms not closing automatically
- Check `/api/blast/cron/status` for `expiredRooms > 0`
- Verify cron is hitting endpoint (check Vercel logs)
- Manually trigger: `POST /api/blast/cron`

### Motion Scores not decaying
- Scores only update when recalculated
- Force recalc: Create new Motion Score event (apply, accept, etc)
- Or: Wait for cron to run

### Refunds not processing
- Check applicant `activityCount` (must be ≥2 for refund)
- Verify vault has locked keys
- Check Appwrite logs for errors

---

## Cost Considerations

| Option | Cost | Reliability |
|--------|------|-------------|
| Vercel Cron | $20/mo (Pro) | ⭐⭐⭐⭐⭐ |
| Cron-job.org | Free | ⭐⭐⭐⭐ |
| GitHub Actions | Free | ⭐⭐⭐⭐ |
| External service | Varies | ⭐⭐⭐ |

**Recommendation:** Start with cron-job.org (free), upgrade to Vercel Cron when scaling.
