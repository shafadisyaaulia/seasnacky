# 🚀 Panduan Deployment Vercel dengan GitHub Actions

## ❌ Tidak Perlu Deploy Manual!
Dengan konfigurasi ini, Anda **TIDAK perlu deploy manual** ke Vercel. Semua deployment akan dilakukan otomatis oleh GitHub Actions setiap kali Anda push code ke branch `main` atau membuat Pull Request.

## 📋 Langkah-langkah Setup (Satu Kali Saja)

### 1. Install Vercel CLI Lokal (Untuk Setup Awal)

```bash
npm install -g vercel@latest
```

### 2. Login ke Vercel

```bash
vercel login
```

### 3. Link Project ke Vercel (Jalankan di folder seasnacky)

```bash
cd seasnacky
vercel link
```

Pilih:
- **Scope**: Pilih akun/organisasi Anda
- **Link to existing project?**: No (jika project baru) atau Yes (jika sudah ada)
- **Project name**: seasnacky (atau nama yang Anda inginkan)

### 4. Dapatkan Tokens dan IDs dari Vercel

Setelah `vercel link`, file `.vercel/project.json` akan dibuat. Jalankan:

```bash
# Untuk mendapatkan tokens
cat .vercel/project.json
```

Atau manual dari Vercel Dashboard:
- **VERCEL_TOKEN**: https://vercel.com/account/tokens (Create new token)
- **VERCEL_ORG_ID** dan **VERCEL_PROJECT_ID**: Ada di file `.vercel/project.json`

### 5. Set GitHub Secrets

Pergi ke GitHub repository Anda: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Tambahkan 3 secrets berikut:

| Secret Name | Nilai | Cara Mendapatkan |
|------------|-------|------------------|
| `VERCEL_TOKEN` | Token dari Vercel | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Organization ID | Dari `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Project ID | Dari `.vercel/project.json` |

**Tambahan untuk Environment Variables** (jika ada):
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- Dan semua environment variables lain yang dibutuhkan aplikasi

### 6. Set Environment Variables di Vercel Dashboard

Pergi ke: https://vercel.com/[your-username]/seasnacky/settings/environment-variables

Tambahkan semua environment variables yang dibutuhkan untuk:
- **Production**
- **Preview** 
- **Development**

## 🔄 Cara Kerja CI/CD Otomatis

### Deployment Production (Otomatis)

Ketika Anda **push ke branch `main`**:

```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

GitHub Actions akan:
1. ✅ Run tests & linting
2. 🐳 Build Docker image (optional)
3. 🚀 Deploy ke Vercel Production
4. 🏥 Health check deployment

### Deployment Preview (Otomatis)

Ketika Anda **membuat Pull Request**:

```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Lalu buat PR di GitHub
```

GitHub Actions akan:
1. ✅ Run tests & linting
2. 🔍 Deploy preview environment
3. 💬 Comment di PR dengan preview URL

## 📁 File yang Penting

```
seasnacky/
├── .github/
│   └── workflows/
│       └── deploy.yml         # ✅ Sudah ada
├── .vercel/
│   └── project.json          # Jangan commit ke git!
├── vercel.json               # ✅ Sudah ada
├── .gitignore                # Pastikan .vercel/ ada di sini
└── package.json              # ✅ Sudah ada
```

## 🔒 Keamanan: File yang TIDAK Boleh di-commit

Pastikan `.gitignore` berisi:

```
.vercel
.env
.env.local
.env.production.local
```

## 🎯 Workflow Deployment

### Scenario 1: Development Lokal
```bash
npm run dev  # Test di localhost:3000
```

### Scenario 2: Preview Deployment (via PR)
```bash
git checkout -b feature/my-feature
# ... kerjakan feature
git push origin feature/my-feature
# Buat PR → Otomatis deploy preview
```

### Scenario 3: Production Deployment
```bash
git checkout main
git pull origin main
# Merge PR atau push langsung
git push origin main
# Otomatis deploy ke production!
```

## 📊 Monitor Deployment

### Melihat Status di GitHub
- Pergi ke tab **Actions** di GitHub repository
- Lihat workflow runs dan status

### Melihat Deployment di Vercel
- Dashboard: https://vercel.com/dashboard
- Deployments: Lihat semua deployment history
- Logs: Debug jika ada masalah

## 🐛 Troubleshooting

### Build Failed di GitHub Actions

**Masalah**: Type errors atau linting errors

**Solusi**: Workflow sudah di-set dengan `continue-on-error: true` untuk linting, tapi jika ada error kritis:

```bash
# Test build lokal
npm run build

# Fix errors, lalu commit
git add .
git commit -m "fix: build errors"
git push
```

### Deployment Failed

**Masalah**: Environment variables missing

**Solusi**:
1. Check Vercel Dashboard → Settings → Environment Variables
2. Pastikan semua variables tersedia untuk Production/Preview
3. Redeploy dari Vercel Dashboard atau push ulang

### Health Check Failed

**Masalah**: `/api/health` endpoint tidak response 200

**Solusi**: Pastikan health endpoint working:

```bash
# Test lokal
curl http://localhost:3000/api/health
```

## 💡 Tips Best Practices

1. **Jangan deploy manual** - Biarkan GitHub Actions yang handle
2. **Selalu test lokal** sebelum push ke main
3. **Gunakan PR** untuk review code sebelum merge ke main
4. **Monitor logs** di Vercel Dashboard untuk error
5. **Set environment variables** dengan benar di Vercel
6. **Backup database** sebelum deploy perubahan besar

## 📝 Checklist Setup

- [ ] Vercel CLI installed
- [ ] `vercel link` executed
- [ ] GitHub Secrets added (3 secrets)
- [ ] Environment Variables set di Vercel Dashboard
- [ ] `.vercel/` added to `.gitignore`
- [ ] Push test commit ke main untuk trigger deployment
- [ ] Verify deployment success di Vercel

## 🎉 Selesai!

Setelah setup ini, Anda **tidak perlu deploy manual lagi**. Setiap push ke `main` = otomatis production deployment! ✨
