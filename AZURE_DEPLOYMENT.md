# Azure Deployment Guide for TalkFlow

This guide will help you deploy TalkFlow to Azure App Service.

## Prerequisites

- Azure Student Account with $100 credits
- Azure CLI installed
- Git installed
- GitHub account with your repo connected

## Step 1: Create Resource Group

```powershell
az group create --name talkflow-rg --location eastus
```

## Step 2: Create App Service Plan

```powershell
az appservice plan create `
  --name talkflow-plan `
  --resource-group talkflow-rg `
  --sku B1 `
  --is-linux
```

## Step 3: Create Web App

```powershell
az webapp create `
  --resource-group talkflow-rg `
  --plan talkflow-plan `
  --name talkflow-app `
  --runtime "PYTHON|3.11"
```

## Step 4: Configure Startup Command

```powershell
az webapp config set `
  --resource-group talkflow-rg `
  --name talkflow-app `
  --startup-file "startup.txt"
```

## Step 5: Set Environment Variables

Set the following app settings in Azure Portal or via CLI:

```powershell
az webapp config appsettings set `
  --resource-group talkflow-rg `
  --name talkflow-app `
  --settings `
    OPENAI_API_KEY="your-key-here" `
    FRONTEND_URL="https://talkflow-app.azurewebsites.net" `
    SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

## Step 6: Deploy from GitHub

### Option A: Using GitHub Actions (Automatic)

1. Go to Azure Portal → talkflow-app → Deployment center
2. Select GitHub as source
3. Connect to your repository
4. GitHub Actions workflow will deploy automatically on push

### Option B: Using Azure CLI (Manual)

```powershell
az webapp deployment source config-zip `
  --resource-group talkflow-rg `
  --name talkflow-app `
  --src "path-to-your-repo.zip"
```

## Monitoring

View logs:
```powershell
az webapp log tail --resource-group talkflow-rg --name talkflow-app
```

Visit your app:
```
https://talkflow-app.azurewebsites.net
```

## Cost Estimation

- App Service Plan B1: ~$15/month
- You have $100 credit = ~6-7 months free

## Troubleshooting

If deployment fails:
1. Check logs: `az webapp log tail --resource-group talkflow-rg --name talkflow-app`
2. Verify startup.txt command
3. Check requirements.txt is in root
4. Ensure .env variables are set

## Next Steps

1. Push changes to GitHub
2. Follow steps above
3. Azure will automatically deploy on each push
