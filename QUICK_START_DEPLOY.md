# 🚀 TalkFlow Deployment - 20 Minute Quick Start

## The Plan
1. Deploy backend to Railway (10 min)
2. Deploy frontend to Vercel (5 min)
3. Connect them together (5 min)

---

## 🔧 Step 1: Railway Backend (10 minutes)

```bash
1. Go to https://railway.app → Sign Up with GitHub
2. New Project → GitHub Repo → Select TalkFlow
3. Go to "Variables"
4. Add: HF_API_TOKEN = your_token_from_huggingface
5. Deploy starts automatically
6. Copy the public URL (e.g., https://talkflow-xyz.railway.app)
   Save this! You'll need it in Step 2.
```

⏱️ Expected: Auto-deploys in 30 seconds

---

## 📱 Step 2: Vercel Frontend (5 minutes)

```bash
1. Go to https://vercel.com → Sign Up with GitHub
2. Import Project → Select TalkFlow
3. Before deploying, add Environment Variable:
   NEXT_PUBLIC_API_URL = https://talkflow-xyz.railway.app
                         (from Step 1)
4. Click Deploy
5. Get your frontend URL
   Save this! You'll need it in Step 3.
```

⏱️ Expected: Builds in ~2 minutes

---

## 🔗 Step 3: Update CORS (5 minutes)

```bash
1. Go back to Railway dashboard
2. Variables
3. Update: FRONTEND_URL = https://talkflow-xyz.vercel.app
                          (from Step 2)
4. Railway auto-redeploys
5. Done!
```

⏱️ Expected: Redeploy in 30 seconds

---

## ✅ Test It

```
Open: https://talkflow-xyz.vercel.app
- Upload a document
- Ask a question
- Get a response

If it works → Congratulations! 🎉
```

---

## 📋 Important Notes

**Your Backend URL Changes Every Redeploy in Free Tier**
- ✅ No problem - Vercel env var updates automatically
- ✅ Just update FRONTEND_URL if backend redeploys

**First Request Takes 10-20 Seconds**
- ✅ Normal - model loads on first use
- ✅ After that, responses are fast

**Free Tier Doesn't Persist Files Between Redeploys**
- ✅ Fine for demo/portfolio
- ✅ Your chat still works
- ✅ Uploaded documents reset if backend redeploys

---

## 🎓 What You Get

| Item | Link |
|------|------|
| Live App | https://talkflow-xyz.vercel.app |
| GitHub | https://github.com/M-Jenhani/TalkFlow |
| For Resume | "Live demo: [link above]" |

---

## 📞 If Something Goes Wrong

| Error | Fix |
|-------|-----|
| CORS error | Update `FRONTEND_URL` in Railway, wait for redeploy |
| 502 error | Check `HF_API_TOKEN` is set in Railway |
| Upload fails | Same as CORS above |
| Slow response | Wait 20 seconds (model loading) |

---

## Done! 🎉

You now have a **production-grade AI chatbot** hosted for **free** on the internet.

Time to put it on your resume and apply for that internship! 💼
