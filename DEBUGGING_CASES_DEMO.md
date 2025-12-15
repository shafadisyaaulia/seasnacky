# 🔍 3 Contoh Debugging Cases - Praktis untuk Demo

## Case 1: ❌ Stok Produk Tidak Mencukupi

### Problem:
User mencoba menambahkan produk ke keranjang dalam jumlah besar, tapi stok tidak mencukupi.

### Cara Demo:

1. **Setup - Kurangi Stok Produk:**
   ```
   - Login sebagai Admin
   - Dashboard → Kelola Produk
   - Pilih produk "Kerupuk Udang Original"
   - Edit stok: Ubah menjadi 3 unit saja
   - Klik Save
   ```

2. **Simulate Problem:**
   ```
   - Logout, login sebagai Buyer (kimmy@gmail.com)
   - Buka halaman Products
   - Klik produk "Kerupuk Udang Original"
   - Coba tambah ke cart dengan quantity: 10 unit
   - ❌ Error muncul: "Stok Kerupuk Udang hanya tersisa 3 unit"
   ```

3. **Check Logs:**
   ```
   - Login sebagai Admin
   - Dashboard → System Logs
   - Filter: Level = "Warning"
   - Lihat entry:
   
   🟡 WARNING: Gagal tambah ke cart: Stok tidak mencukupi - Kerupuk Udang
   Source: api/cart
   Details:
   - Product: Kerupuk Udang Original
   - Requested Qty: 10
   - Available Stock: 3
   - User: kimmy@gmail.com
   ```

4. **Analysis dari Log:**
   - Buyer minta 10 unit tapi stok hanya 3
   - System otomatis reject dengan warning
   - User tidak bisa checkout produk yang out of stock
   - Seller perlu restock produk

### Code yang Menghasilkan Log:

```typescript
// src/app/api/cart/route.ts
if (product.stock < quantity) {
  logger.warning(`Gagal tambah ke cart: Stok tidak mencukupi - ${product.name}`, {
    source: "api/cart",
    productId,
    productName: product.name,
    requestedQty: quantity,
    availableStock: product.stock,
    userId
  });
  return NextResponse.json(
    { message: `Stok ${product.name} hanya tersisa ${product.stock} unit` },
    { status: 400 }
  );
}
```

### Business Impact:
- ✅ Mencegah overselling (jual lebih dari stok)
- ✅ Notifikasi otomatis untuk seller restock
- ✅ Transparansi stok untuk buyer

---

## Case 2: 🚫 Unauthorized Access - Buyer Coba Akses Seller Dashboard

### Problem:
User dengan role "buyer" mencoba mengakses halaman seller dashboard yang seharusnya hanya untuk seller.

### Cara Demo:

1. **Login sebagai Buyer:**
   ```
   - Buka localhost:3000/login
   - Email: kimmy@gmail.com
   - Password: 12345678
   - Login berhasil (role: buyer)
   ```

2. **Simulate Unauthorized Access:**
   ```
   - Manual ketik URL: localhost:3000/dashboard/seller
   - Tekan Enter
   - ⚠️ Otomatis redirect ke /dashboard (buyer dashboard)
   ```

3. **Check Logs:**
   ```
   - Buka tab baru, login sebagai Admin
   - Dashboard → System Logs
   - Filter: Level = "Warning"
   - Lihat entry:
   
   🟡 WARNING: Unauthorized access attempt: Buyer mencoba akses Seller Dashboard
   Source: middleware
   Details:
   - User: kimmy@gmail.com
   - Role: buyer
   - Attempted Path: /dashboard/seller
   - Reason: Insufficient permissions (not seller)
   - Timestamp: 15 Dec 2025, 11:23:45
   ```

4. **Analysis dari Log:**
   - System detected unauthorized access attempt
   - User di-redirect otomatis (security measure)
   - Log mencatat siapa, kapan, dan halaman mana yang dicoba diakses
   - Bisa detect potential hacking attempt

