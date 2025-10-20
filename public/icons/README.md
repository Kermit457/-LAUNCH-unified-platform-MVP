# PWA Icons Generation

## Quick Online Tool (Recommended):
Visit: https://www.pwabuilder.com/imageGenerator

1. Upload `/public/icm-motion-logo.svg`
2. Download all sizes
3. Extract to this `/public/icons/` folder

## Required Sizes:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Or use this command (requires ImageMagick):
```bash
# Install ImageMagick first
# Then run:
for size in 72 96 128 144 152 192 384 512; do
  convert ../icm-motion-logo.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

## Temporary Placeholder:
For now, copy any existing icon and rename it to the sizes above.
The PWA will still work, just with lower quality icons until proper ones are generated.
