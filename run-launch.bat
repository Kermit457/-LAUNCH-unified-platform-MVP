@echo off
echo Creating test image...
node create-simple-image.js
echo.
echo Launching token with image...
node scripts\working-launch-with-image.mjs
pause