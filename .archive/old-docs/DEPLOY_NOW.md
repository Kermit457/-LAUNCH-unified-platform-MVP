# 🚀 Deploy to Vercel - Quick Guide

**Status:** Ready to deploy ✅

---

## ⚡ Quick Deploy (5 steps)

### **Step 1: Test Build Locally**

Open PowerShell (NOT Git Bash due to Cygwin issues) and run:

```powershell
cd "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH"
npm run build
```

**Expected:** Build completes successfully
**If errors:** Fix them before deploying (check output for details)

---

### **Step 2: Deploy to Vercel**

Two options:

#### **Option A: Vercel CLI (Recommended)**

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

#### **Option B: Web Dashboard**

1. Go to https://vercel.com
2. Sign in
3. Click "Add New Project"
4. Import your GitHub repo (or drag & drop folder)
5. Configure:
   - Framework: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
6. Don't add env vars yet (do in Step 3)
7. Click **Deploy**

---

### **Step 3: Add Environment Variables**

In Vercel Dashboard → Your Project → Settings → Environment Variables

Copy these from your `.env` file:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68e34a030010f2321359
NEXT_PUBLIC_APPWRITE_DATABASE_ID=launchos_db
NEXT_PUBLIC_PRIVY_APP_ID=cmfsej8w7013cle0df5ottcj6

# Collection IDs
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID=launches
NEXT_PUBLIC_APPWRITE_CAMPAIGNS_COLLECTION_ID=campaigns
NEXT_PUBLIC_APPWRITE_QUESTS_COLLECTION_ID=quests
NEXT_PUBLIC_APPWRITE_SUBMISSIONS_COLLECTION_ID=submissions
NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID=comments
NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID=notifications
NEXT_PUBLIC_APPWRITE_INVITES_COLLECTION_ID=network_invites
NEXT_PUBLIC_APPWRITE_NETWORK_INVITES_COLLECTION_ID=network_invites
NEXT_PUBLIC_APPWRITE_NETWORK_CONNECTIONS_COLLECTION_ID=network_connections
NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID=messages
NEXT_PUBLIC_APPWRITE_VOTES_COLLECTION_ID=votes

# Bucket IDs
NEXT_PUBLIC_APPWRITE_AVATARS_BUCKET_ID=avatars
NEXT_PUBLIC_APPWRITE_LAUNCH_LOGOS_BUCKET_ID=launch_logos
NEXT_PUBLIC_APPWRITE_CAMPAIGN_MEDIA_BUCKET_ID=campaign_media
NEXT_PUBLIC_APPWRITE_SUBMISSIONS_BUCKET_ID=submissions

# Server-side (for API routes)
APPWRITE_API_KEY=standard_55e5cb8f8869951e637cc9005d4e2f76b94fb76307905e8ee555c3c52bd2ba6c7eba85edeea800b62cc060a851727ad3b5353a2d47f6867551fea378fa74f5aa2319071ba24358610a1b745de1394c6532c29296967d3381dc7d6d62179645e3ea4a1322e4f6f4769dea0b7ac1dd7706a348116c9eb3738a9fdbfaa6f79c5ece

# Privy Secret (server-side)
PRIVY_APP_SECRET=4MQJHj4c5qyK6zCYU4PCNYtrPQB9NGXUNYSzn1YnYkHzZLuF8q7CNaihHtbZB5pW9VMCQvsb51s6Z3y5Cym3YEdn
```

**Important:**
- Set environment to **Production** (not Preview or Development)
- After adding, click **Redeploy** to apply changes

---

### **Step 4: Update Appwrite CORS**

1. Go to https://fra.cloud.appwrite.io
2. Open your project: `68e34a030010f2321359`
3. Go to **Settings** → **Platforms**
4. Click **Add Platform**
5. Select **Web App**
6. Add your Vercel URL: `https://your-app.vercel.app`
7. Save

**Note:** Get your Vercel URL from the deployment output or Vercel dashboard

---

### **Step 5: Update Privy Allowed Origins**

1. Go to https://dashboard.privy.io
2. Open your app: `cmfsej8w7013cle0df5ottcj6`
3. Go to **Settings** → **Allowed Origins**
4. Add your Vercel URL: `https://your-app.vercel.app`
5. Save

---

## ✅ Verification Checklist

After deployment, test these:

- [ ] App loads at Vercel URL
- [ ] No errors in browser console (F12)
- [ ] Can view /discover page
- [ ] Can view /network page
- [ ] Can view /dashboard
- [ ] Real-time features work (try commenting, voting)
- [ ] Network invites appear
- [ ] Activities feed updates

---

## 🐛 Common Issues

### **Build Fails**

```powershell
# Check for TypeScript errors
npm run build

# Look for errors and fix them
```

### **"Cannot initialize Privy provider"**

- Check `NEXT_PUBLIC_PRIVY_APP_ID` is set in Vercel
- Verify it matches your Privy dashboard
- Make sure it's set for **Production** environment
- Redeploy after adding

### **Appwrite CORS Error**

- Add your Vercel URL to Appwrite platforms
- Format: `https://your-app.vercel.app` (no trailing slash)
- Wait 1-2 minutes for changes to propagate

### **Environment Variables Not Working**

- Make sure they're prefixed with `NEXT_PUBLIC_` for client-side
- Set them for **Production** environment
- Click **Redeploy** after adding new vars

---

## 📊 Post-Deployment

### **Monitor Performance**

- Vercel Dashboard → Your Project → Analytics
- Check build times and errors
- Review Function logs for issues

### **Custom Domain (Optional)**

1. Vercel → Settings → Domains
2. Add your domain
3. Configure DNS (CNAME to `cname.vercel-dns.com`)
4. Update Appwrite CORS with new domain
5. Update Privy allowed origins with new domain

---

## 🎯 Quick Commands

```powershell
# Test build
npm run build

# Deploy via CLI
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

---

## ✨ What Changed for Deployment

**Fixed:**
- ✅ Added Privy app ID validation to prevent crashes
- ✅ App now gracefully handles missing/invalid Privy credentials
- ✅ Created `vercel.json` configuration
- ✅ Documented all required environment variables

**Ready:**
- ✅ Next.js build optimized
- ✅ Environment variables documented
- ✅ Deployment configuration complete
- ✅ Error handling improved

---

## 🚀 Let's Deploy!

**Start here:**

```powershell
# 1. Test build
npm run build

# 2. Deploy
vercel --prod

# 3. Get URL from output
# 4. Add env vars in Vercel dashboard
# 5. Update Appwrite CORS
# 6. Update Privy origins
# 7. Test the deployed app
```

---

**Need Help?**
- Build errors → Check console output, fix TypeScript/import errors
- Deployment errors → Check Vercel logs in dashboard
- Runtime errors → Check browser console, verify env vars
- CORS errors → Update Appwrite platforms with Vercel URL

---

**You're ready to deploy! 🎉**
