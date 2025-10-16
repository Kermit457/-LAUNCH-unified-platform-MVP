/**
 * Upload image to IPFS using NFT.Storage (free service)
 *
 * Steps:
 * 1. Get free API key from https://nft.storage
 * 2. Add to .env.local: NFT_STORAGE_API_KEY=your_key_here
 * 3. Place your image as 'token-image.png' in this folder
 * 4. Run: node scripts/upload-to-ipfs.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function uploadToIPFS() {
  console.log('📤 Uploading to IPFS via NFT.Storage...\n');

  try {
    // Check for API key
    const apiKey = process.env.NFT_STORAGE_API_KEY;

    if (!apiKey) {
      console.log('❌ No NFT.Storage API key found!\n');
      console.log('To get one:');
      console.log('1. Go to https://nft.storage');
      console.log('2. Sign up for free');
      console.log('3. Create an API key');
      console.log('4. Add to .env.local: NFT_STORAGE_API_KEY=your_key_here\n');

      console.log('Alternative: Use Pinata.cloud or Web3.Storage\n');
      return;
    }

    // Check for image file
    const imagePath = 'token-image.png';

    if (!fs.existsSync(imagePath)) {
      console.log(`❌ Image not found: ${imagePath}\n`);
      console.log('Please save your token image as "token-image.png" in this directory\n');
      return;
    }

    console.log('✅ Found image:', imagePath);
    console.log('✅ API key configured');
    console.log('');

    // Read image file
    const imageBuffer = fs.readFileSync(imagePath);
    console.log('📊 Image size:', (imageBuffer.length / 1024).toFixed(2), 'KB');
    console.log('');

    // Upload to NFT.Storage
    console.log('⏳ Uploading to IPFS...');

    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: 'token.png',
      contentType: 'image/png'
    });

    const response = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const ipfsUrl = `https://ipfs.io/ipfs/${data.value.cid}`;
    const gatewayUrl = `https://nftstorage.link/ipfs/${data.value.cid}`;

    console.log('');
    console.log('='.repeat(70));
    console.log('✅ UPLOAD SUCCESSFUL!');
    console.log('='.repeat(70));
    console.log('');
    console.log('IPFS CID:', data.value.cid);
    console.log('');
    console.log('URLs (use any of these):');
    console.log('  IPFS.io:      ', ipfsUrl);
    console.log('  NFT.Storage:  ', gatewayUrl);
    console.log('  CF-IPFS:      ', `https://cf-ipfs.com/ipfs/${data.value.cid}`);
    console.log('');
    console.log('Use this in your token creation script:');
    console.log(`  imageUrl: '${gatewayUrl}'`);
    console.log('');

    // Save to file for easy reference
    const uploadData = {
      cid: data.value.cid,
      ipfsUrl,
      gatewayUrl,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync('ipfs-upload.json', JSON.stringify(uploadData, null, 2));
    console.log('📁 Saved to: ipfs-upload.json');
    console.log('');

  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    console.error(error);
  }
}

uploadToIPFS().catch(console.error);
