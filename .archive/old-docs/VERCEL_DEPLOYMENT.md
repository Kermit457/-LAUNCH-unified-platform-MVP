# 🚀 Vercel Deployment Guide

**Deploy LaunchOS to Vercel in ~15 minutes**

---

## ✅ **Pre-Deployment Checklist**

Before deploying, make sure:

- [x] App runs locally (`npm run dev` works)
- [x] All real-time features working
- [x] Appwrite configured
- [x] Environment variables in `.env`
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors

---

## 📋 **Step 1: Verify Local Build**

First, make sure the app builds successfully:

```bash
# In your project root
npm run build

# Should complete without errors
# If errors, fix them before deploying
```

---

## 🔧 **Step 2: Create vercel.json**

Create a `vercel.json` file in your project root for configuration.

**File:** `vercel.json`

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_APPWRITE_ENDPOINT": "@appwrite_endpoint",
    "NEXT_PUBLIC_APPWRITE_PROJECT_ID": "@appwrite_project_id",
    "NEXT_PUBLIC_APPWRITE_DATABASE_ID": "@appwrite_database_id",
    "NEXT_PUBLIC_PRIVY_APP_ID": "@privy_app_id"
  }
}
```

---

## 🌍 **Step 3: Install Vercel CLI (Optional)**

You can deploy via CLI or web dashboard. CLI is faster:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Follow the prompts
```

---

## 🚀 **Step 4A: Deploy via CLI (Recommended)**

```bash
# In your project root
cd "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH"

# First deployment (will ask questions)
vercel

# Answer the prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# Project name? launchos (or your choice)
# Directory? ./ (current directory)
# Override settings? No

# For production deployment
vercel --prod
```

---

## 🌐 **Step 4B: Deploy via Web Dashboard (Alternative)**

If you prefer the web interface:

1. **Go to** https://vercel.com
2. **Sign in** with GitHub/GitLab/Email
3. **Click** "Add New Project"
4. **Import** your GitHub repo (or upload folder)
5. **Configure:**
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Add Environment Variables** (see Step 5)
7. **Click** "Deploy"

---

## 🔐 **Step 5: Environment Variables**

Add these in Vercel Dashboard:

**Go to:** Project Settings → Environment Variables

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | `https://fra.cloud.appwrite.io/v1` | Your Appwrite console |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | `68e34a030010f2321359` | Your Appwrite project |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID` | `launchos_db` | Your database ID |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Your Privy app ID | https://privy.io |
| `APPWRITE_API_KEY` | Your API key | Appwrite → Settings → API Keys |
| `NEXT_PUBLIC_APPWRITE_*_COLLECTION_ID` | Collection IDs | For each collection |

**All Collection IDs:**
```
NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID=launches
NEXT_PUBLIC_APPWRITE_CAMPAIGNS_COLLECTION_ID=campaigns
NEXT_PUBLIC_APPWRITE_QUESTS_COLLECTION_ID=quests
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID=comments
NEXT_PUBLIC_APPWRITE_VOTES_COLLECTION_ID=votes
NEXT_PUBLIC_APPWRITE_ACTIVITIES_COLLECTION_ID=activities
NEXT_PUBLIC_APPWRITE_NETWORK_INVITES_COLLECTION_ID=network_invites
NEXT_PUBLIC_APPWRITE_PAYOUTS_COLLECTION_ID=payouts
NEXT_PUBLIC_APPWRITE_SUBMISSIONS_COLLECTION_ID=submissions
```

---

## 🔍 **Step 6: Update Appwrite CORS**

Add your Vercel URL to Appwrite allowed origins:

1. **Go to** Appwrite Console
2. **Navigate to** Settings → Platforms
3. **Add Web Platform:**
   - Name: `LaunchOS Production`
   - Hostname: `your-app.vercel.app` (or custom domain)
4. **Click** "Add Platform"

---

## ✅ **Step 7: Verify Deployment**

After deployment completes:

1. **Visit** your Vercel URL
2. **Test** these features:
   - ✅ Homepage loads
   - ✅ Sign in with Privy works
   - ✅ Navigate to /discover
   - ✅ Navigate to /network
   - ✅ Navigate to /dashboard
   - ✅ Real-time features work
   - ✅ No console errors

---

## 🐛 **Common Issues & Fixes**

### **Build Fails: "Module not found"**
```bash
# Check package.json has all dependencies
npm install

