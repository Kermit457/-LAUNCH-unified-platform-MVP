@echo off
cd /d "%~dp0"
npx tsx scripts\seed-database.ts
pause