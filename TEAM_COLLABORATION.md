# 👥 Kolaborasi Tim & Pembagian Tugas - SeaSnacky Marketplace

## 📋 Tim Members
- **Akrimah Usri** (Developer A)
- **Shafa** (Developer B)

---

## 🎯 Prinsip Pembagian Tugas

### ✅ Kriteria Pembagian:
1. **Seimbang** - Workload setara antara kedua developer
2. **Modular** - Minimal dependency untuk parallel work
3. **Skill Balance** - Mix antara frontend, backend, dan full-stack
4. **Clear Ownership** - Setiap fitur punya 1 PIC utama

---

## 👤 AKRIMAH USRI - Area Tanggung Jawab

### 🎨 **1. USER EXPERIENCE & BUYER FEATURES**

#### A. Authentication & User Management
**Files:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/refresh/route.ts`
- `src/lib/session.ts`

**Responsibilities:**
- ✅ Login/Register UI & validation
- ✅ JWT session management
- ✅ Session refresh mechanism
- ✅ Password hashing dengan bcrypt
- ✅ Error handling & logging untuk auth

**Deliverables:**
- Form login/register responsive
- Session expiry 7 hari
- Auto-refresh session untuk role changes
- Logging untuk login success/failed

---

#### B. Product Catalog & Shopping Experience
**Files:**
- `src/app/products/page.tsx`
- `src/app/products/[id]/page.tsx`
- `src/app/api/products/route.ts`
- `src/components/ProductCard.tsx`
- `src/components/ProductCatalog.tsx`

**Responsibilities:**
- ✅ Product listing dengan search & filter
- ✅ Product detail page dengan rating
- ✅ Product card component (reusable)
- ✅ Pagination & infinite scroll
- ✅ Image optimization (Cloudinary)

**Deliverables:**
- Search by name/category
- Filter by price range
- Product detail dengan gallery
- Rating & review display

---

#### C. Shopping Cart & Checkout
**Files:**
- `src/app/cart/page.tsx`
- `src/app/checkout/page.tsx`
- `src/app/api/cart/route.ts`
- `src/app/api/orders/checkout/route.ts`
- `src/context/CartContext.tsx`
- `src/models/Cart.ts`
- `src/models/Order.ts`

**Responsibilities:**
- ✅ Add to cart functionality
- ✅ Cart page dengan update quantity
- ✅ Checkout flow (address, shipping)
- ✅ Order creation & payment simulation
- ✅ Validasi stok sebelum checkout
- ✅ Logging untuk checkout errors

**Deliverables:**
- Real-time cart update
- Shipping cost calculation
- Order summary page
- Payment success/failure handling
- Email/notification setelah order (optional)

---

#### D. User Profile & Wishlist
**Files:**
- `src/app/(user)/profile/page.tsx`
- `src/app/wishlist/page.tsx`
- `src/app/api/profile/route.ts`
- `src/app/api/wishlist/route.ts`
- `src/models/Wishlist.ts`

**Responsibilities:**
- ✅ User profile view & edit
- ✅ Wishlist add/remove
- ✅ Order history
- ✅ Profile update (name, email, address)

**Deliverables:**
- Profile page dengan tabs
- Wishlist dengan sync ke DB
- Order tracking

---

### 📊 **2. TESTING & QUALITY ASSURANCE**

**Responsibilities:**
- ✅ Testing semua buyer features
- ✅ Cross-browser testing (Chrome, Firefox, Edge)
- ✅ Mobile responsiveness testing
- ✅ Bug documentation & reporting
- ✅ User acceptance testing (UAT)

**Deliverables:**
- Test report document
- Bug list dengan screenshots
- Mobile compatibility report

---

## 👤 SHAFA - Area Tanggung Jawab

### 🏪 **1. SELLER & ADMIN FEATURES**

#### A. Seller Dashboard & Store Management
**Files:**
- `src/app/dashboard/seller/page.tsx`
- `src/app/dashboard/seller/products/page.tsx`
- `src/app/dashboard/seller/orders/page.tsx`
- `src/app/dashboard/seller/content/page.tsx`
- `src/app/open-shop/page.tsx`
- `src/app/api/shop/route.ts`
- `src/models/Shop.ts`

**Responsibilities:**
- ✅ Seller dashboard dengan statistik
- ✅ Add/Edit/Delete produk
- ✅ Manage incoming orders
- ✅ Shop registration & approval flow
- ✅ Upload produk images (Cloudinary)

**Deliverables:**
- Dashboard dengan chart/stats
- Product management CRUD
- Order management (pending → shipped)
- Shop profile page

---

#### B. Recipe Management (Content Education)
**Files:**
- `src/app/recipes/page.tsx`
- `src/app/recipes/[id]/page.tsx`
- `src/app/api/recipes/route.ts`
- `src/app/api/recipes/[id]/route.ts`
- `src/models/Recipe.ts`

**Responsibilities:**
- ✅ Recipe listing public page
- ✅ Recipe detail dengan ingredients
- ✅ Create/Edit/Delete recipe (seller only)
- ✅ Link recipe dengan produk (marketing)
- ✅ Filter recipe by authorId

**Deliverables:**
- Recipe cards dengan gambar
- Recipe detail dengan steps
- Seller hanya lihat resep sendiri
- Product linking di recipe page

---

#### C. Admin Panel & System Management
**Files:**
- `src/app/dashboard/admin/page.tsx`
- `src/app/dashboard/admin/users/page.tsx`
- `src/app/dashboard/admin/shops/page.tsx`
- `src/app/dashboard/admin/products/page.tsx`
- `src/app/dashboard/admin/logs/page.tsx`
- `src/app/api/admin/users/route.ts`
- `src/app/api/admin/shops/route.ts`

**Responsibilities:**
- ✅ Admin dashboard dengan overview stats
- ✅ User management (edit role, delete)
- ✅ Shop approval/rejection system
- ✅ Product moderation
- ✅ System logs viewer dengan filter
- ✅ Real-time log monitoring

**Deliverables:**
- Admin dashboard dengan metrics
- User table dengan search & filter
- Shop approval workflow
- Logs page dengan auto-refresh
- Role-based access control (RBAC)

---

### 🔧 **2. BACKEND INFRASTRUCTURE & LOGGING**

#### A. Logging System
**Files:**
- `src/lib/logger.ts`
- `src/models/Log.ts`
- `src/app/api/test-logs/route.ts`

**Responsibilities:**
- ✅ Winston logger setup
- ✅ MongoDB Transport implementation
- ✅ Logging integration di API endpoints
- ✅ Log model (level, message, source)
- ✅ Environment tracking (dev/prod)

**Deliverables:**
- Winston + MongoDB logging
- Console + DB dual output
- Logs collection di MongoDB
- Real-time log streaming

---

#### B. Database Models & Validation
**Files:**
- `src/models/User.ts`
- `src/models/Product.ts`
- `src/models/Shop.ts`
- `src/models/Recipe.ts`
- `src/models/Order.ts`
- `src/models/Review.ts`
- `src/lib/mongodb.ts`

**Responsibilities:**
- ✅ Mongoose schema definition
- ✅ Data validation dengan Zod
- ✅ Indexes untuk performance
- ✅ Relationships (populate)
- ✅ Database migrations (jika ada perubahan schema)

**Deliverables:**
- 10+ models dengan proper validation
- Efficient indexes
- Migration scripts

---

#### C. Middleware & Security
**Files:**
- `src/middleware.ts`
- `src/lib/auth.ts`
- `src/lib/guards.ts`

**Responsibilities:**
- ✅ Route protection (auth required)
- ✅ Role-based access control (RBAC)
- ✅ JWT verification
- ✅ Unauthorized access logging
- ✅ CORS & security headers

**Deliverables:**
- Protected routes untuk admin/seller
- Middleware logging
- Security best practices

---

## 🤝 KOLABORASI BERSAMA

### 1. **Shared Components & UI Library**
**Files:**
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/ui/*` (Button, Card, Badge, dll)
- `src/app/globals.css`

