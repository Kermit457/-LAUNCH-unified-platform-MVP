# Vercel Deployment Guide - ICM Motion LaunchOS

Complete guide for deploying ICM Motion to Vercel staging/production environments.

## Prerequisites

- [ ] Vercel account with project created
- [ ] Appwrite Cloud instance configured with all collections
- [ ] Privy App ID and Secret configured
- [ ] Solana RPC endpoint (devnet or mainnet)
- [ ] All environment variables ready

---

## 1. Appwrite Collections Setup

### Required Collections

Create these collections in your Appwrite database (`launchos_db`):

#### Core Collections

1. **users** - User profiles
   - Attributes: `userId` (string), `username` (string), `displayName` (string), `bio` (string), `avatar` (string), `verified` (boolean), `conviction` (int), `totalEarnings` (float), `roles` (array), `website` (string), `twitter` (string), `telegram` (string)

2. **launches** - Project launches (ICM/CCM)
   - Attributes: `launchId` (string), `scope` (enum: ICM|CCM), `title` (string), `subtitle` (string), `logoUrl` (string), `createdBy` (string), `convictionPct` (int), `commentsCount` (int), `upvotes` (int), `viewCount` (int), `status` (enum: live|upcoming|ended), `tokenName` (string), `tokenSymbol` (string), `marketCap` (float), `volume24h` (float), `priceChange24h` (float), `holders` (int)

3. **curves** - Bonding curves for users and projects
   - Attributes: `ownerType` (enum: user|project), `ownerId` (string), `state` (enum: inactive|active|frozen|launched|utility), `price` (float), `reserve` (float), `supply` (float), `holders` (int), `volume24h` (float), `volumeTotal` (float), `marketCap` (float), `priceChange24h` (float), `tokenMint` (string), `launchedAt` (datetime)

4. **curve_holders** - Track key holdings
   - Attributes: `curveId` (string), `userId` (string), `balance` (float), `avgPrice` (float), `totalInvested` (float), `realizedPnl` (float), `unrealizedPnl` (float), `firstBuyAt` (datetime), `lastTradeAt` (datetime)

5. **curve_events** - Trading history
   - Attributes: `curveId` (string), `type` (enum: buy|sell|freeze|launch), `amount` (float), `price` (float), `keys` (float), `userId` (string), `referrerId` (string), `reserveFee` (float), `projectFee` (float), `platformFee` (float), `referralFee` (float), `timestamp` (datetime)

#### Social & Collaboration

6. **network_invites** - Collaboration invites
   - Attributes: `senderId` (string), `receiverId` (string), `message` (string), `status` (enum: pending|accepted|rejected), `createdAt` (datetime)

7. **messages** - DM messages
   - Attributes: `threadId` (string), `senderId` (string), `content` (string), `read` (boolean), `createdAt` (datetime)

8. **threads** - DM conversation threads
   - Attributes: `participants` (array), `lastMessage` (string), `lastActivity` (datetime)

9. **comments** - Comments on launches
   - Attributes: `launchId` (string), `userId` (string), `content` (string), `createdAt` (datetime)

10. **votes** - Upvotes on launches
    - Attributes: `launchId` (string), `userId` (string), `createdAt` (datetime)

#### Campaigns & Quests

11. **campaigns** - Marketing campaigns
    - Attributes: `title` (string), `description` (string), `budget` (float), `status` (enum: active|paused|completed), `creatorId` (string)

12. **quests** - User quests/tasks
    - Attributes: `title` (string), `description` (string), `reward` (float), `type` (enum: social|trading|referral), `status` (enum: active|completed)

13. **submissions** - Campaign submissions
    - Attributes: `campaignId` (string), `userId` (string), `content` (string), `status` (enum: pending|approved|rejected), `proof` (string)

#### Financial

14. **referrals** - Referral tracking
    - Attributes: `referrerId` (string), `refereeId` (string), `status` (enum: pending|active|rewarded), `createdAt` (datetime)

15. **referral_rewards** - Referral earnings
    - Attributes: `referralId` (string), `amount` (float), `type` (string), `paidAt` (datetime)

16. **payouts** - Payment processing
    - Attributes: `userId` (string), `amount` (float), `status` (enum: pending|processing|completed|failed), `txHash` (string)

17. **dealflow** - Deal opportunities
    - Attributes: `dealflowId` (string), `userId` (string), `title` (string), `description` (string), `dealType` (enum: partnership|investment|collaboration|service), `budget` (float), `timeline` (string), `contactMethod` (enum: dm|email|telegram), `contactInfo` (string), `status` (enum: active|closed|completed)

#### Misc

18. **notifications** - User notifications
    - Attributes: `userId` (string), `title` (string), `message` (string), `type` (string), `read` (boolean), `createdAt` (datetime)

19. **activities** - Activity feed
    - Attributes: `userId` (string), `type` (string), `data` (json), `createdAt` (datetime)

20. **project_members** - Project collaborators
    - Attributes: `projectId` (string), `userId` (string), `role` (enum: owner|admin|member), `joinedAt` (datetime)

---

## 2. Environment Variables for Vercel

Add these environment variables in Vercel project settings:

### Appwrite Configuration

