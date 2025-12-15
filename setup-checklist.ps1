# Vercel CI/CD Setup Checklist (PowerShell)

Write-Host "`n========================================" -ForegroundColor Blue
Write-Host "   Vercel CI/CD Setup Checklist" -ForegroundColor Blue
Write-Host "========================================`n" -ForegroundColor Blue

function Check-Item {
    param([string]$text)
    Write-Host "☐ $text" -ForegroundColor Yellow
}

function Checked-Item {
    param([string]$text)
    Write-Host "☑ $text" -ForegroundColor Green
}

Write-Host "📋 PRE-REQUISITES`n" -ForegroundColor Blue
Check-Item "Node.js installed (v18+)"
Check-Item "Git installed"
Check-Item "GitHub account"
Check-Item "Vercel account"
Write-Host ""

Write-Host "🔧 SETUP STEPS`n" -ForegroundColor Blue

Write-Host "1. Install Vercel CLI" -ForegroundColor Yellow
Check-Item "npm install -g vercel@latest"
Write-Host ""

Write-Host "2. Login to Vercel" -ForegroundColor Yellow
Check-Item "vercel login"
Check-Item "Pilih akun yang benar"
Write-Host ""

Write-Host "3. Link Project" -ForegroundColor Yellow
Check-Item "cd seasnacky"
Check-Item "vercel link"
Check-Item "Pilih/buat project 'seasnacky'"
Write-Host ""

Write-Host "4. Get Credentials" -ForegroundColor Yellow
Check-Item "node setup-vercel.js"
Check-Item "Copy VERCEL_ORG_ID"
Check-Item "Copy VERCEL_PROJECT_ID"
Check-Item "Create token: https://vercel.com/account/tokens"
Write-Host ""

Write-Host "5. Add GitHub Secrets" -ForegroundColor Yellow
Write-Host "   URL: https://github.com/[username]/[repo]/settings/secrets/actions`n"
Check-Item "Add VERCEL_TOKEN"
Check-Item "Add VERCEL_ORG_ID"
Check-Item "Add VERCEL_PROJECT_ID"
Write-Host ""

Write-Host "6. Set Vercel Environment Variables" -ForegroundColor Yellow
Write-Host "   URL: https://vercel.com/dashboard → Project → Settings → Environment Variables`n"
Check-Item "MONGODB_URI (Production & Preview)"
Check-Item "JWT_SECRET (Production & Preview)"
Check-Item "CLOUDINARY_CLOUD_NAME (Production & Preview)"
Check-Item "CLOUDINARY_API_KEY (Production & Preview)"
Check-Item "CLOUDINARY_API_SECRET (Production & Preview)"
Check-Item "All other variables from .env.example"
Write-Host ""

Write-Host "7. Verify Configuration" -ForegroundColor Yellow
Check-Item "Check .gitignore includes .vercel/"
Check-Item "Check .gitignore includes .env*"
Check-Item "Verify .github/workflows/deploy.yml exists"
Check-Item "Verify vercel.json exists"
Write-Host ""

Write-Host "8. Test Deployment" -ForegroundColor Yellow
Check-Item "git add ."
Check-Item "git commit -m 'chore: setup ci/cd'"
Check-Item "git push origin main"
Check-Item "Check GitHub Actions: github.com/[user]/[repo]/actions"
Check-Item "Check Vercel Dashboard: vercel.com/dashboard"
Write-Host ""

Write-Host "✅ VERIFICATION`n" -ForegroundColor Blue
Check-Item "Deployment sukses di GitHub Actions"
Check-Item "Deployment sukses di Vercel"
Check-Item "Site bisa diakses di Vercel URL"
Check-Item "Health check passing (optional)"
Write-Host ""

Write-Host "🎉 DONE!`n" -ForegroundColor Blue
Write-Host "Setelah semua checklist selesai:" -ForegroundColor Green
Write-Host "  - Push ke 'main' = otomatis deploy production"
Write-Host "  - Buat PR = otomatis deploy preview"
Write-Host "  - Merge PR = otomatis deploy production"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "  - VERCEL_QUICK_START.md (Quick reference)"
Write-Host "  - VERCEL_DEPLOYMENT_GUIDE.md (Detailed guide)"
Write-Host "  - CICD_README.md (CI/CD workflow)"
Write-Host ""
Write-Host "========================================`n" -ForegroundColor Blue