**Pembagian:**
- **Akrimah:** Header (user menu, cart icon, search)
- **Shafa:** Footer (links, newsletter, social media)
- **Bersama:** UI components (pakai ShadCN, tinggal install)

---

### 2. **Landing Page & Marketing**
**Files:**
- `src/app/page.tsx`
- `src/app/landing-v2/page.tsx`

**Pembagian:**
- **Akrimah:** Hero section, featured products
- **Shafa:** Recipe section, testimonials, CTA

---

### 3. **Deployment & DevOps**
**Files:**
- `vercel.json`
- `.github/workflows/deploy.yml`
- `dockerfile`
- Environment variables setup

**Pembagian:**
- **Akrimah:** Vercel deployment, domain setup
- **Shafa:** Environment variables, MongoDB Atlas config
- **Bersama:** Testing production build

---

### 4. **Documentation**
**Files:**
- `README.md`
- `DEPLOYMENT_GUIDE.md`
- `PPT_LOGGING_CONTENT.md`
- `DEBUGGING_CASES_DEMO.md`

**Pembagian:**
- **Akrimah:** User guide, buyer features, demo script
- **Shafa:** Admin guide, logging docs, technical specs
- **Bersama:** Presentation slides (PPT)

---

## 📅 Timeline & Milestones

### **Week 1: Foundation (Sudah Selesai ✅)**
- [x] Project setup (Next.js, MongoDB, Auth)
- [x] Database models
- [x] Basic authentication
- [x] Logging system

