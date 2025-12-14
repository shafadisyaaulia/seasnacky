# 🚀 Panduan Deploy ke Vercel dengan GitHub Actions

## 📋 Daftar Isi
1. [Persiapan Awal](#persiapan-awal)
2. [Setup Vercel Project](#setup-vercel-project)
3. [Konfigurasi GitHub Secrets](#konfigurasi-github-secrets)
4. [Push ke GitHub](#push-ke-github)
5. [Monitoring Deployment](#monitoring-deployment)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Persiapan Awal

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```
Pilih method login (GitHub, GitLab, Email, dll)

### 3. Verify Login
```bash
vercel whoami
```

---

## 🏗️ Setup Vercel Project

### Step 1: Initialize Vercel Project
```bash
cd "d:\Semester 5\POPL\UAS\seasnacky"
vercel
```

**Jawab pertanyaan berikut:**
```
? Set up and deploy "~/seasnacky"? [Y/n] Y
? Which scope do you want to deploy to? [Your Account]
? Link to existing project? [y/N] N
? What's your project's name? seasnacky
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

### Step 2: Get Vercel Project Info
```bash
# Get Organization ID
vercel team ls

# Get Project ID (dari .vercel/project.json)
cat .vercel/project.json
```

**Output akan seperti:**
```json
{
  "orgId": "team_xxxxxxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxx"
}
```

**SIMPAN** `orgId` dan `projectId` ini!

### Step 3: Generate Vercel Token
1. Buka https://vercel.com/account/tokens
2. Klik **"Create Token"**
3. Nama: `GitHub Actions - SeaSnacky`
4. Scope: `Full Account`
5. Expiration: `No Expiration` (atau sesuai kebutuhan)
6. Klik **"Create"**
7. **COPY** token yang muncul (hanya muncul sekali!)

---

## 🔐 Konfigurasi GitHub Secrets

### Step 1: Buka GitHub Repository Settings
```
https://github.com/[USERNAME]/seasnacky/settings/secrets/actions
```

### Step 2: Tambahkan 3 Secrets

#### Secret 1: VERCEL_TOKEN
- Klik **"New repository secret"**
- Name: `VERCEL_TOKEN`
- Value: [Token yang di-copy dari Vercel]
- Klik **"Add secret"**

#### Secret 2: VERCEL_ORG_ID
- Klik **"New repository secret"**
- Name: `VERCEL_ORG_ID`
- Value: [orgId dari .vercel/project.json]
- Klik **"Add secret"**

#### Secret 3: VERCEL_PROJECT_ID
- Klik **"New repository secret"**
- Name: `VERCEL_PROJECT_ID`
- Value: [projectId dari .vercel/project.json]
- Klik **"Add secret"**

### ✅ Verifikasi Secrets
Pastikan di halaman Secrets sudah ada 3 secrets:
- ✅ VERCEL_TOKEN
- ✅ VERCEL_ORG_ID
- ✅ VERCEL_PROJECT_ID

---

## 📦 Konfigurasi Environment Variables

### Step 1: Tambahkan Environment Variables di Vercel Dashboard
1. Buka https://vercel.com/[username]/seasnacky/settings/environment-variables

2. Tambahkan variable berikut (satu per satu):

#### Database
```
MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/seasnacky
DATABASE_URL = mongodb+srv://user:pass@cluster.mongodb.net/seasnacky
```

#### Security
```
JWT_SECRET = change-me-super-secret-key-production
```

#### Cloudinary
```
CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
CLOUDINARY_UPLOAD_FOLDER = seasnacky

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = seasnacky
```

#### App Config
```
NODE_ENV = production
NEXT_PUBLIC_API_URL = https://seasnacky.vercel.app
```

3. Pilih Environment: **Production**, **Preview**, dan **Development** (centang semua)

---

## 🚀 Push ke GitHub

### Step 1: Commit Workflow File
```bash
cd "d:\Semester 5\POPL\UAS\seasnacky"

git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow for Vercel deployment"
```

### Step 2: Push ke Repository
```bash
git push origin main
```

### Step 3: Monitor GitHub Actions
1. Buka: `https://github.com/[USERNAME]/seasnacky/actions`
2. Lihat workflow **"Deploy to Vercel"** running
3. Klik workflow untuk melihat detail

---

## 📊 Monitoring Deployment

### GitHub Actions Dashboard

**5 Jobs akan berjalan:**

```
1. ✅ Test & Lint (1-2 menit)
   - Checkout code
   - Install dependencies
   - Run linter
   - Type checking

2. ✅ Build Docker Image (2-3 menit)
   - Build Docker image
   - Test image

3. ✅ Deploy to Vercel (Production) (3-5 menit)
   - Build project
   - Deploy to production
   - Get deployment URL

4. ⏭️ Deploy to Vercel (Preview) (hanya untuk Pull Request)
   - Build project
   - Deploy preview

5. ✅ Production Health Check (30 detik)
   - Wait for deployment
   - Check /api/health endpoint
```

### Timeline Normal:
```
00:00 - Workflow triggered
00:30 - Test & Lint completed ✅
02:00 - Docker build completed ✅
05:00 - Vercel deployment completed ✅
05:30 - Health check passed ✅

Total: ~5-6 menit
```

---

## ✅ Centang Hijau (Success Checklist)

### Setelah Push, Cek:

#### 1. GitHub Actions Tab
```
https://github.com/[USERNAME]/seasnacky/actions
```
**Harus ada:**
- ✅ Centang hijau di samping commit
- ✅ All jobs completed successfully

#### 2. Vercel Dashboard
```
https://vercel.com/[username]/seasnacky
```
**Harus ada:**
- ✅ Status: Ready
- ✅ Latest deployment: Success
- ✅ Visit button (klik untuk buka site)

#### 3. Production Site
```
https://seasnacky.vercel.app
```
**Harus bisa:**
- ✅ Site loading
- ✅ Homepage tampil
- ✅ Login berfungsi

#### 4. Commit Badge di GitHub
Di halaman repository, commit terbaru harus ada:
- ✅ Centang hijau ✓
- Bukan X merah atau ⭕ pending

---

## 🎯 Step-by-Step Checklist untuk Centang Hijau

### Checklist Lengkap:

- [ ] **1. Vercel CLI Installed**
  ```bash
  vercel --version
  ```

- [ ] **2. Vercel Login**
  ```bash
  vercel whoami
  ```

- [ ] **3. Project Initialized**
  ```bash
  ls .vercel/project.json
  ```

- [ ] **4. GitHub Secrets Added (3 secrets)**
  - [ ] VERCEL_TOKEN
  - [ ] VERCEL_ORG_ID
  - [ ] VERCEL_PROJECT_ID

- [ ] **5. Vercel Environment Variables Set**
  - [ ] Database URLs
  - [ ] JWT Secret
  - [ ] Cloudinary credentials
  - [ ] All selected for Production/Preview/Development

- [ ] **6. Workflow File Created**
  ```bash
  ls .github/workflows/deploy.yml
  ```

- [ ] **7. Code Committed & Pushed**
  ```bash
  git push origin main
  ```

- [ ] **8. GitHub Actions Running**
  - [ ] Test & Lint: ✅
  - [ ] Build Docker: ✅
  - [ ] Deploy Production: ✅
  - [ ] Health Check: ✅

- [ ] **9. Vercel Deployment Success**
  - [ ] Status: Ready
  - [ ] Domain accessible

- [ ] **10. Site is Live**
  - [ ] Homepage loads
  - [ ] API endpoints work
  - [ ] Database connected

---

## 🐛 Troubleshooting

### Problem 1: "VERCEL_TOKEN not found"
**Error:**
```
Error: No value for secret VERCEL_TOKEN
```

**Solution:**
1. Cek di GitHub Settings → Secrets → Actions
2. Pastikan `VERCEL_TOKEN` ada
3. Copy token baru dari https://vercel.com/account/tokens
4. Update secret di GitHub

---

### Problem 2: "Failed to deploy - missing environment variables"
**Error:**
```
Build failed: MongooseError: The `uri` parameter to `openUri()` must be a string
```

**Solution:**
1. Buka Vercel Dashboard → Project Settings → Environment Variables
2. Pastikan semua variable ada (especially `MONGODB_URI`)
3. Redeploy: `vercel --prod`

---

### Problem 3: "Docker build failed"
**Error:**
```
ERROR: failed to solve: process "/bin/sh -c npm ci" did not complete successfully
```

**Solution:**
```bash
# Update Dockerfile
# Tambahkan --legacy-peer-deps jika ada conflict
RUN npm ci --legacy-peer-deps --only=production
```

---

### Problem 4: Health Check Failed
**Error:**
```
❌ Health check failed! Status: 500
```

**Solution:**
1. Check Vercel logs:
   ```bash
   vercel logs https://seasnacky.vercel.app
   ```

2. Common issues:
   - Database connection string wrong
   - Environment variables not set
   - JWT secret missing

3. Test locally first:
   ```bash
   npm run build
   npm start
   ```

---

### Problem 5: Build Timeout
**Error:**
```
Error: Command "npm run build" exceeded timeout of 300 seconds
```

**Solution:**
1. Optimize build (remove large dependencies)
2. Or upgrade Vercel plan for longer build time
3. Use Docker pre-built image (advanced)

---

## 🔄 Manual Deployment (Backup)

Jika GitHub Actions gagal, deploy manual:

```bash
# 1. Pull environment info
vercel pull --environment=production --yes

# 2. Build locally
vercel build --prod

# 3. Deploy pre-built
vercel deploy --prebuilt --prod
```

---

## 📝 GitHub Actions Workflow Explanation

### Workflow Structure:
```yaml
Trigger: Push to main/master OR Pull Request
  ↓
Jobs (parallel):
  ├─ Test & Lint (always run)
  ├─ Build Docker (after test)
  └─ Deploy (after test & docker)
      ├─ Production (if push to main)
      ├─ Preview (if pull request)
      └─ Health Check (after production)
```

### Environment Variables:
- `VERCEL_ORG_ID`: Organization/Team ID dari Vercel
- `VERCEL_PROJECT_ID`: Project ID dari Vercel
- `VERCEL_TOKEN`: Access token untuk deploy

### Vercel Commands:
```bash
vercel pull      # Download project settings
vercel build     # Build project locally
vercel deploy    # Deploy to Vercel
```

---

## 🎨 Custom Domain (Optional)

### Setup Custom Domain:
1. Buka Vercel Dashboard → Settings → Domains
2. Add domain: `seasnacky.com`
3. Update DNS di domain registrar:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (~10 minutes)

---

## 📊 Monitoring & Analytics

### Vercel Analytics
1. Enable di: https://vercel.com/[username]/seasnacky/analytics
2. Free tier includes:
   - Page views
   - Unique visitors
   - Top pages
   - Devices & browsers

### GitHub Actions Badge
Tambahkan badge di README.md:
```markdown
[![Deploy to Vercel](https://github.com/[USERNAME]/seasnacky/actions/workflows/deploy.yml/badge.svg)](https://github.com/[USERNAME]/seasnacky/actions/workflows/deploy.yml)
```

---

## 🎉 Success! What's Next?

Setelah centang hijau muncul:

1. ✅ **Test Production Site**
   - Buka https://seasnacky.vercel.app
   - Test semua fitur (login, products, cart, checkout)

2. ✅ **Setup Monitoring**
   - Enable Vercel Analytics
   - Setup error tracking (Sentry, LogRocket)

3. ✅ **Configure Alerts**
   - GitHub notifications
   - Vercel deployment notifications

4. ✅ **Document Deployment**
   - Update README with production URL
   - Add deployment badge

5. ✅ **Continuous Deployment Ready!**
   - Setiap push ke main = auto deploy
   - Pull request = preview deployment

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Actions Docs**: https://docs.github.com/actions
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Happy Deploying! 🚀**
