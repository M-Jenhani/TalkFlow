# TalkFlow Deployment - Complete Setup Guide

## 🎯 What You Get

After following this guide, you'll have:
- **Live Website**: `https://talkflow-xyz.vercel.app` (production frontend)
- **Working API**: `https://talkflow-xyz.railway.app` (production backend)
- **All Free**: Zero cost (Railway free tier + Vercel free tier)

---

## 📊 Architecture

```
[User's Browser]
       ↓
[Vercel Frontend] ← CORS allowed from
       ↓
[Railway Backend] 
       ↓
[Hugging Face API] (for LLM responses)
```

---

## ⏱️ Time Required

- **Backend setup**: ~10 minutes
- **Frontend setup**: ~5 minutes  
- **Testing**: ~5 minutes
- **Total**: ~20 minutes

---

## Step 1️⃣: Deploy Backend to Railway

### 1.1 Create Railway Account
```
1. Go to https://railway.app
2. Click "Start Free"
3. Sign up with GitHub account
4. Authorize Railway to access your repos
```

### 1.2 Create New Project
```
1. Click "New Project"
2. Select "GitHub Repo"
3. Find and select "TalkFlow"
4. Railway auto-detects it's a Python project
```

### 1.3 Add Environment Variables
```
Click "Variables" and add:

HF_API_TOKEN = [paste your Hugging Face token]
    ↑
    Get from: https://huggingface.co/settings/tokens
    (Need at least "Read" permission)

FRONTEND_URL = [leave blank for now, update after step 2]
```

### 1.4 Deploy
```
1. Railway auto-deploys when you connect
2. Wait for green checkmark (might take 30 seconds)
3. Copy the generated URL (e.g., https://talkflow-xyz.railway.app)
4. Save this URL - you'll need it in Step 2
```

**✅ Backend is live!**

---

## Step 2️⃣: Deploy Frontend to Vercel

### 2.1 Go to Vercel
```
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "GitHub" and authorize
4. You'll see your repos
```

### 2.2 Import TalkFlow
```
1. Find "TalkFlow" in your repos
2. Click "Import"
3. Vercel auto-detects Next.js
```

### 2.3 Add Environment Variable
```
Under "Environment Variables", add:

NEXT_PUBLIC_API_URL = https://talkflow-xyz.railway.app
                      ↑
                      (Your backend URL from Step 1.4)
```

### 2.4 Deploy
```
1. Click "Deploy"
2. Wait ~2 minutes for build to complete
3. You'll get a live URL (e.g., https://talkflow-xyz.vercel.app)
4. Copy this URL
```

**✅ Frontend is live!**

---

## Step 3️⃣: Update Backend CORS

### Back to Railway Dashboard
```
1. Open your Railway project
2. Click "Variables"
3. Update FRONTEND_URL = https://talkflow-xyz.vercel.app
                         ↑
                         (Your Vercel frontend URL from Step 2.4)
4. Save
5. Railway auto-redeploys (check for green checkmark)
```

**✅ Everything is now connected!**

---

## 🧪 Test Your Deployment

### Test 1: Backend Health
```
curl https://talkflow-xyz.railway.app/health
```
**Expected**: `{"status":"ok"}`

### Test 2: Full App
```
1. Open https://talkflow-xyz.vercel.app
2. Upload a document (PDF, TXT, MD)
3. Ask a question
4. Get a response
```

**✅ You're done! Your app is live!**

---

## 📱 Share Your Project

You now have two URLs to share:
- **For internship applications**: `https://talkflow-xyz.vercel.app`
- **GitHub repo**: Link to your TalkFlow GitHub repo
- **Resume mention**: "Live demo available at https://talkflow-xyz.vercel.app"

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| **"CORS error" in browser console** | Check `FRONTEND_URL` is set in Railway and backend redeployed |
| **"Failed to fetch" when uploading** | Same as above - CORS issue |
| **502 Bad Gateway error** | Check `HF_API_TOKEN` is set correctly in Railway env vars |
| **Very slow first request** | Normal! LLM model loads on first use (~10-20 seconds) |
| **Vector data disappeared** | Free tier doesn't persist files - this is expected |

---

## 🆓 Free Tier Limits (That's Fine for Portfolio)

| Service | Limit | Enough For? |
|---------|-------|------------|
| **Railway** | 500 hrs/month | ✅ Yes (24/7 = 720 hrs, so actually ~16 days continuous) |
| **Vercel** | 100GB bandwidth | ✅ Yes (much more than needed) |
| **HF API** | Unlimited free tier | ✅ Yes (50 reqs/min, 30GB/month) |

---

## 🎓 For Your Internship Interview

You can now say:
> "TalkFlow is a full-stack AI chatbot I deployed to production. The frontend is hosted on Vercel, the backend on Railway, and it uses the Hugging Face API for LLM responses. You can visit the live version at https://talkflow-xyz.vercel.app"

This shows:
- ✅ Full-stack deployment experience
- ✅ Cloud infrastructure knowledge
- ✅ Production-ready mindset
- ✅ Real working application (not just local)

---

## 📚 Next Steps (Optional)

1. **Monitor Performance**: Railway dashboard shows request logs
2. **Upgrade** (if needed): Both services offer paid tiers with more resources
3. **Custom Domain**: Vercel allows custom domains (free)
4. **Analytics**: Vercel dashboard shows traffic metrics

---

## ✨ Summary

```
You Now Have:
✅ Live frontend: https://talkflow-xyz.vercel.app
✅ Live backend: https://talkflow-xyz.railway.app
✅ Production deployment experience
✅ Portfolio project ready for interviews
✅ Zero cost
✅ Time investment: ~20 minutes
```

**Congratulations! Your TalkFlow project is now on the internet! 🚀**
