# Pump.fun Token Launch with Metadata

## Quick Start

```bash
# Install dependencies (if needed)
npm install form-data --legacy-peer-deps

# Run the launch script
node scripts/launch-with-metadata.js
```

## Configuration

Edit the `TOKEN_CONFIG` section in `scripts/launch-with-metadata.js`:

```javascript
const TOKEN_CONFIG = {
  name: 'Your Token Name',
  symbol: 'SYMBOL',
  description: 'Your token description',
  imageUrl: 'https://your-image-url.com/image.png',
  twitter: 'https://twitter.com/yourproject',
  telegram: 'https://t.me/yourgroup',
  website: 'https://yourwebsite.com',
  initialBuySOL: 0.01
};
```

## Image Requirements

For best results on Pump.fun:
- **Format**: PNG, JPG, or GIF
- **Size**: 400x400px to 1000x1000px recommended
- **File size**: Under 1MB
- **Aspect ratio**: 1:1 (square)

### Option 1: Use existing image URL
```javascript
imageUrl: 'https://your-cdn.com/token-image.png'
```

### Option 2: Upload to IPFS first
You can use services like:
- https://www.pinata.cloud/ (free tier available)
- https://nft.storage/ (free)
- https://web3.storage/ (free)

Then use the IPFS URL:
```javascript
imageUrl: 'https://ipfs.io/ipfs/QmYourImageHash'
```

## Metadata Format

The script creates metadata following Solana token standards:

```json
{
  "name": "Token Name",
  "symbol": "SYMBOL",
  "description": "Token description",
  "image": "https://image-url.com/image.png",
  "showName": true,
  "createdOn": "https://pump.fun",
  "twitter": "https://twitter.com/project",
  "telegram": "https://t.me/group",
  "website": "https://website.com"
}
```

## Integration with Project Form

To integrate with your project submission form:

```javascript
// In your curve launch API route
const projectData = {
  tokenName: formData.tokenName,
  tokenTicker: formData.tokenTicker,
  description: formData.description,
  logoUrl: formData.projectLogo, // Upload logo first
  scope: formData.scope, // ICM/CCM/MEME
  status: formData.status, // Upcoming/Live
  platforms: formData.platforms,
  economics: formData.economics
};

// Map to Pump.fun config
const pumpConfig = {
  name: projectData.tokenName,
  symbol: projectData.tokenTicker,
  description: projectData.description,
  imageUrl: projectData.logoUrl,
  initialBuySOL: 0.01 // Or calculate from curve data
};
```

## How It Works

1. **Metadata Upload**: Creates JSON metadata with token info
2. **Metadata URI**: Uploads to IPFS or creates data URI
3. **Token Creation**: Calls PumpPortal API with metadata
4. **Transaction**: Signs and sends versioned transaction
5. **Confirmation**: Polls for transaction confirmation
6. **Distribution**: Tokens distributed to key holders

## Troubleshooting

### Token not showing on Pump.fun

**Possible causes:**
- Metadata URI not properly formatted
- Image URL not accessible
- Pump.fun indexer delay (wait 1-2 minutes)

**Solutions:**
1. Check the token on Solscan first
2. Verify image URL loads in browser
3. Wait a few minutes for indexing
4. Check metadata at the URI in the launch JSON file

### Transaction timeout

The script uses polling instead of WebSockets, but if it times out:

1. Check transaction on Solscan using the signature
2. Token may still be created even if script times out
3. Free RPC endpoints may be slow during high traffic

### Image not displaying

1. Make sure image URL is publicly accessible
2. Use HTTPS (not HTTP)
3. Avoid URLs that require authentication
4. Test the image URL in your browser first

## Production Checklist

Before using in production:

- [ ] Upload token images to reliable CDN/IPFS
- [ ] Test metadata displays correctly
- [ ] Verify RPC endpoint is reliable
- [ ] Set up proper error handling
- [ ] Save all launch data to database
- [ ] Add transaction retry logic
- [ ] Implement proper logging
- [ ] Test with small SOL amounts first

## Next Steps

After successful launch:

1. Token is live on Pump.fun bonding curve
2. Share the Pump.fun link with community
3. Monitor trading activity
4. Earn 0.30% of all trades as creator
5. Token graduates to Raydium at 84.985 SOL raised