# Try building locally first
npm run build
```

### **Environment Variables Not Working**
- Make sure they're prefixed with `NEXT_PUBLIC_` for client-side
- Redeploy after adding new env vars
- Check they're set for "Production" environment

### **Appwrite CORS Error**
- Add your Vercel domain to Appwrite platforms
- Format: `https://your-app.vercel.app` (no trailing slash)

### **TypeScript Errors**
```bash
# Fix TypeScript errors before deploying
npm run build

# Check for errors and fix them
```

### **Privy Not Working**
- Make sure `NEXT_PUBLIC_PRIVY_APP_ID` is set
- Check Privy dashboard for allowed domains
- Add your Vercel URL to Privy allowed origins

---

## 🎨 **Step 8: Custom Domain (Optional)**

To use your own domain:

1. **Go to** Vercel Project → Settings → Domains
2. **Add** your domain (e.g., `launchos.app`)
3. **Configure DNS:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or A record to Vercel's IP
4. **Wait** for DNS propagation (5-10 minutes)
5. **Update** Appwrite CORS with new domain

---

## 📊 **Deployment Checklist**

- [ ] `npm run build` works locally
- [ ] `vercel.json` created
- [ ] Vercel CLI installed (optional)
- [ ] Deployed to Vercel
- [ ] Environment variables added
- [ ] Appwrite CORS updated
- [ ] App loads on Vercel URL
- [ ] Sign in works
- [ ] Real-time features work
- [ ] No console errors
- [ ] Custom domain added (optional)

---

## 🚀 **Continuous Deployment**

Once deployed, Vercel automatically redeploys when you:

1. **Push to GitHub** (if connected to repo)
2. **Run** `vercel --prod` (if using CLI)
3. **Click** "Redeploy" in Vercel dashboard

**Main branch** → Production
**Other branches** → Preview deployments

---

## 📈 **Post-Deployment**

### **Monitor Performance:**
- Vercel Analytics (free)
- Check build times
- Monitor errors in Vercel logs

### **Analytics Setup:**
1. **Go to** Project → Analytics
2. **Enable** Vercel Analytics
3. **Add** to your app (optional):
   ```tsx
   // app/layout.tsx
   import { Analytics } from '@vercel/analytics/react'

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

---

## 🔄 **Redeployment**

To redeploy after changes:

```bash
# Via CLI
git add .
git commit -m "Update: description"
git push  # If connected to GitHub

# Or
vercel --prod  # Direct deployment

# Via Dashboard
# Click "Redeploy" on latest deployment
```

---

## 💡 **Performance Tips**

1. **Enable Edge Functions** for faster response
2. **Use Image Optimization** (Next.js `<Image>`)
3. **Enable Caching** for static assets
4. **Monitor Bundle Size** (keep under 500KB)
5. **Use Vercel Analytics** to track performance

---

## 📞 **Need Help?**

**Deployment fails:**
- Check build logs in Vercel dashboard
- Look for error messages
- Fix TypeScript/build errors locally first

**App doesn't work:**
- Check browser console for errors
- Verify environment variables
- Check Appwrite CORS settings

**Performance issues:**
- Review Vercel Analytics
- Check bundle size
- Optimize images and components

---

## ✅ **Success!**

Your app is now live at: `https://your-app.vercel.app` 🎉

**Next steps:**
1. Share the URL with testers
2. Monitor for issues
3. Collect feedback
4. Continue development

---

## 🎯 **Quick Commands Reference**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Pull environment variables
vercel env pull
```

---

**Ready to deploy?** Start with Step 1! 🚀
