# Route Inventory

**Generated:** 2025-10-20
**Total Routes:** 37

## Public Routes

### Core Features
| Route | Description | Auth Required | Feature Flag |
|-------|-------------|---------------|--------------|
| `/` | Landing/home page | No | - |
| `/discover` | Curve discovery & marketplace | No | - |
| `/launch` | Launch creator/list | No | - |
| `/launch/[id]` | Launch detail page | No | - |
| `/campaign/[id]` | Campaign detail | No | - |

### Trading & Earning
| Route | Description | Auth Required | Feature Flag |
|-------|-------------|---------------|--------------|
| `/earn` | Earnings dashboard | Yes | `ENABLE_EARN` |
| `/earnings` | Alternative earnings page | Yes | `ENABLE_EARN` |
| `/marketplace` | Marketplace | No | - |

### Social & Network
| Route | Description | Auth Required | Feature Flag |
|-------|-------------|---------------|--------------|
| `/network` | Social network | Yes | `ENABLE_NETWORK` |
| `/network/@me` | Current user profile | Yes | `ENABLE_NETWORK` |
| `/profile/[handle]` | User profile by handle | No | - |
| `/profile` | Legacy profile redirect | Yes | - |
| `/community` | Community page | No | - |

### Live & Engagement
| Route | Description | Auth Required | Feature Flag |
|-------|-------------|---------------|--------------|
| `/live` | Live streaming | No | `ENABLE_LIVE` |
| `/engage` | Engagement hub | No | - |

### Quests & Activities
| Route | Description | Auth Required | Feature Flag |
|-------|-------------|---------------|--------------|
| `/quest/[id]` | Quest detail | No | - |
| `/raids/[id]` | Raid detail | No | - |
| `/bounties/[id]` | Bounty detail | No | - |

### Additional Features
| Route | Description | Auth Required | Feature Flag |
|-------|-------------|---------------|--------------|
| `/explore` | Explore page | No | - |
| `/tools` | Tools page | No | - |
| `/ads` | Ads marketplace | No | - |
| `/predictions` | Predictions market | No | - |
| `/social` | Social features | No | - |

## Authentication Routes

| Route | Description |
|-------|-------------|
| `/login` | User login |
| `/signup` | User registration |

## Dashboard Routes (Protected)

| Route | Description |
|-------|-------------|
| `/dashboard` | Main dashboard |
| `/dashboard/analytics` | Analytics dashboard |
| `/dashboard/campaigns` | Campaigns list |
| `/dashboard/campaigns/[id]/review` | Campaign review |
| `/dashboard/earnings` | Earnings tracking |
| `/dashboard/network` | Network management |
| `/dashboard/profile` | Profile settings |
| `/dashboard/settings` | User settings |
| `/dashboard/submissions` | Submissions list |

## Admin/Control Routes

| Route | Description | Admin Only |
|-------|-------------|------------|
| `/control/predictions` | Admin predictions | Yes |
| `/control/social` | Admin social | Yes |

## Route Groupings

### By Authentication
- **Public:** 24 routes
- **Protected:** 11 routes
- **Admin:** 2 routes

### By Feature
- **Trading/Launch:** 5 routes
- **Social/Network:** 5 routes
- **Dashboard:** 9 routes
- **Quests/Activities:** 3 routes
- **Core:** 8 routes
- **Admin:** 2 routes
- **Auth:** 2 routes
- **Other:** 3 routes

## Navigation Structure

### Main Navigation (TopNav)
1. Discover → `/discover`
2. Launch → `/launch`
3. Earn → `/earn` (feature flag: ENABLE_EARN)
4. Live → `/live` (feature flag: ENABLE_LIVE)
5. Network → `/network` (auth required, feature flag: ENABLE_NETWORK)

### User Menu (When Authenticated)
1. My Profile → `/network/@me`
2. Portfolio → `/discover?view=my-holdings`
3. My Curves → `/discover?view=my-curves`
4. Wallet → `/wallet`
5. Earnings → `/earn`
6. Settings → `/settings`

## Route Status

### ✅ Verified Routes
- `/` - Landing page
- `/discover` - Discovery page
- `/launch` - Launch page
- `/network` - Network page
- `/earn` - Earn page

### ⚠️ Needs Verification
- `/profile` vs `/profile/[handle]` - Potential duplication
- `/earnings` vs `/earn` - Potential duplication
- Some dashboard routes may need consolidation

### 🔒 Protected Routes (Require Auth)
All `/dashboard/*` routes require authentication and redirect to `/login` if not authenticated.

## Missing Routes (Potential Additions)

- `/wallet` - Referenced in TopNav menu but not found in app directory
- `/settings` - Referenced in TopNav menu but maps to `/dashboard/settings`
- `/landing` - Exists but may be redundant with `/`

## Notes

1. **Feature Flags:** Routes with feature flags can be toggled via environment variables
2. **Authentication:** Protected routes use middleware or route guards
3. **Dynamic Routes:** `[id]` and `[handle]` are dynamic segments
4. **Redirects:** Some routes may redirect to canonical URLs
5. **Legacy Routes:** Some routes may be kept for backward compatibility

---

**Last Updated:** 2025-10-20
**Maintained By:** Engineering Team