### Code yang Menghasilkan Log:

```typescript
// src/middleware.ts (console.warn karena Edge Runtime limitation)
if (userPayload?.role !== 'SELLER' && userPayload?.role !== 'seller') {
  console.warn('[MIDDLEWARE] Unauthorized access attempt:', {
    userId: userPayload?.sub || userPayload?.id,
    email: userPayload?.email,
    role: userPayload?.role,
    attemptedPath: path,
  });
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
```

**Note:** Middleware menggunakan `console.warn` karena Edge Runtime tidak support Mongoose/MongoDB. Untuk production logging yang proper, bisa tambahkan client-side call ke `/api/log-access` setelah redirect.

### Security Benefits:
- 🔒 Role-based access control (RBAC)
- 🚨 Security audit trail
- 👁️ Detect suspicious behavior patterns
- 📊 Admin bisa monitor access attempts

### Variasi Demo:
Bisa juga demo:
- Buyer coba akses Admin dashboard → `/dashboard/admin`
- Seller coba akses Admin dashboard → sama, di-reject

---

## Case 3: 📦 Checkout Gagal - Alamat Pengiriman Kosong

### Problem:
User mencoba checkout tapi lupa mengisi alamat pengiriman.

### Cara Demo:

1. **Setup - Tambah Produk ke Cart:**
   ```
   - Login sebagai Buyer (kimmy@gmail.com)
   - Tambahkan 2-3 produk ke keranjang
   - Klik icon Cart di header
   - Klik "Lanjut ke Checkout"
   ```

2. **Simulate Problem:**
   ```
   - Di halaman Checkout, scroll ke form pengiriman
   - JANGAN isi field "Alamat" (biarkan kosong)
   - Isi field lain (Nama, No. HP)
   - Klik "Konfirmasi Pesanan"
   - ❌ Error muncul: "Alamat pengiriman harus diisi"
   ```

3. **Check Logs:**
   ```
   - Login sebagai Admin (tab baru)
   - Dashboard → System Logs
   - Filter: Level = "Error"
   - Lihat entry:
   
   🔴 ERROR: Checkout gagal: Alamat pengiriman kosong
   Source: api/orders/checkout
   Details:
   - User: Kimmy (kimmy@gmail.com)
   - Items Count: 3 produk
   - Total: Rp 155.000
   - Missing Field: address
   ```

4. **Analysis dari Log:**
   - User mencoba checkout 3 produk senilai Rp 155.000
   - Validation failed karena address kosong
   - System reject order untuk mencegah "pengiriman kemana?"
   - Admin bisa track berapa banyak user yang stuck di checkout

### Code yang Menghasilkan Log:

```typescript
// src/app/api/orders/checkout/route.ts
if (!payload.address || payload.address.trim() === "") {
  logger.error(`Checkout gagal: Alamat pengiriman kosong`, {
    source: "api/orders/checkout",
    userId,
    buyerName,
    itemsCount: orderItems.length
  });
  return NextResponse.json({ 
    message: "Alamat pengiriman harus diisi" 
  }, { status: 400 });
}
```

### Business Insights dari Log:

Dari logs, admin bisa analisa:
- **Conversion Rate:** Berapa % user yang sampai checkout vs berhasil order
- **Drop-off Points:** Field mana yang sering dilewati user
- **UX Improvement:** Tambahkan auto-fill address dari profile

**Contoh Query ke Database:**
```javascript
// Count checkout failures by reason
db.logs.aggregate([
  { $match: { 
    source: "api/orders/checkout", 
    level: "error" 
  }},
  { $group: { 
    _id: "$message", 
    count: { $sum: 1 } 
  }},
  { $sort: { count: -1 }}
])

// Result:
// "Alamat pengiriman kosong" → 45 kali (need UX fix!)
// "Keranjang kosong" → 12 kali
```