```env
# Appwrite Core
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68e34a030010f2321359
NEXT_PUBLIC_APPWRITE_DATABASE_ID=launchos_db

# Collection IDs (match your Appwrite collection IDs)
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID=launches
NEXT_PUBLIC_APPWRITE_CAMPAIGNS_COLLECTION_ID=campaigns
NEXT_PUBLIC_APPWRITE_QUESTS_COLLECTION_ID=quests
NEXT_PUBLIC_APPWRITE_SUBMISSIONS_COLLECTION_ID=submissions
NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID=comments
NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID=notifications
NEXT_PUBLIC_APPWRITE_INVITES_COLLECTION_ID=network_invites
NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID=messages
NEXT_PUBLIC_APPWRITE_PAYOUTS_COLLECTION_ID=payouts
NEXT_PUBLIC_APPWRITE_ACTIVITIES_COLLECTION_ID=activities
NEXT_PUBLIC_APPWRITE_THREADS_COLLECTION_ID=threads
NEXT_PUBLIC_APPWRITE_VOTES_COLLECTION_ID=votes
NEXT_PUBLIC_APPWRITE_PROJECT_MEMBERS_COLLECTION_ID=project_members
NEXT_PUBLIC_APPWRITE_REFERRALS_COLLECTION_ID=referrals
NEXT_PUBLIC_APPWRITE_REFERRAL_REWARDS_COLLECTION_ID=referral_rewards
NEXT_PUBLIC_APPWRITE_REWARDS_POOLS_COLLECTION_ID=rewards_pools
NEXT_PUBLIC_APPWRITE_CURVES_COLLECTION_ID=curves
NEXT_PUBLIC_APPWRITE_CURVE_EVENTS_COLLECTION_ID=curve_events
NEXT_PUBLIC_APPWRITE_CURVE_HOLDERS_COLLECTION_ID=curve_holders
NEXT_PUBLIC_APPWRITE_SNAPSHOTS_COLLECTION_ID=snapshots
NEXT_PUBLIC_APPWRITE_PRICE_HISTORY_COLLECTION_ID=price_history
NEXT_PUBLIC_APPWRITE_DEALFLOW_COLLECTION_ID=dealflow

# Storage Buckets
NEXT_PUBLIC_APPWRITE_AVATARS_BUCKET_ID=avatars
NEXT_PUBLIC_APPWRITE_LAUNCH_LOGOS_BUCKET_ID=launch_logos
NEXT_PUBLIC_APPWRITE_CAMPAIGN_MEDIA_BUCKET_ID=campaign_media
NEXT_PUBLIC_APPWRITE_SUBMISSIONS_BUCKET_ID=submissions
```

### Privy Authentication

```env
NEXT_PUBLIC_PRIVY_APP_ID=cmfsej8w7013cle0df5ottcj6
PRIVY_APP_SECRET=<your-secret-from-privy>
```

### Solana Configuration

```env
# Devnet
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com

# Mainnet (for production)
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
# NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com

# Program ID
NEXT_PUBLIC_CURVE_PROGRAM_ID=Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
```

---

## 3. Vercel Deployment Steps

### Initial Setup

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Link Project**
   ```bash
   vercel link
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from section 2 above
   - Set for "Production", "Preview", and "Development" environments

### Deploy

#### Via Git (Recommended)

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Auto-deploy**
   - Vercel will automatically deploy on push
   - Monitor at: https://vercel.com/[username]/[project]

#### Via CLI

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

---

## 4. Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Check build logs for errors
- [ ] Test authentication with Privy
- [ ] Verify Appwrite connection
- [ ] Test Discover page listings load
- [ ] Test Buy/Sell functionality
- [ ] Test Profile page loads
- [ ] Test Network page
- [ ] Verify PWA manifest works
- [ ] Check mobile responsiveness
- [ ] Test all major flows end-to-end

---

## 5. Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
npm run typecheck
```

**Missing dependencies:**
```bash
npm install
```

### Runtime Errors

**Appwrite connection failed:**
- Verify `NEXT_PUBLIC_APPWRITE_*` variables
- Check Appwrite API permissions
- Ensure collections exist

**Privy authentication issues:**
- Verify `NEXT_PUBLIC_PRIVY_APP_ID` and `PRIVY_APP_SECRET`
- Check allowed domains in Privy dashboard

**Solana RPC errors:**
- Check `NEXT_PUBLIC_SOLANA_RPC` endpoint is accessible
- Verify network matches (`devnet` vs `mainnet-beta`)

---

## 6. Staging vs Production

### Staging Environment

Use Vercel preview deployments for staging:
- Automatic deployments on PR creation
- Use devnet Solana
- Test environment variables

### Production Environment

Deploy to production branch (`main`):
- Manually trigger or auto-deploy on merge to `main`
- Use mainnet Solana
- Production Appwrite database
- Production Privy configuration

---

## 7. Performance Optimization

### Recommended Vercel Settings

- **Node.js Version**: 20.x
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Caching Strategy

- Static assets: CDN caching enabled
- API routes: Edge functions
- ISR: Incremental Static Regeneration for listings

---

## 8. Monitoring & Analytics

### Vercel Analytics

Enable in project settings:
- Web Vitals tracking
- Real User Monitoring
- Speed Insights

### Error Tracking

Consider integrating:
- Sentry for error monitoring
- LogRocket for session replay
- PostHog for product analytics

---

## 9. Domain Configuration

### Custom Domain

1. Go to Vercel Project → Settings → Domains
2. Add custom domain
3. Configure DNS:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
4. Enable SSL (automatic via Vercel)

---

## 10. CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Done!

Your ICM Motion LaunchOS should now be deployed to Vercel.

Access your deployment at: `https://[project-name].vercel.app`
