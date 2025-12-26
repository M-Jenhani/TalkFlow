# TalkFlow Deployment Guide (Free Hosting)

This guide covers deploying TalkFlow to production for free using Railway.app and Vercel.

## Option 1: **Railway.app** (Recommended for FastAPI)

### Backend Deployment

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub
   - Create new project

2. **Deploy FastAPI Backend**
   - Connect your GitHub repository
   - Railway will auto-detect Python and create environment
   - Set environment variables:
     - `HF_API_TOKEN`: Your Hugging Face API token
     - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://talkflow-frontend.vercel.app`)
   - Railway generates a public URL automatically

3. **Important Notes**
   - Free tier: 500 hours/month (enough for development)
   - ChromaDB data persists during the same deployment
   - If you redeploy, vector data resets (use JSON fallback for session-only storage)

---

## Option 2: **Render.com** (Alternative)

### Backend Deployment

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Deploy FastAPI Service**
   - New → Web Service
   - Connect your GitHub repo
   - Settings:
     - Language: Python
     - Build command: `pip install -r requirements.txt`
     - Start command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
   - Add environment variables:
     - `HF_API_TOKEN`
     - `FRONTEND_URL`
   - Deploy

3. **Important Notes**
   - Free tier: Service spins down after 15 minutes of inactivity
   - Each startup takes ~30 seconds (cold start)
   - Good for demos/portfolios

---

## Frontend Deployment (Both Options)

### Deploy to Vercel (Best for Next.js)

1. **Push to GitHub**
   ```powershell
   cd c:\portfolioforcv\TalkFlow
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Connect Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Import your TalkFlow repository
   - Vercel auto-detects Next.js configuration

3. **Set Environment Variables in Vercel**
   - Go to project settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app`
   - (Replace with actual Railway URL from step 1)

4. **Deploy**
   - Vercel auto-deploys on push
   - Get your frontend URL (e.g., `https://talkflow-frontend.vercel.app`)

---

## Update Frontend for Production

Edit `frontend/app/page.tsx` to use the production API URL:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

The `Chat` component should use this:
```typescript
const response = await fetch(`${API_BASE}/stream?q=${encodeURIComponent(question)}&personality=${personality}&lang=${language}&session_id=${sessionId}`, {
  // ... rest of fetch
});
```

---

## Step-by-Step Deployment Summary

### 1. Prepare Code
- ✅ Already done: Updated CORS in backend
- ✅ Already done: Created Procfile, runtime.txt

### 2. Deploy Backend (Choose one)

**Option A: Railway**
```
1. Go to railway.app → Sign up
2. Create new project → Select GitHub
3. Connect TalkFlow repository
4. Set HF_API_TOKEN and FRONTEND_URL environment variables
5. Deploy (automatic)
6. Copy the generated URL (e.g., https://talkflow-backend-xyz.railway.app)
```

**Option B: Render**
```
1. Go to render.com → Sign up
2. Create new Web Service → GitHub
3. Connect TalkFlow repo
4. Start command: uvicorn app.main:app --host 0.0.0.0 --port 8000
5. Set environment variables
6. Deploy
7. Copy the URL
```

### 3. Deploy Frontend
```
1. Go to vercel.com → Sign up
2. Import TalkFlow project
3. Environment variable: NEXT_PUBLIC_API_URL=https://your-backend-url
4. Deploy (automatic)
5. Share frontend URL
```

### 4. Update Backend CORS
- Once frontend is live, update `FRONTEND_URL` environment variable in Railway/Render
- This ensures backend accepts requests from your Vercel URL

---

## Testing Deployment

After deployment:

1. **Test Backend Health**
   ```
   curl https://your-backend-url/health
   ```
   Should return: `{"status":"ok"}`

2. **Test Frontend**
   - Visit your Vercel URL
   - Try uploading a document
   - Try chatting

3. **Debug Issues**
   - Check backend logs in Railway/Render dashboard
   - Check Vercel deployment logs
   - Verify environment variables are set correctly

---

## Cost & Limits

| Service | Free Tier | Cold Start | Data Persistence |
|---------|-----------|-----------|------------------|
| Railway | 500 hrs/mo | ~1s | Session-based |
| Render | Full | ~30s | Session-based |
| Vercel | Full | ~1s | N/A (frontend only) |

**ChromaDB Note**: Free tier hosting doesn't guarantee persistent file storage across redeploys. For production, consider upgrading or using a cloud vector DB (Pinecone free tier, Supabase, etc.).

---

## Troubleshooting

### "CORS error in frontend"
- Verify `FRONTEND_URL` is set correctly in backend environment
- Restart the backend service
- Check that backend URL in frontend matches

### "502 Bad Gateway from backend"
- Backend service crashed (check logs)
- Usually due to missing `HF_API_TOKEN`
- Restart service

### "Model loading takes too long"
- First request to API takes 10-20 seconds (model initialization)
- This is normal on free tier
- Subsequent requests are fast

### "Vector data disappeared after deploy"
- ChromaDB is file-based and resets on free tier
- To persist: upgrade to paid tier or integrate cloud vector DB

---

## Next Steps

1. Deploy backend to Railway/Render (5 mins)
2. Deploy frontend to Vercel (5 mins)
3. Update environment variables (2 mins)
4. Test all features (5 mins)
5. Share your deployed URL for internship applications!

Good luck! 🚀