### **Week 2: Core Features (Sudah Selesai ✅)**
- [x] Product catalog (Akrimah)
- [x] Shopping cart (Akrimah)
- [x] Seller dashboard (Shafa)
- [x] Admin panel (Shafa)

### **Week 3: Advanced Features (Sudah Selesai ✅)**
- [x] Checkout & payment (Akrimah)
- [x] Recipe management (Shafa)
- [x] System logs dashboard (Shafa)
- [x] Session refresh (Akrimah)

### **Week 4: Testing & Polish (Current)**
- [ ] Bug fixing (Bersama)
- [ ] UI/UX improvements (Bersama)
- [ ] Mobile optimization (Akrimah)
- [ ] Performance tuning (Shafa)

### **Week 5: Deployment & Presentation**
- [ ] Production deployment (Bersama)
- [ ] PPT preparation (Bersama)
- [ ] Demo rehearsal (Bersama)
- [ ] Final presentation (Bersama)

---

## 📊 Workload Distribution

### Summary by Numbers:

**Akrimah Usri:**
- Frontend Pages: 8 (Login, Register, Products, Cart, Checkout, Profile, Wishlist, Product Detail)
- API Endpoints: 6 (Auth, Products, Cart, Orders, Profile, Wishlist)
- Components: 5 (ProductCard, ProductCatalog, CartContext, etc)
- Testing: Full buyer flow
- **Total Complexity: 50%**

**Shafa:**
- Frontend Pages: 7 (Seller Dashboard, Admin Dashboard, Recipe, Shop Management)
- API Endpoints: 8 (Shop, Recipes, Admin Users, Admin Shops, Logs)
- Backend: Logger, Middleware, Models
- Infrastructure: Logging system
- **Total Complexity: 50%**

---

## 🔄 Communication & Code Sharing

### **Git Workflow:**
```bash
# Akrimah works on:
git checkout -b feature/buyer-experience

# Shafa works on:
git checkout -b feature/seller-admin

# Merge to main regularly:
git checkout main
git merge feature/buyer-experience
git merge feature/seller-admin
```

### **Daily Sync:**
- **Morning (10:00):** Quick standup (15 min)
  - What did I do yesterday?
  - What will I do today?
  - Any blockers?

- **Evening (17:00):** Code review & merge (30 min)
  - Review each other's code
  - Merge to main
  - Resolve conflicts

### **Tools:**
- **Communication:** WhatsApp Group
- **Code Sharing:** GitHub (push daily)
- **Task Tracking:** Trello/Notion (optional)
- **Screen Sharing:** Google Meet (untuk demo/debug)

---

## 🎯 Kriteria Keberhasilan