### Solution Recommendations:
- ✅ Add red asterisk (*) di required fields
- ✅ Auto-fill dari profile user (jika pernah order)
- ✅ Show error inline (realtime validation)
- ✅ Save draft order (user bisa lanjut nanti)

---

## 📊 Perbandingan 3 Cases

| Case | Level | Impact | Prevention |
|------|-------|--------|-----------|
| **Stok Habis** | Warning | Medium | Inventory management + auto-restock alert |
| **Unauthorized Access** | Warning | High | RBAC + middleware protection |
| **Checkout Validation** | Error | Medium | Form validation + UX improvement |

---

## 🎯 Tips Demo untuk Presentasi

### Preparation (5 menit sebelum demo):

1. **Reset Data:**
   ```bash
   # Clear old logs untuk dashboard yang clean
   node scripts/clear-old-logs.js
   ```

2. **Setup Stok Produk:**
   - Set 1-2 produk dengan stok rendah (2-3 unit)
   - Untuk demo "stok habis" lebih dramatis

3. **Test Semua Cases:**
   - Coba sekali setiap case untuk pastikan working
   - Verify logs muncul di Admin Dashboard

### Skenario Presentasi (3 menit):

```
[Slide: "Contoh Debugging dengan Logging System"]

CASE 1 - Stok Habis (45 detik):
"User mencoba beli 10 unit, tapi stok cuma 3."
→ Tunjukkan error di UI
→ Buka Admin Logs
→ "Dari log kita lihat detail: requested 10, available 3"

CASE 2 - Unauthorized Access (45 detik):
"Buyer mencoba akses Seller Dashboard."
→ Ketik manual URL /dashboard/seller
→ Otomatis redirect
→ "Log mencatat attempt ini untuk security audit"

CASE 3 - Checkout Validation (45 detik):
"User checkout tapi lupa isi alamat."
→ Klik checkout tanpa alamat
→ Error muncul
→ "Log tracking: 45 user stuck di sini → need UX fix"

[Slide berikutnya]
```

### Screenshot Checklist:

**Untuk PPT, siapkan:**
- ✅ Screenshot error message di UI (setiap case)
- ✅ Screenshot Admin Dashboard dengan log entry (highlight)
- ✅ Screenshot code snippet (yang menghasilkan log)
- ✅ Screenshot analytics/insights (optional - untuk wow factor)

---

## 💡 Bonus: Metrics & Analytics dari Logs

### Real-time Monitoring Dashboard (Konsep):

```
┌─────────────────────────────────────────┐
│  SYSTEM HEALTH - Last 24 Hours          │
├─────────────────────────────────────────┤
│  📈 Total Requests: 1,245               │
│  ✅ Success Rate: 98.4%                 │
│  ⚠️  Warnings: 15 (stok habis: 12)     │
│  ❌ Errors: 5 (checkout fail: 3)       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  TOP ISSUES - Need Attention            │
├─────────────────────────────────────────┤
│  1. Stok habis (12x) → Restock needed   │
│  2. Checkout alamat kosong (3x) → UX    │
│  3. Unauthorized access (2x) → Normal   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  RECOMMENDATIONS                        │
├─────────────────────────────────────────┤
│  • Add low-stock alerts for sellers     │
│  • Improve checkout form validation     │
│  • Monitor security access patterns     │
└─────────────────────────────────────────┘
```

---

## 🎓 Kesimpulan

**3 Debugging Cases ini menunjukkan:**

1. **Stok Habis** → Business Logic Validation
   - Mencegah overselling
   - Data-driven inventory management

2. **Unauthorized Access** → Security & Access Control
   - Role-based permissions
   - Security audit trail

3. **Checkout Validation** → User Experience Optimization
   - Form validation
   - Conversion rate optimization

**Key Takeaway:**
> Logging bukan hanya untuk debugging, tapi juga untuk **business intelligence** dan **continuous improvement**.

---

**🚀 Ready untuk Demo!**
