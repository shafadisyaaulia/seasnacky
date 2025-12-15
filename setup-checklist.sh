#!/bin/bash

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Vercel CI/CD Setup Checklist${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function untuk check status
check_item() {
    echo -e "${YELLOW}☐${NC} $1"
}

checked_item() {
    echo -e "${GREEN}☑${NC} $1"
}

echo -e "${BLUE}📋 PRE-REQUISITES${NC}\n"
check_item "Node.js installed (v18+)"
check_item "Git installed"
check_item "GitHub account"
check_item "Vercel account"
echo ""

echo -e "${BLUE}🔧 SETUP STEPS${NC}\n"

echo -e "${YELLOW}1. Install Vercel CLI${NC}"
check_item "npm install -g vercel@latest"
echo ""

echo -e "${YELLOW}2. Login to Vercel${NC}"
check_item "vercel login"
check_item "Pilih akun yang benar"
echo ""

echo -e "${YELLOW}3. Link Project${NC}"
check_item "cd seasnacky"
check_item "vercel link"
check_item "Pilih/buat project 'seasnacky'"
echo ""

echo -e "${YELLOW}4. Get Credentials${NC}"
check_item "node setup-vercel.js"
check_item "Copy VERCEL_ORG_ID"
check_item "Copy VERCEL_PROJECT_ID"
check_item "Create token: https://vercel.com/account/tokens"
echo ""

echo -e "${YELLOW}5. Add GitHub Secrets${NC}"
echo -e "   URL: https://github.com/[username]/[repo]/settings/secrets/actions\n"
check_item "Add VERCEL_TOKEN"
check_item "Add VERCEL_ORG_ID"
check_item "Add VERCEL_PROJECT_ID"
echo ""

echo -e "${YELLOW}6. Set Vercel Environment Variables${NC}"
echo -e "   URL: https://vercel.com/dashboard → Project → Settings → Environment Variables\n"
check_item "MONGODB_URI (Production & Preview)"
check_item "JWT_SECRET (Production & Preview)"
check_item "CLOUDINARY_CLOUD_NAME (Production & Preview)"
check_item "CLOUDINARY_API_KEY (Production & Preview)"
check_item "CLOUDINARY_API_SECRET (Production & Preview)"
check_item "All other variables from .env.example"
echo ""

echo -e "${YELLOW}7. Verify Configuration${NC}"
check_item "Check .gitignore includes .vercel/"
check_item "Check .gitignore includes .env*"
check_item "Verify .github/workflows/deploy.yml exists"
check_item "Verify vercel.json exists"
echo ""

echo -e "${YELLOW}8. Test Deployment${NC}"
check_item "git add ."
check_item "git commit -m 'chore: setup ci/cd'"
check_item "git push origin main"
check_item "Check GitHub Actions: github.com/[user]/[repo]/actions"
check_item "Check Vercel Dashboard: vercel.com/dashboard"
echo ""

echo -e "${BLUE}✅ VERIFICATION${NC}\n"
check_item "Deployment sukses di GitHub Actions"
check_item "Deployment sukses di Vercel"
check_item "Site bisa diakses di Vercel URL"
check_item "Health check passing (optional)"
echo ""

echo -e "${BLUE}🎉 DONE!${NC}\n"
echo -e "${GREEN}Setelah semua checklist selesai:${NC}"
echo -e "  - Push ke 'main' = otomatis deploy production"
echo -e "  - Buat PR = otomatis deploy preview"
echo -e "  - Merge PR = otomatis deploy production"
echo -e ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo -e "  - VERCEL_QUICK_START.md (Quick reference)"
echo -e "  - VERCEL_DEPLOYMENT_GUIDE.md (Detailed guide)"
echo -e "  - CICD_README.md (CI/CD workflow)"
echo -e ""
echo -e "${BLUE}========================================${NC}\n"
