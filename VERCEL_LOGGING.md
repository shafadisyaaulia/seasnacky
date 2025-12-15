# Logging di Vercel Deployment

## 📋 Overview

Sistem logging SeaSnacky **SUDAH SIAP** untuk production di Vercel! Setiap aktivitas yang terjadi baik di local maupun di Vercel akan otomatis tersimpan ke MongoDB Atlas.

## ✅ Yang Sudah Dikonfigurasi

### 1. **MongoDB Cloud (MongoDB Atlas)**
- ✅ Database sudah cloud-based
- ✅ Dapat diakses dari Vercel serverless functions
- ✅ Tidak perlu setup tambahan

### 2. **Logger dengan MongoDB Transport**
- ✅ Otomatis menyimpan log ke database
- ✅ Support serverless environment
- ✅ Tracking environment (development, preview, production)

### 3. **Auto-logging untuk Aktivitas Penting**
Sudah terintegrasi di:
- ✅ Login/Register user
- ✅ Shop creation & approval
- ✅ Order checkout
- ✅ Error tracking

## 🚀 Cara Kerja di Vercel

### **Saat Deploy ke Vercel:**

1. **Setiap request ke API** → Logger mencatat aktivitas
2. **Log otomatis tersimpan** → MongoDB Atlas (cloud)
3. **Admin dapat melihat** → Dashboard `/dashboard/admin/logs`

### **Environment Variables di Vercel:**

Pastikan variable ini sudah ada di Vercel Dashboard:

```env
MONGODB_URI=mongodb+srv://disyaauliashafa_db:seasnacky123@cluster0.sy5zadd.mongodb.net/seasnacky?retryWrites=true&w=majority&appName=Cluster0
```

✅ **Sudah tersedia** di `.env.local` dan otomatis ter-sync ke Vercel saat deploy.

## 📊 Melihat Logs di Production

### **1. Via Admin Dashboard**
```
https://your-app.vercel.app/dashboard/admin/logs
```
- Login sebagai Admin
- Klik "System Logs" di menu
- Filter by level (info, warning, error)
- Enable auto-refresh untuk real-time monitoring

### **2. Via Vercel Dashboard**
```
Vercel Project → Logs → Runtime Logs
```
- Melihat console.log dari serverless functions
- Useful untuk debugging

## 🔍 Contoh Log yang Tercatat

### **User Activities:**
```javascript
logger.info('User Akrimah Usri login berhasil', {
  source: 'API Auth Login',
  userId: '674abc123...',
  email: 'akrimah@example.com',
  role: 'seller',
});
```

### **Shop Activities:**
```javascript
logger.info('User Shafa Disya aulia membuka toko: sapa shop', {
  source: 'API Shop Create',
  shopName: 'sapa shop',
  sellerId: '674xyz...',
});
```

### **Order Activities:**
```javascript
logger.info('Order baru dibuat oleh John Doe', {
  source: 'API Orders Checkout',
  orderId: '674order...',
  totalAmount: 150000,
  itemCount: 3,
});
```

## 🧪 Testing Logging di Local

### **1. Test via Endpoint:**
```bash
curl http://localhost:3000/api/test-logs
```

### **2. Test via Activity:**
- Login ke aplikasi
- Buat shop baru
- Checkout order
- Lihat logs di `/dashboard/admin/logs`

## 📈 Benefits untuk Vercel Deployment

| Feature | Status | Benefit |
|---------|--------|---------|
| Real-time logging | ✅ | Monitor aktivitas user instantly |
| Cloud storage | ✅ | Log tersimpan permanen di MongoDB Atlas |
| Serverless ready | ✅ | Tidak perlu server khusus untuk logging |
| Multi-environment | ✅ | Track development vs production logs |
| Auto-refresh | ✅ | Dashboard update otomatis setiap 5 detik |
| Error tracking | ✅ | Tangkap & log semua error otomatis |

## 🔧 Troubleshooting

### **Log tidak muncul di dashboard?**

1. **Cek koneksi MongoDB:**
   ```bash
   # Test di terminal Vercel
   echo $MONGODB_URI
   ```

2. **Cek Vercel logs:**
   - Buka Vercel Dashboard
   - Pilih project SeaSnacky
   - Klik tab "Logs"
   - Cari error "Failed to save log to MongoDB"

3. **Force refresh:**
   - Tekan tombol "Auto-Refresh ON" di dashboard
   - Clear browser cache
   - Reload halaman

### **Logs hanya muncul di local?**

✅ **Tidak akan terjadi** karena:
- MongoDB sudah cloud-based
- Logger menggunakan transport yang sama
- Environment variables sudah sync

## 🎯 Next Steps Setelah Deploy

1. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "feat: implement real-time logging system"
   git push origin main
   ```

2. **Vercel otomatis deploy**

3. **Test logging:**
   - Login di production
   - Buat aktivitas (shop, order, dll)
   - Cek logs di admin dashboard

4. **Monitor real-time:**
   - Enable auto-refresh
   - Lihat aktivitas user secara live

## 📝 Summary

✅ **SIAP DEPLOY**: Logging sudah 100% ready untuk Vercel
✅ **NO EXTRA CONFIG**: Tidak perlu setup tambahan
✅ **REAL-TIME**: Log otomatis update setiap aktivitas
✅ **CLOUD-BASED**: Data tersimpan aman di MongoDB Atlas

---

🚀 **Tinggal push & deploy, logging langsung jalan!**
