const fs = require('fs');
const { createCanvas } = require('canvas');

// Check if canvas is available, if not use a pre-made base64 image
try {
  // Try to create with canvas
  const canvas = createCanvas(256, 256);
  const ctx = canvas.getContext('2d');

  // Create a simple pixel art pattern
  ctx.fillStyle = '#FF6B6B';
  ctx.fillRect(0, 0, 256, 256);

  // Add some pixel blocks
  ctx.fillStyle = '#4ECDC4';
  for(let i = 0; i < 8; i++) {
    for(let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillRect(i * 32, j * 32, 32, 32);
      }
    }
  }

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('token-image.png', buffer);
  console.log('✅ Created token-image.png with canvas');
} catch(e) {
  // Fallback: Create a simple 1x1 red pixel PNG
  const redPixelPNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
    'base64'
  );

  fs.writeFileSync('token-image.png', redPixelPNG);
  console.log('✅ Created token-image.png (simple placeholder)');
}