### **Akrimah - Buyer Experience:**
- ✅ User bisa register & login tanpa error
- ✅ Product search & filter working
- ✅ Add to cart real-time
- ✅ Checkout flow smooth (< 3 steps)
- ✅ Mobile responsive (tested on 3 devices)

### **Shafa - Seller & Admin:**
- ✅ Seller bisa manage produk (CRUD)
- ✅ Admin bisa approve/reject toko
- ✅ System logs real-time
- ✅ Recipe linking ke produk working
- ✅ Role-based access working (no unauthorized access)

### **Bersama - Project Overall:**
- ✅ 0 critical bugs
- ✅ Loading time < 3 seconds
- ✅ 100% features working di production
- ✅ PPT presentation ready
- ✅ Demo script prepared (15-20 menit)

---

## 🚨 Dependency Management

### **Akrimah depends on Shafa:**
- ❌ **TIDAK ADA** - Buyer features independent dari seller/admin

### **Shafa depends on Akrimah:**
- ⚠️ **Session management** - Perlu getAuthUser() dari Akrimah
- ⚠️ **Product model** - Perlu Product schema untuk recipe linking

**Solution:** Agree on interface/schema dulu sebelum coding!

---

## 💡 Tips Kolaborasi Sukses

### 1. **Code Standards**
```typescript
// ✅ GOOD: Consistent naming
const handleSubmit = async () => { ... }

// ❌ BAD: Inconsistent
const submitHandler = async () => { ... }
```

### 2. **Comment Important Code**
```typescript
// AKRIMAH: Jangan ubah fungsi ini, dipakai di checkout
export function calculateTotal(items: CartItem[]) { ... }
```

### 3. **Test Before Push**
```bash
# Selalu test sebelum push ke GitHub
npm run build
npm run dev

# Check for errors
npm run lint
```

### 4. **Resolve Conflicts Immediately**
```bash
# Jika ada conflict, resolve di hari yang sama
git pull origin main
# Fix conflicts
git add .
git commit -m "Resolve merge conflict"
git push
```

---

## 📝 Checklist Akhir Sebelum Presentasi

### **Akrimah:**
- [ ] Test login/register (3 scenarios: success, wrong password, user not found)
- [ ] Test product search (minimal 5 keywords)
- [ ] Test add to cart (multiple products, update quantity)
- [ ] Test checkout flow (fill form, validate, create order)
- [ ] Test mobile responsive (iPhone, Android, iPad)
- [ ] Prepare demo account: buyer@demo.com / demo123

### **Shafa:**
- [ ] Test seller dashboard (add product, edit, delete)
- [ ] Test admin approve toko (pending → active)
- [ ] Test system logs (filter by level, auto-refresh)
- [ ] Test recipe CRUD (create, link product, delete)
- [ ] Test unauthorized access (buyer → seller dashboard)
- [ ] Prepare demo account: seller@demo.com / demo123, admin@demo.com / admin123

### **Bersama:**
- [ ] Final code review (clean console.log)
- [ ] Update README.md (installation guide)
- [ ] Production deployment (Vercel)
- [ ] PPT finalized (20 slides max)
- [ ] Demo script rehearsal (timing: 15-20 menit)
- [ ] Screenshot preparation (all features)
- [ ] Backup plan (jika internet down: video recording)

---

## 🎊 Kesimpulan

**Pembagian ini adil karena:**
1. ✅ Workload 50:50 (sama-sama ~15 files + API endpoints)
2. ✅ Complexity balance (Akrimah: Frontend heavy, Shafa: Backend heavy)
3. ✅ Minimal dependency (bisa kerja parallel)
4. ✅ Clear ownership (tidak ada "abu-abu")
5. ✅ Skill development (keduanya dapat frontend + backend experience)

**Key Success Factors:**
- 🗣️ Communication: Daily sync (pagi & sore)
- 🔄 Integration: Merge code daily
- 🧪 Testing: Test sebelum push
- 📖 Documentation: Comment code dengan jelas
- 🤝 Teamwork: Saling review & help

---

**Good luck, Akrimah & Shafa! 🚀**

> "Alone we can do so little; together we can do so much." - Helen Keller
