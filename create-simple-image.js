const fs = require('fs');

// Create a simple 1x1 red pixel PNG as base64
const redPixelPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
  'base64'
);

fs.writeFileSync('token-image.png', redPixelPNG);
console.log('✅ Created token-image.png');