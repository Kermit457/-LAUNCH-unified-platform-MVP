# Complete Appwrite Collections Setup Guide

This guide contains ALL required attributes for each collection used by the LaunchOS platform.

## 🎯 Collections Overview

1. **campaigns** - Clipping campaigns and bounties
2. **quests** - Raids and bounties
3. **submissions** - User submissions for campaigns/quests
4. **users** - User profiles
5. **launches** - Token/project launches
6. **votes** - Launch upvotes
7. **comments** - Launch comments
8. **payouts** - Payment tracking
9. **activities** - Activity feed
10. **notifications** - User notifications
11. **network_invites** - Collaboration invites
12. **network_connections** - User connections
13. **messages** - Direct messages

---

## 1. CAMPAIGNS Collection

### String Attributes
| Attribute | Type | Required | Size | Default | Notes |
|-----------|------|----------|------|---------|-------|
| campaignId | String | Yes | 255 | - | Unique campaign ID |
| type | String | Yes | 50 | "clipping" | Values: "clipping", "bounty", "airdrop" |
| title | String | Yes | 255 | - | Campaign title |
| description | String | Yes | 5000 | "" | Campaign description |
| createdBy | String | Yes | 255 | - | User ID of creator |
| status | String | Yes | 50 | "active" | Values: "active", "completed", "cancelled" |
| gdocUrl | String | Yes | 500 | "" | Google Drive link |
| imageUrl | String | Yes | 500 | "" | Campaign image URL |
| ownerType | String | Yes | 20 | "user" | Values: "user", "project" |
| ownerId | String | Yes | 255 | - | User or project ID |

### Number Attributes
| Attribute | Type | Required | Min | Default | Notes |
|-----------|------|----------|-----|---------|-------|
| prizePool | Double | Yes | 0 | 0 | Total prize pool in USDC |
| budgetTotal | Double | Yes | 0 | 0 | Total budget allocated |
| budgetPaid | Double | No | 0 | 0 | Amount paid out so far |
| ratePerThousand | Double | Yes | 0 | 0 | Payout per 1000 views |
| minViews | Integer | Yes | 0 | 0 | Minimum views required |
| minDuration | Integer | Yes | 0 | 0 | Min video duration (seconds) |
| maxDuration | Integer | Yes | 0 | 0 | Max video duration (seconds) |
| participants | Integer | No | 0 | 0 | Number of participants |

### Array Attributes
| Attribute | Type | Required | Default | Notes |
|-----------|------|----------|---------|-------|
| platforms | String[] | Yes | [] | Allowed platforms (youtube, tiktok, etc) |
| socialLinks | String[] | Yes | [] | Required social media links |
| tags | String[] | No | [] | Campaign tags for filtering |
| requirements | String[] | No | [] | Campaign requirements |

### Indexes
- `idx_campaignId` - Key on campaignId (ASC)
- `idx_status` - Key on status (ASC)
- `idx_createdBy` - Key on createdBy (ASC)
- `idx_owner` - Key on ownerType (ASC), ownerId (ASC)
- `idx_type` - Key on type (ASC)

---

## 2. QUESTS Collection

### String Attributes
| Attribute | Type | Required | Size | Default | Notes |
|-----------|------|----------|------|---------|-------|
| questId | String | Yes | 255 | - | Unique quest ID |
| type | String | Yes | 50 | - | Values: "raid", "bounty" |
| title | String | Yes | 255 | - | Quest title |
| description | String | Yes | 5000 | "" | Quest description |
| createdBy | String | Yes | 255 | - | User ID of creator |
| status | String | Yes | 50 | "active" | Values: "active", "completed", "cancelled", "live" |
| deadline | String | No | 255 | - | ISO date string |

### Number Attributes
| Attribute | Type | Required | Min | Default | Notes |
|-----------|------|----------|-----|---------|-------|
| poolAmount | Double | Yes | 0 | 0 | Total pool amount in USDC |
| budgetTotal | Double | Yes | 0 | 0 | Total budget |
| budgetPaid | Double | Yes | 0 | 0 | Amount paid out |
| payPerTask | Double | Yes | 0 | 0 | Payment per task completion |
| participants | Integer | No | 0 | 0 | Number of participants |

### Array Attributes
| Attribute | Type | Required | Default | Notes |
|-----------|------|----------|---------|-------|
| platforms | String[] | Yes | [] | Platforms required |
| requirements | String[] | No | [] | Quest requirements |

### Indexes
- `idx_questId` - Key on questId (ASC)
- `idx_status` - Key on status (ASC)
- `idx_createdBy` - Key on createdBy (ASC)
- `idx_type` - Key on type (ASC)

---

## 3. SUBMISSIONS Collection

### String Attributes
| Attribute | Type | Required | Size | Default | Notes |
|-----------|------|----------|------|---------|-------|
| submissionId | String | Yes | 255 | - | Unique submission ID |
| campaignId | String | No | 255 | - | Related campaign |
| questId | String | No | 255 | - | Related quest |
| userId | String | Yes | 255 | - | Submitter user ID |
| status | String | Yes | 50 | "pending" | Values: "pending", "approved", "rejected" |
| mediaUrl | String | Yes | 500 | - | Submission media URL |
| notes | String | No | 2000 | "" | Review notes |
| reviewedAt | String | No | 255 | - | ISO date string |
| ownerType | String | No | 20 | "user" | Values: "user", "project" |
| ownerId | String | No | 255 | - | Owner entity ID |

### Number Attributes
| Attribute | Type | Required | Min | Default | Notes |
|-----------|------|----------|-----|---------|-------|
| views | Integer | Yes | 0 | 0 | Video views |
| earnings | Double | Yes | 0 | 0 | Calculated earnings |

