# 🚀 Deployment Guide - MHO2 Application

Your application is already configured for **Firebase Hosting**!

## 📋 Prerequisites

Before deploying, you need:
1. **Node.js** installed (you already have this)
2. **Firebase CLI** installed
3. **Firebase account** (free)

---

## 🔧 Step 1: Install Firebase CLI

Open your terminal and run:

```bash
npm install -g firebase-tools
```

Or with PowerShell:
```powershell
npm install -g firebase-tools
```

---

## 🔑 Step 2: Login to Firebase

```bash
firebase login
```

This will:
- Open your browser
- Ask you to sign in with your Google account
- Grant Firebase CLI access to your account

---

## 🏗️ Step 3: Build Your Application

In your project directory (`C:\Users\THIS PC\Downloads\MHO2`), run:

```bash
pnpm build
```

Or if you don't have pnpm:
```bash
npm run build
```

This will create a `dist` folder with your compiled application.

---

## 🚀 Step 4: Deploy to Firebase

```bash
firebase deploy
```

After deployment, you'll see output like:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/mho2-de491/overview
Hosting URL: https://mho2-de491.web.app
```

---

## 🌐 Your Deployed Link

After deployment, your application will be available at:

### **Main URL:**
```
https://mho2-de491.web.app
```

### **Alternative URL:**
```
https://mho2-de491.firebaseapp.com
```

Both URLs will work and point to the same application!

---

## 📝 Quick Deployment Commands

### Full Deployment Process:
```bash
# 1. Build the application
pnpm build

# 2. Deploy to Firebase
firebase deploy
```

### Deploy Only Hosting:
```bash
firebase deploy --only hosting
```

---

## 🔄 Update Your Deployed Site

Whenever you make changes:

1. **Make your changes** to the code
2. **Build:** `pnpm build`
3. **Deploy:** `firebase deploy`

Your live site will be updated in seconds!

---

## 📊 Managing Your Deployment

### View Deployment Status:
```bash
firebase hosting:channel:list
```

### Check Current Project:
```bash
firebase projects:list
```

### Open Firebase Console:
```bash
firebase open hosting
```

Or visit: https://console.firebase.google.com/project/mho2-de491

---

## 🎯 Alternative Deployment Options

If you prefer other platforms:

### 1. **Vercel** (Recommended for React apps)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Your app will be live at: `https://your-app.vercel.app`

### 2. **Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Your app will be live at: `https://your-app.netlify.app`

---

## 🔍 Troubleshooting

### Issue: "Firebase command not found"
**Solution:** Restart your terminal after installing Firebase CLI

### Issue: "Not logged in"
**Solution:** Run `firebase login` again

### Issue: "Build fails"
**Solution:** 
- Make sure all dependencies are installed: `pnpm install`
- Check for TypeScript errors: `pnpm typecheck`
- Fix any errors and rebuild

### Issue: "Deploy fails"
**Solution:**
- Check your internet connection
- Verify you're logged in: `firebase login:list`
- Try deploying again

---

## 📱 Testing Your Deployed Site

After deployment:

1. **Open the URL** in your browser: `https://mho2-de491.web.app`
2. **Test the landing page** - Should show VWMedical design
3. **Test login:**
   - Email: `admin@mho.gov.ph`
   - Password: `admin123`
4. **Navigate through admin dashboard**
5. **Test reports and exports**
6. **Test on mobile devices**

---

## 🎨 Your Current Firebase Configuration

**Project ID:** `mho2-de491`

**Hosting Config:**
- Public directory: `dist/spa`
- Single Page App: Yes (rewrites all routes to /index.html)
- Build command: `pnpm build`

---

## 💡 Pro Tips

### 1. Preview Before Deploying
```bash
firebase hosting:channel:deploy preview
```

This creates a temporary preview URL without affecting your live site!

### 2. Set Up Automatic Deployments

Create `.github/workflows/firebase-hosting.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: mho2-de491
```

Now every push to main automatically deploys!

### 3. View Deployment History
Visit: https://console.firebase.google.com/project/mho2-de491/hosting

---

## 📊 Deployment Checklist

Before deploying, ensure:

- [ ] All features are working locally (`pnpm dev`)
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] Application builds successfully (`pnpm build`)
- [ ] Firebase CLI is installed
- [ ] Logged into Firebase account
- [ ] `.env` variables are set (if any)
- [ ] Build artifacts in `dist/spa` folder

---

## 🎉 Quick Start (If You're Ready Now)

**Run these commands in order:**

```bash
# 1. Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Build your app
pnpm build

# 4. Deploy
firebase deploy
```

**Your site will be live at:** `https://mho2-de491.web.app`

---

## 📞 Need Help?

If you encounter issues:

1. Check Firebase Console: https://console.firebase.google.com/project/mho2-de491
2. View deployment logs: `firebase hosting:channel:list`
3. Test locally first: `pnpm dev`
4. Check Firebase status: https://status.firebase.google.com/

---

## 🌟 Summary

Your application is **ready to deploy** with Firebase Hosting!

**Deployed URL will be:**
```
🌐 https://mho2-de491.web.app
```

**To deploy right now:**
```bash
pnpm build && firebase deploy
```

That's it! Your Medical Health Office system will be live and accessible worldwide! 🎉
