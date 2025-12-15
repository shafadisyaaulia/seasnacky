[![Deploy to Vercel](https://github.com/[username]/[repo]/actions/workflows/deploy.yml/badge.svg)](https://github.com/[username]/[repo]/actions/workflows/deploy.yml)

# 🚀 CI/CD dengan GitHub Actions & Vercel

Repository ini sudah dikonfigurasi dengan **CI/CD otomatis** menggunakan GitHub Actions untuk deployment ke Vercel.

## ⚡ Quick Start

### Untuk Pertama Kali (Setup)

1. **Clone & Install**
   ```bash
   git clone [repo-url]
   cd seasnacky
   npm install
   ```

2. **Setup Vercel** (Sekali saja)
   ```bash
   # Install Vercel CLI
   npm install -g vercel@latest
   
   # Login & Link
   vercel login
   vercel link
   
   # Dapatkan credentials
   node setup-vercel.js
   ```

3. **Tambahkan GitHub Secrets**
   
   Pergi ke: `Settings` → `Secrets and variables` → `Actions`
   
   Tambahkan:
   - `VERCEL_TOKEN` (dari https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` (dari output setup-vercel.js)
   - `VERCEL_PROJECT_ID` (dari output setup-vercel.js)

4. **Set Environment Variables di Vercel**
   
   Pergi ke Vercel Dashboard → Project Settings → Environment Variables
   
   Tambahkan semua variables dari `.env.example`

5. **Push untuk Deploy!**
   ```bash
   git push origin main
   ```

### Setelah Setup ✅

**Tidak perlu deploy manual lagi!** Setiap:

- 🟢 **Push ke `main`** → Otomatis deploy ke **Production**
- 🔵 **Buat Pull Request** → Otomatis deploy **Preview**
- ✅ **Merge PR** → Otomatis deploy ke **Production**

## 📋 Workflow CI/CD

### Production Deployment
```bash
# Workflow: main branch → production
git checkout main
git pull
# ... kerjakan changes
git add .
git commit -m "feat: new feature"
git push origin main
# ✨ Otomatis deploy ke production!
```

### Preview Deployment (Recommended)
```bash
# Workflow: feature branch → preview → review → merge → production
git checkout -b feature/awesome-feature
# ... kerjakan feature
git add .
git commit -m "feat: awesome feature"
git push origin feature/awesome-feature
# Buat Pull Request di GitHub
# ✨ Otomatis deploy preview!
# Review → Approve → Merge
# ✨ Otomatis deploy ke production!
```

## 🔄 Pipeline Stages

Setiap deployment melewati stages berikut:

1. **Test & Lint** - Run ESLint & TypeScript check
2. **Build Docker** - Build Docker image (optional)
3. **Deploy** - Deploy to Vercel
4. **Health Check** - Verify deployment

## 📊 Monitoring

### GitHub Actions
- URL: `https://github.com/[username]/[repo]/actions`
- Status: Lihat badge di atas
- Logs: Click pada workflow run untuk detail

### Vercel Dashboard  
- URL: `https://vercel.com/dashboard`
- Deployments: History semua deployment
- Logs: Runtime & build logs
- Analytics: Performance metrics

## 🛠️ Development

### Lokal Development
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env dengan values yang benar

# Run development server
npm run dev
```

Access: http://localhost:3000

### Build Test
```bash
# Test production build lokal
npm run build

# Run production build
npm start
```

## 📂 Files Penting

```
seasnacky/
├── .github/
│   └── workflows/
│       └── deploy.yml              # ✅ GitHub Actions workflow
├── .vercel/
│   └── project.json               # ⚠️ Jangan commit! (sudah di .gitignore)
├── vercel.json                    # ✅ Vercel configuration
├── .env.example                   # ✅ Template environment variables
├── setup-vercel.js                # 🔧 Setup helper script
├── VERCEL_DEPLOYMENT_GUIDE.md     # 📚 Panduan lengkap
└── VERCEL_QUICK_START.md          # ⚡ Quick reference
```

## 🔐 Security Best Practices

✅ **DO:**
- Store secrets di GitHub Secrets
- Store env vars di Vercel Dashboard
- Keep `.vercel/` in `.gitignore`
- Never commit `.env` files
- Review environment variables regularly

❌ **DON'T:**
- Commit secrets to repository
- Share VERCEL_TOKEN publicly
- Hardcode API keys in code
- Push `.env` or `.vercel/` to git

## 🐛 Troubleshooting

### Build Failed
```bash
# Test build lokal
npm run build

# Check errors dan fix
# Push lagi untuk re-trigger deployment
```

### Environment Variables Missing
1. Check Vercel Dashboard → Settings → Environment Variables
2. Pastikan variables tersedia untuk Production/Preview
3. Redeploy dari Vercel atau push ulang

### Deployment Timeout
- Check Vercel logs untuk bottleneck
- Optimize build process
- Check database connection

### Health Check Failed
```bash
# Test health endpoint lokal
curl http://localhost:3000/api/health

# Atau dari deployed URL
curl https://seasnacky.vercel.app/api/health
```

## 📖 Documentation

- 📚 **Full Guide**: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
- ⚡ **Quick Start**: [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md)
- 🚀 **Quick Deploy**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

## 💡 Tips

1. **Selalu test lokal** dengan `npm run build` sebelum push
2. **Gunakan feature branches** untuk development
3. **Review PR** sebelum merge ke main
4. **Monitor deployment** di GitHub Actions & Vercel
5. **Keep dependencies updated** untuk security

## 📞 Support

- **GitHub Issues**: Report bugs atau request features
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Actions Docs**: https://docs.github.com/actions

---

**Status**: ![Deployment Status](https://img.shields.io/badge/deployment-automated-success)
**Platform**: ![Vercel](https://img.shields.io/badge/vercel-deployed-black)
**CI/CD**: ![GitHub Actions](https://img.shields.io/badge/github%20actions-enabled-blue)
