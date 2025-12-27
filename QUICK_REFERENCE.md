# 🎯 AZURE DEPLOYMENT - QUICK REFERENCE CARD

## START HERE ⭐
**👉 Open and follow: [AZURE_MANUAL_SETUP.md](./AZURE_MANUAL_SETUP.md)**

---

## Your Credentials
- **App Name**: `talkflow-app`
- **Resource Group**: `talkflow-rg`
- **Plan**: `talkflow-plan` (B1 - $15/month)
- **Runtime**: Python 3.11
- **Region**: East US
- **URL**: `https://talkflow-app.azurewebsites.net`

---

## 7-Step Setup (Portal)

1. ✅ Create Resource Group: `talkflow-rg`
2. ✅ Create App Service Plan: `talkflow-plan` (B1, Linux)
3. ✅ Create Web App: `talkflow-app` (Python 3.11)
4. ✅ Set Startup Command
5. ✅ Set Environment Variables
6. ✅ Connect GitHub repo
7. ✅ Test deployment

**Each step: 1-2 minutes**
**Total time: ~10 minutes**

---

## Startup Command (Copy This)
```
gunicorn --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 app.main:app
```

## Required Environment Variables
| Name | Value |
|------|-------|
| `FRONTEND_URL` | `https://talkflow-app.azurewebsites.net` |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |
| `OPENAI_API_KEY` | Your API key here |

---

## After Setup

### Deploy Updates
```bash
git add .
git commit -m "your message"
git push origin main
```
✅ Auto-deploys in 1-2 minutes

### Check Logs
Go to: Web App → Log Stream

### Restart App
Go to: Web App → Restart

### Monitor Costs
Go to: Resource Group → Cost analysis

---

## Cost Calculator
- B1 Plan: $15/month
- You have: $100 credit
- **Free for: 6-7 months**

---

## Troubleshooting

**Issue**: Deployment takes too long
**Solution**: First deployment is 3-5 min. Normal.

**Issue**: "Module not found"
**Solution**: Check requirements.txt in `/backend/`

**Issue**: App won't start
**Solution**: Check Log Stream for errors

**Issue**: Can't connect GitHub
**Solution**: Authorize Azure to access GitHub

---

## Key Azure Portal Links

- 🏠 [Portal Home](https://portal.azure.com)
- 📦 [Your Resources](https://portal.azure.com/#blade/HubsExtension/BrowseResourceGroups)
- 🚀 [Your Web App](https://portal.azure.com) → Search "talkflow-app"
- 📊 [Cost Analysis](https://portal.azure.com) → Your Resource Group

---

## File Structure
```
TalkFlow/
├── backend/
│   ├── app/
│   │   └── main.py
│   ├── requirements.txt ✅
│   └── Dockerfile
├── startup.txt ✅
├── web.config ✅
├── .github/
│   └── workflows/
│       └── deploy-azure.yml ✅
├── AZURE_MANUAL_SETUP.md ⭐ START HERE
├── AZURE_DEPLOYMENT.md
├── AZURE_QUICK_START.md
└── DEPLOYMENT_COMPLETE.md
```

---

## FAQ

**Q: Will it really auto-deploy?**
A: Yes! Any push to `main` branch auto-deploys via GitHub Actions.

**Q: How much will it cost?**
A: B1 plan is $15/month. Your $100 credit = 6-7 months free.

**Q: Can I upgrade later?**
A: Yes! Switch to a larger plan anytime in Azure Portal.

**Q: What if I reach the credit limit?**
A: We can optimize or you subscribe at student rates (~$15/month).

---

## Success Indicators ✅

After deployment completes:
- [ ] GitHub Actions workflow passed
- [ ] Web App shows "Running" status
- [ ] Can visit: `https://talkflow-app.azurewebsites.net`
- [ ] API docs work: `https://talkflow-app.azurewebsites.net/docs`

---

## Next: Follow [AZURE_MANUAL_SETUP.md](./AZURE_MANUAL_SETUP.md) 🚀
