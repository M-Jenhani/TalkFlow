# TalkFlow Azure Deployment - Quick Start

## ⚡ Fastest Way to Deploy (5 minutes)

### Step 1: Run the Deployment Script
```powershell
cd c:\portfolioforcv\TalkFlow
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\deploy-azure.ps1
```

The script will:
- Create resource group
- Create App Service Plan (B1 - $15/month, within your $100 credit)
- Create Web App
- Configure everything automatically

### Step 2: Set Up GitHub Deployment
1. Go to [Azure Portal](https://portal.azure.com)
2. Find your app: **talkflow-app**
3. Click **Deployment** → **Deployment center**
4. Select **GitHub** as source
5. Authenticate with GitHub
6. Select your repository and branch (main)
7. Click **Save**

### Step 3: Done! 🎉
- Azure will automatically deploy when you push to GitHub
- Your app will be live at: `https://talkflow-app.azurewebsites.net`

## 📊 Cost Breakdown
- B1 App Service Plan: **~$15/month**
- You have: **$100 credit for 365 days**
- **Total free months: ~6-7 months**

## 🔍 Monitoring & Debugging

### View logs:
```powershell
az webapp log tail --resource-group talkflow-rg --name talkflow-app
```

### Restart app:
```powershell
az webapp restart --resource-group talkflow-rg --name talkflow-app
```

### View app settings:
```powershell
az webapp config appsettings list --resource-group talkflow-rg --name talkflow-app
```

## 🔑 Setting Environment Variables

### Option 1: Azure Portal
1. Go to **Configuration** → **Application settings**
2. Add new setting:
   - Name: `OPENAI_API_KEY`
   - Value: `your-key`

### Option 2: Azure CLI
```powershell
az webapp config appsettings set `
  --resource-group talkflow-rg `
  --name talkflow-app `
  --settings OPENAI_API_KEY="your-key"
```

## ✅ Verify Deployment

1. Check GitHub Actions: Your repo → **Actions** tab
2. See deployment status in real-time
3. Once complete, visit: `https://talkflow-app.azurewebsites.net`

## 🆘 Troubleshooting

### If deployment fails:
1. Check GitHub Actions logs
2. Check Azure app logs: `az webapp log tail --resource-group talkflow-rg --name talkflow-app`
3. Verify `requirements.txt` exists in `/backend/`
4. Verify `startup.txt` exists in root directory

### Common issues:
- **Module not found**: Check requirements.txt has all dependencies
- **Port already in use**: startup.txt binds to port 8000, should be fine
- **Timeout**: App might be installing dependencies, wait 2-3 minutes

## 📝 Notes

- First deployment takes ~3-5 minutes (installing dependencies)
- Subsequent deployments take ~1-2 minutes
- App auto-restarts after each deployment
- Logs are in **Deployment center** or via Azure CLI

---

**Need help?** Check [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) for detailed instructions.
