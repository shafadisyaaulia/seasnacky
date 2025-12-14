# 🚀 Quick Deployment Reference

## ⚡ TL;DR - Langkah Cepat ke Centang Hijau ✅

### 1️⃣ Setup Vercel (5 menit)
```bash
# Run automated setup script
powershell -ExecutionPolicy Bypass -File setup-deployment.ps1
```

### 2️⃣ Tambah GitHub Secrets (2 menit)
Buka: `https://github.com/[USERNAME]/seasnacky/settings/secrets/actions`

Tambahkan 3 secrets:
- `VERCEL_TOKEN` → dari https://vercel.com/account/tokens
- `VERCEL_ORG_ID` → dari `.vercel/project.json`
- `VERCEL_PROJECT_ID` → dari `.vercel/project.json`

### 3️⃣ Push ke GitHub (1 menit)
```bash
git add .
git commit -m "🚀 Deploy to Vercel"
git push origin main
```

### 4️⃣ Done! 🎉
- GitHub Actions: `https://github.com/[USERNAME]/seasnacky/actions`
- Lihat workflow running → tunggu centang hijau ✅
- Site live: `https://seasnacky.vercel.app`

**Total waktu: ~8 menit**

---

## 📋 Checklist Singkat

### Pre-deployment:
- [ ] Node.js 20+ installed
- [ ] GitHub account
- [ ] Vercel account (free tier OK)
- [ ] Repository created

### Setup:
- [ ] `npm install -g vercel`
- [ ] `vercel login`
- [ ] `vercel` (initialize project)
- [ ] Get ORG_ID & PROJECT_ID
- [ ] Generate Vercel token

### GitHub:
- [ ] Add 3 secrets (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
- [ ] Commit `.github/workflows/deploy.yml`
- [ ] Push to main branch

### Verify:
- [ ] GitHub Actions running
- [ ] All jobs green ✅
- [ ] Site accessible

---

## 🎯 Common Commands

```bash
# Manual deployment
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs https://seasnacky.vercel.app

# Pull environment
vercel env pull

# Check who's logged in
vercel whoami
```

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| GitHub Actions | `https://github.com/[USER]/seasnacky/actions` |
| Vercel Dashboard | `https://vercel.com/[user]/seasnacky` |
| Vercel Tokens | `https://vercel.com/account/tokens` |
| Production Site | `https://seasnacky.vercel.app` |
| Deployment Guide | `DEPLOYMENT_GUIDE.md` |

---

## 🐛 Quick Fixes

### Build Failed?
```bash
# Test locally first
npm run build
npm start
```

### Token Invalid?
```bash
# Generate new token
# Update GitHub secret: VERCEL_TOKEN
```

### Environment Variables Missing?
```bash
# Add in Vercel Dashboard → Settings → Environment Variables
# Redeploy: vercel --prod
```

---

## 📊 Workflow Jobs

1. ✅ **Test & Lint** (~1 min)
2. ✅ **Build Docker** (~2 min)
3. ✅ **Deploy Production** (~3 min)
4. ✅ **Health Check** (~30 sec)

**Total: ~6-7 minutes**

---

## 🎓 Full Documentation

Untuk panduan lengkap dengan screenshots dan troubleshooting detail, baca:
**[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

---

**Happy Deploying! 🚀**
