# 🚀 Quick Setup - Real-time Features

## ✅ Script Created!

I've created an automatic setup script that will add the database fields for you.

---

## 📋 Run This Command:

Open your terminal in the project folder and run:

```bash
npm run setup-realtime
```

**That's it!** The script will:
1. ✅ Add `viewCount` field to launches collection
2. ✅ Add `boostCount` field to launches collection
3. ⏳ Wait 30 seconds for Appwrite to process
4. ✅ Confirm setup is complete

---

## 🎯 What The Script Does:

The script ([scripts/setup-realtime-fields.js](scripts/setup-realtime-fields.js)) automatically:

- Connects to your Appwrite database
- Adds two Integer fields:
  - `viewCount` (default: 0)
  - `boostCount` (default: 0)
- Handles errors gracefully (skips if fields already exist)
- Waits for Appwrite to finish processing

---

## ⚠️ Requirements:

Make sure your `.env` file has:
```env
APPWRITE_API_KEY=standard_55e5cb8f8869951e637cc9005d4e2f76b94fb76307905e8ee555c3c52bd2ba6c7eba85edeea800b62cc060a851727ad3b5353a2d47f6867551fea378fa74f5aa2319071ba24358610a1b745de1394c6532c29296967d3381dc7d6d62179645e3ea4a1322e4f6f4769dea0b7ac1dd7706a348116c9eb3738a9fdbfaa6f79c5ece
```

*(This is already in your .env file, so you're good to go!)*

---

## 🧪 After Setup - Test It!

### **Test 1: View Counting**
1. Refresh your app (Ctrl/Cmd + R)
2. Go to http://localhost:3000/discover
3. Click on any launch to view details
4. Open Appwrite Console → Databases → launches
5. Find the launch you clicked
6. **Check**: `viewCount` should be 1 (or incremented)

### **Test 2: Boost Feature**
1. Visit a launch detail page
2. Click the **"Boost"** button
3. Check Appwrite Console
4. **Check**: `boostCount` should be incremented

### **Test 3: Real-time Badges**
1. Open `/discover` in browser
2. Look for these badges on launch cards:
   - ⚡ **Boost count** (fuchsia badge)
   - 👁️ **View count** (green badge)

---

## 🐛 Troubleshooting:

### **Script fails with "API key not found"**
- Check your `.env` file has `APPWRITE_API_KEY`
- Make sure it's the correct API key with database permissions

### **"Field already exists" error**
- This is normal! It means the fields are already there
- The script will skip and continue

### **Script hangs or timeout**
- Appwrite can be slow sometimes
- Just wait or restart the script
- Check Appwrite Console manually to see if fields were created

---

## 📁 Files Created:

- ✅ `scripts/setup-realtime-fields.js` - Main setup script
- ✅ `scripts/setup-realtime-fields.ts` - TypeScript version
- ✅ Added `"setup-realtime"` command to `package.json`

---

## 🎉 Once Setup is Done:

All these features will work automatically:

1. **View Tracking**
   - Auto-increments when user visits launch page
   - Shows in green 👁️ badge on cards

2. **Boost Tracking**
   - Increments when user clicks "Boost"
   - Shows in fuchsia ⚡ badge on cards

3. **Real-time Updates**
   - Changes sync across all browser tabs
   - No page refresh needed
   - Updates instantly via WebSocket

4. **Activities Feed**
   - Shows in dashboard (scroll down)
   - Real-time activity notifications

5. **Network Invites**
   - Shows badge in navbar
   - Real-time friend requests

---

## 💡 Future Development:

**Remember for next time:**
1. ✅ Add database fields FIRST (using scripts like this)
2. ✅ Then write the code
3. ✅ Test immediately
4. ✅ Ship features that actually work!

**Keep this pattern:**
```
Database Schema → Code → Test → Deploy
```

Not:
```
Code → "Oh no, database missing!" → Go back and add fields
```

---

## 📞 Need Help?

- Check [APPWRITE_REALTIME_SETUP.md](APPWRITE_REALTIME_SETUP.md) for detailed manual setup
- Review the script: [scripts/setup-realtime-fields.js](scripts/setup-realtime-fields.js)
- Check Appwrite Console for errors

---

**Ready?** Run: `npm run setup-realtime` 🚀