### Indexes
- `idx_submissionId` - Key on submissionId (ASC)
- `idx_userId` - Key on userId (ASC)
- `idx_campaignId` - Key on campaignId (ASC)
- `idx_questId` - Key on questId (ASC)
- `idx_status` - Key on status (ASC)
- `idx_owner` - Key on ownerType (ASC), ownerId (ASC)

---

## 4. USERS Collection

### String Attributes
| Attribute | Type | Required | Size | Default | Notes |
|-----------|------|----------|------|---------|-------|
| userId | String | Yes | 255 | - | Unique user ID (from Privy) |
| username | String | Yes | 100 | - | Unique username |
| displayName | String | No | 255 | "" | Display name |
| email | String | No | 255 | "" | User email |
| avatar | String | No | 500 | "" | Avatar URL |
| bio | String | No | 1000 | "" | User bio |
| walletAddress | String | No | 255 | "" | Primary wallet |

### Boolean Attributes
| Attribute | Type | Required | Default | Notes |
|-----------|------|----------|---------|-------|
| verified | Boolean | No | false | Email verified |

### Number Attributes
| Attribute | Type | Required | Min | Max | Default | Notes |
|-----------|------|----------|-----|-----|---------|-------|
| conviction | Integer | No | 0 | 100 | 0 | Trust score (0-100) |
| totalEarnings | Double | No | 0 | - | 0 | Total earnings |

### Array Attributes
| Attribute | Type | Required | Default | Notes |
|-----------|------|----------|---------|-------|
| roles | String[] | No | ["Member"] | User roles |
| socialLinks | String[] | No | [] | Social media links |

### Indexes
- `idx_userId` - Unique on userId (ASC)
- `idx_username` - Unique on username (ASC)
- `idx_walletAddress` - Key on walletAddress (ASC)

---

## 5. LAUNCHES Collection

### String Attributes
| Attribute | Type | Required | Size | Default | Notes |
|-----------|------|----------|------|---------|-------|
| launchId | String | No | 255 | - | Unique launch ID |
| title | String | No | 255 | - | Project title |
| subtitle | String | No | 255 | "" | Project subtitle/ticker |
| logoUrl | String | No | 500 | "" | Project logo URL |
| description | String | No | 5000 | "" | Full description |
| scope | String | No | 20 | "ICM" | Values: "ICM", "CCM" |
| status | String | No | 50 | "live" | Values: "live", "upcoming" |
| createdBy | String | No | 255 | - | Creator user ID |

### Legacy Fields (for backward compatibility)
| Attribute | Type | Required | Size | Default | Notes |
|-----------|------|----------|------|---------|-------|
| tokenName | String | No | 255 | - | Token name (legacy) |
| tokenSymbol | String | No | 50 | "" | Token symbol (legacy) |
| tokenImage | String | No | 500 | "" | Token image (legacy) |

### Number Attributes
| Attribute | Type | Required | Min | Max | Default | Notes |
|-----------|------|----------|-----|-----|---------|-------|
| convictionPct | Integer | No | 0 | 100 | 0 | Conviction percentage |
| commentsCount | Integer | No | 0 | - | 0 | Number of comments |
| upvotes | Integer | No | 0 | - | 0 | Number of upvotes |
| contributionPoolPct | Integer | No | 0 | 100 | 0 | Contribution pool % |
| feesSharePct | Integer | No | 0 | 100 | 0 | Fees share % |

### Array Attributes
| Attribute | Type | Required | Default | Notes |
|-----------|------|----------|---------|-------|
| tags | String[] | No | [] | Launch tags |

### Indexes
- `idx_launchId` - Key on launchId (ASC)
- `idx_status` - Key on status (ASC)
- `idx_createdBy` - Key on createdBy (ASC)
- `idx_scope` - Key on scope (ASC)

---

## Quick Setup Checklist

### For CAMPAIGNS (Most Critical)
✅ Add missing attributes:
- `type` (String, required, size 50, default: "clipping")
- `platforms` (String Array, required, default: [])
- `socialLinks` (String Array, required, default: [])
- `ownerType` (String, required, size 20, default: "user")
- `ownerId` (String, required, size 255)
- `budgetPaid` (Double, min: 0, default: 0)
- `participants` (Integer, min: 0, default: 0)
- `tags` (String Array, default: [])
- `requirements` (String Array, default: [])

### For QUESTS
✅ Add missing attributes:
- `deadline` (String, size 255)
- `participants` (Integer, min: 0, default: 0)
- `requirements` (String Array, default: [])

### For SUBMISSIONS
✅ Add missing attributes:
- `ownerType` (String, size 20, default: "user")
- `ownerId` (String, size 255)

---

## Testing After Setup

Run these commands to test:

```bash
# 1. Seed database with sample data
npm run seed

# 2. Check /earn page
# Should show campaigns and quests from Appwrite

# 3. Try creating a campaign
# Should create successfully without "Unknown attribute" errors
```

---

## Common Issues

### Issue: "Unknown attribute: type"
**Fix:** Add `type` attribute to campaigns collection

### Issue: "Unknown attribute: platforms"
**Fix:** Add `platforms` as String Array attribute

### Issue: "Invalid document structure"
**Fix:** Make sure ALL required attributes are added with correct types

### Issue: Campaign creation fails with "createdBy is unknown"
**Fix:** Add `ownerType` and `ownerId` attributes

---

## Need Help?

If you encounter issues:
1. Check the Appwrite Console for error messages
2. Verify all attributes match the types specified above
3. Make sure indexes are created
4. Check collection permissions (read/write enabled)