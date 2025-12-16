# 🛒 SeaSnacky — Marketplace untuk Produk Snack Lokal

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://seasnacky.vercel.app)

**Production URL:** [https://seasnacky.vercel.app](https://seasnacky.vercel.app)

---

## 👥 Tim Pengembang

- **Shafa Disya Aulia** (2308107010002)
- **Akrimah Usri** (2308107010009)

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [Monitoring & Logging](#-monitoring--logging)
- [Dokumentasi](#-dokumentasi)
- [Scripts](#-scripts)
- [Struktur Proyek](#-struktur-proyek)
- [Contributing](#-contributing)

---

## 🎯 Tentang Proyek

SeaSnacky adalah platform marketplace yang memungkinkan penjual produk snack lokal untuk membuka toko online dan pembeli untuk menemukan berbagai produk snack dengan mudah. Platform ini dilengkapi dengan sistem autentikasi, manajemen toko, keranjang belanja, checkout, review produk, resep, dan tips kuliner.

### Status Proyek
✅ **Production Ready** — Aplikasi telah di-deploy dan berjalan di Vercel  
✅ **CI/CD Configured** — GitHub Actions untuk automated deployment  
✅ **Monitoring Ready** — Logging system dengan Grafana + Loki

---

## ✨ Fitur Utama

### 🛍️ Untuk Pembeli (Buyer)
- ✅ Browse produk dengan filter kategori
- ✅ Keranjang belanja dengan perhitungan otomatis
- ✅ Checkout & pembayaran
- ✅ Review & rating produk
- ✅ Wishlist
- ✅ Akses resep dan tips kuliner
- ✅ Notifikasi real-time

### 🏪 Untuk Penjual (Seller)
- ✅ Buka toko sendiri (perlu approval admin)
- ✅ Kelola produk (CRUD)
- ✅ Kelola pesanan
- ✅ Upload resep dan konten edukasi
- ✅ Dashboard penjualan

### 👨‍💼 Untuk Admin
- ✅ Approve/reject pendaftaran toko
- ✅ Kelola semua produk
- ✅ Kelola users
- ✅ System logs & monitoring
- ✅ Manajemen konten

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.1.6 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components + React Icons
- **State Management:** React Context API
- **Notifications:** React Hot Toast + Custom Notification System

### Backend
- **Runtime:** Node.js 20+
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Token)
- **Session:** HTTP-only cookies
- **File Upload:** Cloudinary
- **Logging:** Winston + MongoDB Transport

### DevOps & Monitoring
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions
- **Monitoring:** Grafana + Loki
- **Containerization:** Docker
- **Version Control:** Git & GitHub

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ ([Download](https://nodejs.org/))
- MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas))
- Cloudinary account untuk upload gambar ([Sign up](https://cloudinary.com/))

### 1. Clone Repository
```bash
git clone https://github.com/shafadisyaaulia/seasnacky.git
cd seasnacky
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env.local` dengan template dari `.env.example`:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (generate dengan: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Seed Database (Optional)
```bash
# Seed regions
node scripts/seed-regions.js

# Seed mock data (products, users, etc.)
node scripts/seed-mongo.js

# Seed tips kuliner
node scripts/seed-tips.js
```

### 5. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 6. Build for Production (Local)
```bash
npm run build
npm run start
```

---

## 🌐 Deployment

### Auto Deployment dengan GitHub Actions
Setiap push ke branch `main` akan otomatis trigger deployment ke Vercel.

**Panduan lengkap:** Lihat [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)

**Quick Summary:**
1. Setup Vercel CLI dan link project
2. Tambahkan GitHub Secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`)
3. Set environment variables di Vercel Dashboard
4. Push code → otomatis deploy! ✨

**Status Deployment:** ✅ Lihat [DEPLOYMENT_SUCCESS.md](DEPLOYMENT_SUCCESS.md)

---

## 📊 Monitoring & Logging

### Grafana + Loki Stack
Project ini dilengkapi dengan monitoring system menggunakan Grafana dan Loki untuk real-time logging dan debugging.

**Cara Menjalankan:**
```bash
# Jalankan Docker Desktop terlebih dahulu
cd grafana-loki
docker-compose up -d
```

**Akses Dashboard:**
- **Grafana:** [http://localhost:3001](http://localhost:3001)
- **Aplikasi:** [http://localhost:3000](http://localhost:3000)
- **Loki API:** [http://localhost:3100](http://localhost:3100)

**Fitur Monitoring:**
- ✅ Real-time log streaming
- ✅ Filter by level (info/warning/error)
- ✅ Search & query logs
- ✅ Performance metrics
- ✅ Error tracking & debugging

**Panduan lengkap:** Lihat [LOGGING_GUIDE.md](LOGGING_GUIDE.md) dan [LOGGING_IMPLEMENTATION.md](LOGGING_IMPLEMENTATION.md)

---

## 📚 Dokumentasi

### Deployment & DevOps
- **[VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)** — Panduan lengkap deployment ke Vercel dengan GitHub Actions
- **[DEPLOYMENT_SUCCESS.md](DEPLOYMENT_SUCCESS.md)** — Status dan summary deployment yang berhasil

### Logging & Debugging
- **[LOGGING_GUIDE.md](LOGGING_GUIDE.md)** — Panduan menggunakan Grafana + Loki untuk monitoring
- **[LOGGING_IMPLEMENTATION.md](LOGGING_IMPLEMENTATION.md)** — Detail implementasi logging system
- **[DEBUGGING_CASES_DEMO.md](DEBUGGING_CASES_DEMO.md)** — 3 contoh kasus debugging praktis untuk demo

### Fitur & Implementasi
- **[REVIEW_SYSTEM_DOCS.md](REVIEW_SYSTEM_DOCS.md)** — Dokumentasi sistem review & rating produk
- **[NOTIFICATION_UX_STATUS.md](NOTIFICATION_UX_STATUS.md)** — Status implementasi sistem notifikasi custom
- **[RECIPE_AUTHOR_UPDATE.md](RECIPE_AUTHOR_UPDATE.md)** — Update fitur "Resep Saya" dengan filter by author
- **[UNIT_FIX_DOCUMENTATION.md](UNIT_FIX_DOCUMENTATION.md)** — Dokumentasi fix unit produk

### Kolaborasi Tim
- **[TEAM_COLLABORATION.md](TEAM_COLLABORATION.md)** — Pembagian tugas dan area tanggung jawab tim

---

## 📜 Scripts

```bash
# Development
npm run dev              # Jalankan development server (port 3000)
npm run build           # Build untuk production
npm run start           # Jalankan production server
npm run lint            # Run ESLint untuk code quality check

# Database Management
node scripts/seed-mongo.js              # Seed semua data (users, products, shops)
node scripts/seed-regions.js            # Seed data wilayah Indonesia
node scripts/seed-tips.js               # Seed tips kuliner
node scripts/create-admin.js            # Buat user admin baru

# Product Management
node scripts/update-product-unit.js     # Update unit produk (kg, pcs, dll)

# Database Maintenance
node scripts/cleanup-mongodb.js         # Cleanup & reset database

# Migrations
node scripts/migrations/20251212_add_shopId_to_users.js    # Migration: Add shopId field
node scripts/migrations/add-authorId-to-recipes.js         # Migration: Add authorId to recipes

# Docker & Monitoring
cd grafana-loki
docker-compose up -d    # Start Grafana + Loki monitoring stack
docker-compose down     # Stop monitoring stack
docker-compose logs -f  # View logs
```

---

## 📁 Struktur Proyek

```
seasnacky/
├── .github/
│   └── workflows/             # GitHub Actions CI/CD
├── grafana-loki/             # Monitoring Infrastructure
│   ├── docker-compose.yaml   # Docker setup untuk Grafana + Loki
│   ├── loki/                 # Loki configuration
│   └── promtail/             # Promtail configuration
├── public/                   # Static assets (images, icons)
├── scripts/                  # Utility & migration scripts
│   ├── migrations/           # Database migration scripts
│   ├── seed-*.js            # Database seeding scripts
│   └── *.js                 # Utility scripts
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Auth pages (login, register)
│   │   ├── (user)/          # User-specific pages
│   │   ├── api/             # API routes (RESTful endpoints)
│   │   ├── cart/            # Shopping cart pages
│   │   ├── checkout/        # Checkout flow
│   │   ├── dashboard/       # Dashboard (Admin & Seller)
│   │   │   ├── admin/       # Admin dashboard
│   │   │   └── seller/      # Seller dashboard
│   │   ├── products/        # Product pages
│   │   ├── recipes/         # Recipe pages
│   │   ├── store/           # Store pages
│   │   ├── tips/            # Tips kuliner pages
│   │   ├── wishlist/        # Wishlist pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Landing page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── admin/          # Admin-specific components
│   │   ├── seller/         # Seller-specific components
│   │   ├── features/       # Feature components
│   │   ├── layout/         # Layout components (Header, Footer, Sidebar)
│   │   └── ui/             # Reusable UI components
│   ├── context/            # React Context providers
│   │   ├── CartContext.tsx      # Cart state management
│   │   └── NotificationContext.tsx  # Notification system
│   ├── lib/                # Utility libraries
│   │   ├── auth.ts         # Authentication helpers
│   │   ├── mongodb.ts      # MongoDB connection
│   │   ├── logger.ts       # Winston logger setup
│   │   ├── session.ts      # Session management
│   │   ├── cloudinary.ts   # Cloudinary integration
│   │   └── utils.ts        # Utility functions
│   ├── models/             # MongoDB models (Mongoose schemas)
│   │   ├── User.ts         # User model
│   │   ├── Shop.ts         # Shop model
│   │   ├── Product.ts      # Product model
│   │   ├── Order.ts        # Order model
│   │   ├── Review.ts       # Review model
│   │   ├── Recipe.ts       # Recipe model
│   │   ├── Tip.ts          # Tip model
│   │   └── Log.ts          # Log model
│   └── middleware.ts       # Next.js middleware (auth, etc.)
├── .env.example            # Environment variables template
├── .dockerignore           # Docker ignore file
├── .gitignore              # Git ignore file
├── dockerfile              # Docker configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment config
└── README.md               # This file

Documentation Files:
├── DEPLOYMENT_SUCCESS.md          # Deployment status & summary
├── VERCEL_DEPLOYMENT_GUIDE.md     # Deployment guide
├── LOGGING_GUIDE.md               # Logging & monitoring guide
├── LOGGING_IMPLEMENTATION.md      # Logging implementation details
├── DEBUGGING_CASES_DEMO.md        # Debugging examples
├── REVIEW_SYSTEM_DOCS.md          # Review system documentation
├── NOTIFICATION_UX_STATUS.md      # Notification system status
├── RECIPE_AUTHOR_UPDATE.md        # Recipe feature update
├── UNIT_FIX_DOCUMENTATION.md      # Product unit fix docs
└── TEAM_COLLABORATION.md          # Team collaboration guide
```

---

##  Notes

### API Routes
Aplikasi ini menggunakan Next.js API Routes di `/src/app/api/*`:
- `GET/POST /api/products` — Kelola produk
- `GET/POST /api/cart` — Kelola keranjang
- `POST /api/checkout` — Process checkout
- `GET/POST /api/reviews` — Review & rating
- `GET /api/auth/*` — Authentication
- Dan banyak lagi...

### Database Models
- **User** — Authentication & profile (buyer, seller, admin)
- **Shop** — Toko penjual dengan status approval
- **Product** — Produk yang dijual (dengan kategori & stok)
- **Order** — Pesanan dengan status tracking
- **Review** — Review & rating produk (1-5 bintang)
- **Recipe** — Resep masakan dengan author tracking
- **Tip** — Tips kuliner dan tutorial
- **Log** — System logs untuk debugging & monitoring

### Key Features Detail
- **Authentication:** JWT-based dengan HTTP-only cookies, session duration 7 hari
- **File Upload:** Cloudinary untuk gambar produk, avatar, dan konten
- **Search:** Filter produk by kategori, nama, dan harga
- **Cart System:** Real-time calculation dengan stock validation
- **Review System:** Rating aggregation dengan verified buyer badge
- **Logging:** Dual-logger (Console + MongoDB) dengan Winston
- **Monitoring:** Grafana + Loki untuk real-time log visualization

---

## 🤝 Contributing

Proyek ini adalah project tugas kuliah. Untuk kontribusi:
1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Development Guidelines
- Gunakan TypeScript untuk type safety
- Follow ESLint rules (`npm run lint`)
- Test fitur sebelum commit
- Update dokumentasi jika menambah fitur baru
- Gunakan conventional commits

---

## 🚀 Roadmap & Future Improvements

### Planned Features
- [ ] Payment Gateway integration (Midtrans/Xendit)
- [ ] Real-time chat antara buyer & seller
- [ ] Mobile app dengan React Native
- [ ] AI-powered product recommendations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (ID/EN)
- [ ] PWA (Progressive Web App)

---

## 📄 License

Project ini dibuat untuk keperluan akademik - Mata Kuliah POPL, Universitas Sriwijaya.

---

## 📞 Contact

**Shafa Disya Aulia** - 2308107010002  
**Akrimah Usri** - 2308107010009

Project Link: [https://github.com/your-username/seasnacky](https://github.com/your-username/seasnacky)  
Live Demo: [https://seasnacky.vercel.app](https://seasnacky.vercel.app)

---

**⭐ Jika project ini bermanfaat, jangan lupa kasih star!**

