const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting token launch with image and auto-distribution...\n');

// First create the image if it doesn't exist
if (!fs.existsSync('token-image.png')) {
  console.log('📸 Creating placeholder image...');

  // Create a simple 1x1 red pixel PNG as base64
  const redPixelPNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
    'base64'
  );

  fs.writeFileSync('token-image.png', redPixelPNG);
  console.log('✅ Image created\n');
}

// Now run the launch script
console.log('🚀 Launching token...\n');
try {
  execSync('node scripts/working-launch-with-image.mjs', {
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (error) {
  console.error('Error during launch:', error.message);
  process.exit(1);
}