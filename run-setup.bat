@echo off
echo Running Appwrite setup script...
cd /d "%~dp0"
call npm run setup-appwrite
pause
