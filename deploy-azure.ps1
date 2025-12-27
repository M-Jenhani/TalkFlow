#!/usr/bin/env pwsh
# Azure Deployment Script for TalkFlow

# Color output
function Write-Success {
    Write-Host $args[0] -ForegroundColor Green
}

function Write-Info {
    Write-Host $args[0] -ForegroundColor Cyan
}

function Write-Error-Custom {
    Write-Host $args[0] -ForegroundColor Red
}

Write-Info "========================================="
Write-Info "TalkFlow - Azure Deployment Script"
Write-Info "========================================="

# Check if Azure CLI is installed
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "Azure CLI is not installed. Please install it first: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
}

Write-Info "`nStep 1: Login to Azure"
az login

Write-Info "`nStep 2: Creating Resource Group"
$resourceGroup = "talkflow-rg"
$location = "eastus"
az group create --name $resourceGroup --location $location

Write-Info "`nStep 3: Creating App Service Plan (B1 - Basic)"
$appServicePlan = "talkflow-plan"
az appservice plan create `
  --name $appServicePlan `
  --resource-group $resourceGroup `
  --sku B1 `
  --is-linux

Write-Info "`nStep 4: Creating Web App"
$webAppName = "talkflow-app"
az webapp create `
  --resource-group $resourceGroup `
  --plan $appServicePlan `
  --name $webAppName `
  --runtime "PYTHON|3.11"

Write-Info "`nStep 5: Configuring Startup Command"
az webapp config set `
  --resource-group $resourceGroup `
  --name $webAppName `
  --startup-file "startup.txt"

Write-Info "`nStep 6: Setting App Settings (Environment Variables)"
Write-Info "Enter your OpenAI API Key (press Enter to skip for now):"
$openaiKey = Read-Host
if ($openaiKey) {
    az webapp config appsettings set `
      --resource-group $resourceGroup `
      --name $webAppName `
      --settings `
        OPENAI_API_KEY=$openaiKey `
        SCM_DO_BUILD_DURING_DEPLOYMENT=true
} else {
    az webapp config appsettings set `
      --resource-group $resourceGroup `
      --name $webAppName `
      --settings `
        SCM_DO_BUILD_DURING_DEPLOYMENT=true
}

Write-Info "`nStep 7: Configuring Deployment from GitHub"
Write-Info "Go to Azure Portal and follow these steps:"
Write-Info "1. Navigate to your app: $webAppName"
Write-Info "2. Click 'Deployment' → 'Deployment center'"
Write-Info "3. Select 'GitHub' as source"
Write-Info "4. Authenticate and select your repository"
Write-Info "5. Branch: main"
Write-Info "6. Workflow will deploy automatically"

Write-Success "`n========================================="
Write-Success "Azure Setup Complete!"
Write-Success "========================================="
Write-Info "Your app URL: https://$webAppName.azurewebsites.net"
Write-Info "View logs: az webapp log tail --resource-group $resourceGroup --name $webAppName"
