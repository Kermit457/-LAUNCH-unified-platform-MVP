# Clips Collection Schema

## Collection: `clips`
**ID**: `clips`
**Description**: User-submitted clips from social platforms (Twitter, TikTok, YouTube, Twitch)

## Attributes

| Attribute | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `clipId` | String (36) | Yes | - | Unique clip identifier |
| `submittedBy` | String (255) | Yes | - | User ID who submitted the clip |
| `campaignId` | String (36) | No | - | Campaign this clip is associated with |
| `platform` | String (20) | Yes | - | Platform: twitter, tiktok, youtube, twitch, instagram |
| `embedUrl` | String (500) | Yes | - | Original social media URL |
| `thumbnailUrl` | String (500) | No | - | Auto-fetched or manual thumbnail |
| `title` | String (200) | No | - | Clip title/description |
| `projectName` | String (100) | No | - | Associated project name |
| `badge` | String (20) | No | - | Status badge: LIVE, FROZEN, LAUNCHED |
| `views` | Integer | No | 0 | View count from our platform |
| `clicks` | Integer | No | 0 | Clicks to external social post |
| `buys` | Integer | No | 0 | Conversions/purchases tracked |
| `earnings` | Float | No | 0.0 | Total earnings in SOL |
| `ctr` | Float | No | 0.0 | Click-through rate percentage |
| `status` | String (20) | Yes | active | active, pending, rejected, removed |
| `ownerType` | String (20) | No | user | Entity type: user, project |
| `ownerId` | String (36) | No | - | Entity ID (user or project) |
| `referralCode` | String (50) | No | - | Unique referral tracking code |
| `approved` | Boolean | No | false | Campaign owner approval status |
| `metadata` | String (2000) | No | - | JSON metadata (duration, hashtags, etc.) |

## Indexes

1. **by_submittedBy**
   - Type: Key
   - Attributes: `submittedBy` (ASC)
   - Orders: ASC

2. **by_campaignId**
   - Type: Key
   - Attributes: `campaignId` (ASC)
   - Orders: ASC

3. **by_status**
   - Type: Key
   - Attributes: `status` (ASC)
   - Orders: ASC

4. **by_platform**
   - Type: Key
   - Attributes: `platform` (ASC)
   - Orders: ASC

5. **by_views_desc**
   - Type: Key
   - Attributes: `views` (DESC)
   - Orders: DESC

6. **by_entity**
   - Type: Key
   - Attributes: `ownerType` (ASC), `ownerId` (ASC)
   - Orders: ASC, ASC

## Permissions

### Document Security
- **Create**: Any authenticated user
- **Read**: Any (public clips feed)
- **Update**: Document creator (`submittedBy`) or admin
- **Delete**: Document creator or admin

### Collection Security
- Public read access for feed
- Authenticated write access for submissions

## Example Document

```json
{
  "$id": "clip_abc123",
  "$createdAt": "2025-01-15T10:30:00.000Z",
  "$updatedAt": "2025-01-15T12:00:00.000Z",
  "clipId": "clip_1234567890",
  "submittedBy": "user_xyz",
  "campaignId": "campaign_789",
  "platform": "twitter",
  "embedUrl": "https://twitter.com/icmmotion/status/1234567890",
  "thumbnailUrl": "https://pbs.twimg.com/...",
  "title": "Check out this amazing token launch!",
  "projectName": "ICM Token",
  "badge": "LIVE",
  "views": 5217,
  "clicks": 120,
  "buys": 7,
  "earnings": 2.71,
  "ctr": 5.8,
  "status": "active",
  "ownerType": "user",
  "ownerId": "user_xyz",
  "referralCode": "ref_abc123xyz",
  "approved": true,
  "metadata": "{\"duration\": 30, \"hashtags\": [\"crypto\", \"solana\"]}"
}
```

## Relations

- **submittedBy** → Users collection
- **campaignId** → Campaigns collection
- **ownerId** → Users or Projects (based on ownerType)

## Usage Notes

1. **Platform Detection**: Auto-detect from URL pattern
2. **Thumbnail Fetching**: Use oEmbed APIs or Open Graph tags
3. **Referral Tracking**: Generate unique codes for conversion attribution
4. **Approval Flow**: Clips submitted to campaigns require owner approval
5. **Earnings Calculation**: Based on clicks, buys, and campaign rewards
