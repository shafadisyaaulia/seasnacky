# SeaSnacky Deployment Setup Script
# Run this script to setup Vercel deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SeaSnacky - Vercel Deployment Setup  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Vercel CLI is installed
Write-Host "[1/7] Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version 2>$null
    Write-Host "✅ Vercel CLI installed: v$vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed successfully!" -ForegroundColor Green
}

Write-Host ""

# Step 2: Login to Vercel
Write-Host "[2/7] Login to Vercel..." -ForegroundColor Yellow
Write-Host "Opening browser for login..." -ForegroundColor Cyan
vercel login

Write-Host ""

# Step 3: Initialize Vercel project
Write-Host "[3/7] Initializing Vercel project..." -ForegroundColor Yellow
Write-Host "Please answer the prompts:" -ForegroundColor Cyan
Write-Host "  - Set up and deploy? [Y]" -ForegroundColor Gray
Write-Host "  - Link to existing project? [N]" -ForegroundColor Gray
Write-Host "  - Project name: seasnacky" -ForegroundColor Gray
Write-Host "  - Directory: ./" -ForegroundColor Gray
Write-Host "  - Override settings? [N]" -ForegroundColor Gray
Write-Host ""

vercel

Write-Host ""
Write-Host "✅ Vercel project initialized!" -ForegroundColor Green

# Step 4: Get project info
Write-Host "[4/7] Getting project information..." -ForegroundColor Yellow

if (Test-Path ".vercel/project.json") {
    $projectInfo = Get-Content ".vercel/project.json" | ConvertFrom-Json
    $orgId = $projectInfo.orgId
    $projectId = $projectInfo.projectId
    
    Write-Host ""
    Write-Host "📋 SAVE THESE VALUES:" -ForegroundColor Cyan
    Write-Host "========================" -ForegroundColor Cyan
    Write-Host "Organization ID: $orgId" -ForegroundColor Green
    Write-Host "Project ID: $projectId" -ForegroundColor Green
    Write-Host "========================" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "❌ Could not find .vercel/project.json" -ForegroundColor Red
    Write-Host "Please run 'vercel' command manually" -ForegroundColor Yellow
}

# Step 5: Generate token reminder
Write-Host "[5/7] Vercel Token Setup" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open: https://vercel.com/account/tokens" -ForegroundColor White
Write-Host "2. Click 'Create Token'" -ForegroundColor White
Write-Host "3. Name: 'GitHub Actions - SeaSnacky'" -ForegroundColor White
Write-Host "4. Scope: Full Account" -ForegroundColor White
Write-Host "5. Copy the token" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter when you have the token..." -ForegroundColor Yellow
Read-Host

# Step 6: GitHub Secrets setup reminder
Write-Host "[6/7] GitHub Secrets Configuration" -ForegroundColor Yellow
Write-Host ""
Write-Host "Add these 3 secrets to GitHub:" -ForegroundColor Cyan
Write-Host "Repository → Settings → Secrets → Actions → New repository secret" -ForegroundColor Gray
Write-Host ""
Write-Host "Secret 1:" -ForegroundColor White
Write-Host "  Name: VERCEL_TOKEN" -ForegroundColor Green
Write-Host "  Value: [Your Vercel Token]" -ForegroundColor Gray
Write-Host ""
Write-Host "Secret 2:" -ForegroundColor White
Write-Host "  Name: VERCEL_ORG_ID" -ForegroundColor Green
Write-Host "  Value: $orgId" -ForegroundColor Gray
Write-Host ""
Write-Host "Secret 3:" -ForegroundColor White
Write-Host "  Name: VERCEL_PROJECT_ID" -ForegroundColor Green
Write-Host "  Value: $projectId" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Enter when secrets are added..." -ForegroundColor Yellow
Read-Host

# Step 7: Commit and push
Write-Host "[7/7] Commit and Push to GitHub" -ForegroundColor Yellow
Write-Host ""

$commit = Read-Host "Do you want to commit and push now? (Y/n)"
if ($commit -eq "" -or $commit -eq "Y" -or $commit -eq "y") {
    Write-Host "Adding files..." -ForegroundColor Cyan
    git add .github/workflows/deploy.yml
    git add vercel.json
    git add DEPLOYMENT_GUIDE.md
    
    Write-Host "Committing..." -ForegroundColor Cyan
    git commit -m "🚀 Add Vercel deployment workflow"
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push origin main
    
    Write-Host ""
    Write-Host "✅ Pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Setup Complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://github.com/[YOUR-USERNAME]/seasnacky/actions" -ForegroundColor White
    Write-Host "2. Watch the deployment workflow" -ForegroundColor White
    Write-Host "3. Wait for green checkmark ✅" -ForegroundColor White
    Write-Host "4. Visit your site: https://seasnacky.vercel.app" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "Skipped commit and push." -ForegroundColor Yellow
    Write-Host "Run manually:" -ForegroundColor Cyan
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m '🚀 Add Vercel deployment'" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "For detailed guide, read: DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
