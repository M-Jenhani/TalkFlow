# Quick Deployment Checklist

## 🚀 Free Hosting Setup (30 minutes total)

### Backend (FastAPI)
- [ ] Go to https://railway.app (or render.com)
- [ ] Sign up with GitHub
- [ ] Connect your TalkFlow repo
- [ ] Set 2 environment variables:
  - `HF_API_TOKEN` = your Hugging Face token
  - `FRONTEND_URL` = will set after frontend deploy
- [ ] Deploy (automatic)
- [ ] Copy your backend URL

### Frontend (Next.js)
- [ ] Go to https://vercel.app
- [ ] Sign up with GitHub
- [ ] Import TalkFlow repository
- [ ] Set 1 environment variable:
  - `NEXT_PUBLIC_API_URL` = your backend URL from above
- [ ] Deploy (automatic)
- [ ] Get your frontend URL

### Final Step
- [ ] Go back to Railway/Render
- [ ] Update `FRONTEND_URL` to your Vercel frontend URL
- [ ] Restart backend service
- [ ] Done! ✅

## Test
```
Open: https://your-vercel-url.vercel.app
Upload a document → Chat → Done!
```

## URLs You'll Get
- Backend: `https://talkflow-xyz.railway.app`
- Frontend: `https://talkflow-xyz.vercel.app`

## Common Issues
| Issue | Fix |
|-------|-----|
| CORS error | Check `FRONTEND_URL` in backend environment |
| 502 error | Verify `HF_API_TOKEN` is set |
| Slow first request | Normal (model loading takes 10-20s) |
| Data disappeared | Free tier doesn't persist files between deploys |

