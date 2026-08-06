# 🚀 Quick Deploy Guide

## Your Deployed Link Will Be:

```
🌐 https://mho2-de491.web.app
```

---

## ⚡ Deploy in 4 Steps

### 1️⃣ Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2️⃣ Login to Firebase
```bash
firebase login
```

### 3️⃣ Build Your App
```bash
pnpm build
```

### 4️⃣ Deploy
```bash
firebase deploy
```

---

## 🎯 One-Line Deploy (After Setup)

```bash
pnpm build && firebase deploy
```

---

## 📋 First Time Setup

If this is your first time deploying:

1. **Install Firebase CLI** (one-time):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login** (one-time):
   ```bash
   firebase login
   ```

3. **Build & Deploy** (every time you update):
   ```bash
   pnpm build
   firebase deploy
   ```

---

## ✅ Verify It's Working

After `firebase deploy`, you'll see:

```
✔  Deploy complete!

Hosting URL: https://mho2-de491.web.app
```

Click the link or copy it to your browser!

---

## 🔄 Update Your Live Site

Every time you make changes:

```bash
pnpm build && firebase deploy
```

Your site updates in ~30 seconds!

---

## 💻 Test Before Deploy

Always test locally first:

```bash
pnpm dev
```

Then open: http://localhost:8080

---

## 🌐 Your URLs

After deployment, these will work:

- **Main:** https://mho2-de491.web.app
- **Alt:** https://mho2-de491.firebaseapp.com

Both point to the same site!

---

## 🎉 That's It!

Your Medical Health Office system will be live and accessible to anyone with the link!

### What You Get:
✅ Fast, global CDN hosting  
✅ Free SSL certificate (HTTPS)  
✅ Automatic scaling  
✅ 99.9% uptime  
✅ Free tier (10GB storage, 360MB/day transfer)  

---

## 📱 Share Your Link

After deployment, share:
```
https://mho2-de491.web.app
```

Anyone can:
- View the landing page
- Login with credentials
- Access features based on their role

---

## 🆘 Having Issues?

**Command not found?**
```bash
npm install -g firebase-tools
```
Then restart your terminal.

**Not logged in?**
```bash
firebase login
```

**Build fails?**
```bash
pnpm install
pnpm build
```

**Still stuck?**
Check the full guide: `DEPLOYMENT_GUIDE.md`
