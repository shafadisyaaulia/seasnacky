# 🚀 Quick Start: Vercel Deployment

## TL;DR - Tidak Perlu Deploy Manual! ✨

Dengan GitHub Actions yang sudah dikonfigurasi, **TIDAK PERLU deploy manual**. Cukup push code → otomatis deploy!

## ⚡ Setup Sekali (5 Langkah)

### 1. Install & Link Vercel (Lokal)

```bash
# Install Vercel CLI
npm install -g vercel@latest

# Login ke Vercel
vercel login

# Link project (di folder seasnacky)
cd seasnacky
vercel link
```

### 2. Dapatkan Credentials

Setelah `vercel link`, jalankan helper script:

```bash
node setup-vercel.js
```

Script ini akan menampilkan:
- ✅ VERCEL_ORG_ID
- ✅ VERCEL_PROJECT_ID  
- ✅ Link untuk create VERCEL_TOKEN

### 3. Tambahkan GitHub Secrets

Pergi ke: `https://github.com/[username]/[repo]/settings/secrets/actions`

Tambahkan 3 secrets:
- `VERCEL_TOKEN` → Dari https://vercel.com/account/tokens
- `VERCEL_ORG_ID` → Dari output setup-vercel.js
- `VERCEL_PROJECT_ID` → Dari output setup-vercel.js

### 4. Set Environment Variables di Vercel

Pergi ke: `https://vercel.com/[username]/seasnacky/settings/environment-variables`

Copy dari `.env.example`, set untuk **Production** dan **Preview**:
- MONGODB_URI
- JWT_SECRET
- CLOUDINARY_*
- dll

### 5. Push untuk Deploy!

```bash
git add .
git commit -m "feat: ready for deployment"
git push origin main
```

## 🎯 Workflow Setelah Setup

### Development
```bash
npm run dev              # Lokal development
```

### Deploy Production
```bash
git push origin main     # Auto deploy ke production!
```

### Deploy Preview
```bash
git checkout -b feature/new
git push origin feature/new
# Buat PR → Auto deploy preview!
```

## 📊 Monitor

- **GitHub Actions**: `https://github.com/[username]/[repo]/actions`
- **Vercel Dashboard**: `https://vercel.com/dashboard`

## 💡 Ingat!

✅ **Otomatis**: Push main = production deploy  
✅ **Otomatis**: Buat PR = preview deploy  
❌ **Tidak perlu**: Manual deploy via Vercel CLI/Dashboard  
✅ **Aman**: All secrets via GitHub Secrets & Vercel env vars  

## ❓ Troubleshooting

**Build fail?**
```bash
npm run build  # Test lokal dulu
```

**Environment variables missing?**
- Check Vercel Dashboard → Settings → Environment Variables

**Need help?**
- Baca: `VERCEL_DEPLOYMENT_GUIDE.md` untuk detail lengkap

---

📚 **Full Guide**: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
