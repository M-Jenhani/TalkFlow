# Render Deployment Guide (Free Tier - 512MB)

## Memory Optimizations Applied

The following optimizations have been made to fit within Render's 512MB free tier:

1. **CPU-only PyTorch** (~100MB vs 800MB+)
2. **Lazy loading** of embedding models (loaded only when needed)
3. **Removed heavy dependencies** (langchain, chromadb)
4. **Using smallest embedding model** (all-MiniLM-L6-v2)
5. **Single worker** in uvicorn to reduce memory usage

## Deployment Steps

### 1. Prerequisites
- GitHub account with your TalkFlow repo
- Render account (free tier)
- Hugging Face account and API token

### 2. Push Changes to GitHub
Ensure all the latest changes are pushed:
```bash
git add .
git commit -m "Optimize for Render 512MB memory limit"
git push
```

### 3. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**
   - **Name**: `talkflow-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty (will use root)
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Context**: `.` (root directory)

   **Instance Type:**
   - Select **"Free"** ($0/month, 512MB RAM)

   **Environment Variables:**
   Add these environment variables:
   
   | Key | Value |
   |-----|-------|
   | `HF_API_TOKEN` | Your Hugging Face API token |
   | `FRONTEND_URL` | Your Vercel frontend URL (e.g., `https://talkflow.vercel.app`) |
   | `HF_EMB_MODEL` | `sentence-transformers/all-MiniLM-L6-v2` |
   | `HF_INFERENCE_MODEL` | `meta-llama/Llama-3.2-3B-Instruct` |

4. Click **"Create Web Service"**

### 4. Monitor Deployment

Watch the deployment logs:
- Build should complete in ~5-10 minutes
- Memory usage should stay under 512MB
- Look for: "Starting FastAPI server on port..."

### 5. Get Your Backend URL

Once deployed, Render will provide a URL like:
```
https://talkflow-backend.onrender.com
```

### 6. Update Frontend Environment

Update your Vercel frontend environment variable:
```
NEXT_PUBLIC_API_URL=https://talkflow-backend.onrender.com
```

## Troubleshooting

### Out of Memory Error
If you still get OOM errors:
1. Ensure you're using CPU-only PyTorch (check requirements.txt)
2. Verify lazy loading is enabled in llm.py
3. Try redeploying from scratch
4. Consider upgrading to Render's paid plan ($7/month for 2GB)

### Port Binding Issues
The app automatically binds to Render's `PORT` environment variable. No manual configuration needed.

### Build Timeout
If the build times out:
1. Check that `--no-cache-dir` is in start.sh
2. Clear build cache in Render dashboard
3. Retry deployment

### API Errors
Ensure `HF_API_TOKEN` is set correctly:
1. Get token from https://huggingface.co/settings/tokens
2. Must have "read" access
3. Set in Render environment variables (not in code)

## Expected Memory Usage

With optimizations:
- **Idle**: ~180-250MB
- **First request** (loads model): ~350-450MB
- **Active**: ~400-480MB

This should fit comfortably within 512MB limit.

## Important Notes

### Free Tier Limitations
- **Spins down after 15 minutes** of inactivity
- **Cold start** takes 30-60 seconds (model loading)
- **No custom domains** on free tier
- **750 hours/month** free (enough for always-on)

### Performance Tips
1. Keep backend active with UptimeRobot (free monitoring)
2. First request will be slow (model loading)
3. Subsequent requests are fast
4. Embedding model loads once and stays in memory

## Alternative: If Memory Issues Persist

If 512MB is still not enough, consider:

1. **Upgrade Render Plan**: $7/month for 2GB RAM
2. **Use Railway**: $5 credit/month, pay-as-you-go
3. **Use Hugging Face Spaces**: Free GPU/CPU hosting
4. **Deploy to Vercel Serverless**: API routes (cold start penalty)

## Success Indicators

✅ Build completes without OOM errors  
✅ Service starts and stays running  
✅ Health check responds at `/health`  
✅ API responds to requests  
✅ Memory stays under 512MB  

## Support

If you encounter issues:
1. Check Render logs for errors
2. Verify environment variables are set
3. Ensure latest code is pushed to GitHub
4. Try clearing build cache and redeploying
