# 🚀 AZURE DEPLOYMENT - Manual Steps (No CLI Required)

## Follow These Steps in Azure Portal

### Step 1: Create a Resource Group
1. Go to https://portal.azure.com
2. Click **Create a resource**
3. Search for **Resource Group**
4. Click Create
   - **Name**: `talkflow-rg`
   - **Region**: `East US` (or closest to you)
5. Click **Review + Create** → **Create**

### Step 2: Create App Service Plan
1. Click **Create a resource**
2. Search for **App Service Plan**
3. Click Create
   - **Resource Group**: Select `talkflow-rg`
   - **Name**: `talkflow-plan`
   - **Publish**: `Code`
   - **Operating System**: `Linux`
   - **Region**: `East US`
   - **Pricing Plan**: `B1 (Basic)` - **$15/month** (perfect for $100 credit)
4. Click **Review + Create** → **Create**

### Step 3: Create Web App
1. Click **Create a resource**
2. Search for **Web App**
3. Click Create
   - **Resource Group**: Select `talkflow-rg`
   - **Name**: `talkflow-app` (this will be your URL: talkflow-app.azurewebsites.net)
   - **Publish**: `Code`
   - **Runtime Stack**: `Python 3.11`
   - **App Service Plan**: Select `talkflow-plan`
4. Click **Review + Create** → **Create**

### Step 4: Configure Startup Command
1. Go to your new Web App (talkflow-app)
2. In left menu: **Settings** → **Configuration**
3. Find **Startup Command** field
4. Paste this:
```
gunicorn --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 app.main:app
```
5. Click **Save**

### Step 5: Configure Environment Variables
1. Still in **Configuration** tab
2. Click **New application setting**
3. Add these settings:
   - **Name**: `FRONTEND_URL` | **Value**: `https://talkflow-app.azurewebsites.net`
   - **Name**: `SCM_DO_BUILD_DURING_DEPLOYMENT` | **Value**: `true`
   - **Name**: `OPENAI_API_KEY` | **Value**: `your-api-key-here` (get from OpenAI)
4. Click **OK** and **Save**

### Step 6: Enable GitHub Deployment
1. Go to your Web App (talkflow-app)
2. In left menu: **Deployment** → **Deployment Center**
3. **Source**: Select `GitHub`
4. Click **Authorize** (sign in with your GitHub account)
5. Fill in:
   - **Organization**: Select your GitHub user
   - **Repository**: `TalkFlow`
   - **Branch**: `main`
6. Click **Preview File** to see the workflow
7. Click **Save**

### Step 7: Monitor Deployment
1. Go to **Deployment Center**
2. Under "Active deployments", you should see the GitHub Actions workflow running
3. Wait for it to complete (first deployment takes 3-5 minutes)

### Step 8: Visit Your App ✅
Once deployment is complete:
```
https://talkflow-app.azurewebsites.net
```

## 📊 Verify Everything Works

1. Go to your Web App → **Overview**
2. Click the URL: `https://talkflow-app.azurewebsites.net`
3. You should see your FastAPI app running

## 🔍 Check Logs if Something Goes Wrong

1. Go to your Web App
2. In left menu: **Monitoring** → **Log Stream**
3. You'll see real-time logs from your app
4. Look for errors and debug

## 💰 Cost Monitoring

1. Go to your Resource Group: `talkflow-rg`
2. Click **Cost analysis**
3. Monitor your usage against $100 credit

## 🎉 You're Done!

Your app is now:
- ✅ Deployed on Azure
- ✅ Auto-deploying from GitHub (any push to main triggers deployment)
- ✅ Using your $100 student credit (~6-7 months free)
- ✅ Running 24/7 with no Docker image size limits

## 🚀 Next Deployments

Just push to GitHub and Azure automatically deploys:
```powershell
git add .
git commit -m "your changes"
git push origin main
```

Watch deployment in **Deployment Center** → GitHub Actions logs

---

**Need help?** See [AZURE_QUICK_START.md](./AZURE_QUICK_START.md) or [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md)
