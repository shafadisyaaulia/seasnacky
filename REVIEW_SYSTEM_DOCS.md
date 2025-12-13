# Review & Rating System - Documentation

## ✨ Fitur yang Sudah Diimplementasikan

### 1. **Review Model** (`src/models/Review.ts`)
Model MongoDB untuk menyimpan data review dengan struktur:
- `productId`: Reference ke Product
- `userId`: Reference ke User  
- `userName`: Nama user yang review
- `userEmail`: Email user
- `rating`: Rating 1-5 bintang
- `comment`: Text review (max 1000 karakter)
- `helpful`: Counter jumlah "helpful" votes
- `verified`: Badge verified buyer
- `timestamps`: createdAt & updatedAt

**Fitur Khusus:**
- Index untuk performa query optimal
- Unique constraint: 1 user hanya bisa 1 review per produk
- Validation rating min 1, max 5
- Validation comment max 1000 karakter

---

### 2. **API Endpoints** (`src/app/api/reviews/route.ts`)

#### **GET /api/reviews?productId={id}**
Mengambil semua review untuk produk tertentu + statistik.

**Response:**
\`\`\`json
{
  "reviews": [...],
  "stats": {
    "totalReviews": 10,
    "averageRating": 4.5,
    "distribution": {
      "5": 5,
      "4": 3,
      "3": 1,
      "2": 1,
      "1": 0
    }
  }
}
\`\`\`

#### **POST /api/reviews**
Membuat review baru (memerlukan authentication).

**Request Body:**
\`\`\`json
{
  "productId": "...",
  "rating": 5,
  "comment": "Produk sangat bagus..."
}
\`\`\`

**Validasi:**
- User harus login
- Rating 1-5
- Comment minimal 10 karakter
- Satu user hanya bisa review 1x per produk
- Produk harus exist

#### **PUT /api/reviews**
Update review yang sudah ada (hanya owner).

**Request Body:**
\`\`\`json
{
  "reviewId": "...",
  "rating": 4,
  "comment": "Update review..."
}
\`\`\`

#### **DELETE /api/reviews?reviewId={id}**
Hapus review (hanya owner).

---

### 3. **UI Components**

#### **RatingStars** (`src/components/ui/RatingStars.tsx`)
Komponen bintang rating yang bisa:
- **Display mode**: Menampilkan rating (support half-star)
- **Interactive mode**: User bisa klik untuk pilih rating
- Props: `rating`, `size`, `showNumber`, `interactive`, `onRatingChange`

#### **ReviewForm** (`src/components/ui/ReviewForm.tsx`)
Form untuk menulis review dengan fitur:
- Interactive star rating picker
- Textarea dengan counter karakter (max 1000)
- Validasi minimal 10 karakter
- Loading state saat submit
- Notifikasi sukses/error menggunakan NotificationContext
- Tombol cancel
- Auto-close setelah sukses

#### **ReviewList** (`src/components/ui/ReviewList.tsx`)
Menampilkan list reviews dengan:
- **Rating Summary Box**:
  - Overall rating (angka besar)
  - Rating distribution bar chart
  - Total reviews count
- **Individual Reviews**:
  - User avatar & nama
  - Verified badge (jika verified buyer)
  - Rating bintang
  - Comment text
  - Tanggal posting (format Indonesia)
  - Helpful button dengan counter
- Loading skeleton saat fetch
- Empty state jika belum ada review

#### **ProductDetailClient** (`src/app/products/[id]/ProductDetailClient.tsx`)
Client wrapper untuk review section:
- Toggle show/hide form review
- Refresh list setelah submit review
- Tombol "Tulis Review" yang elegan

---

### 4. **Integration di Product Detail**

File: `src/app/products/[id]/page.tsx`

**Perubahan:**
1. Import Review model dan ReviewList
2. Fetch review stats di server (averageRating, totalReviews)
3. Display rating real-time di product info
4. Tambah section review di bawah product info
5. Render `ProductDetailClient` untuk review interaktif

---

## 🎨 Design Highlights

### Visual Features:
- ⭐ **Yellow stars** dengan fill effect
- 📊 **Bar chart distribution** untuk rating breakdown
- ✓ **Verified badge** (green) untuk verified buyers
- 👤 **Avatar gradient** untuk user
- 💬 **Clean card design** dengan hover effects
- 📱 **Fully responsive** (mobile-first)
- ⚡ **Loading skeletons** untuk UX yang smooth

### UX Features:
- Auto-close form setelah submit
- Notifikasi custom dengan branding SeaSnacky
- Validasi real-time
- Character counter untuk review
- Disable submit jika rating belum dipilih
- Refresh list otomatis setelah submit

---

## 🔒 Security & Validation

1. **Authentication**:
   - POST/PUT/DELETE memerlukan login
   - Session-based authentication
   - User hanya bisa edit/delete review sendiri

2. **Input Validation**:
   - Rating: 1-5 (required)
   - Comment: min 10 karakter, max 1000 (required)
   - ProductId validation (must exist)

3. **Database Constraints**:
   - Unique index: userId + productId (prevent duplicate)
   - Required fields enforced
   - Type validation

---

## 📱 User Flow

### Menulis Review:
1. User buka halaman product detail
2. Klik tombol "Tulis Review"
3. Form muncul di atas list review
4. Pilih rating (1-5 bintang)
5. Tulis comment (min 10 char)
6. Klik "Kirim Review"
7. Notifikasi sukses muncul
8. Form auto-close
9. List refresh otomatis dengan review baru di atas

### Melihat Reviews:
1. Scroll ke section "Review & Rating"
2. Lihat **Summary Box**:
   - Overall rating (contoh: 4.5)
   - Bar chart distribusi rating
   - Total review count
3. Scroll list untuk baca review individual
4. Setiap review menampilkan:
   - User info + avatar
   - Rating bintang
   - Comment
   - Tanggal
   - Helpful counter

---

## 🚀 Next Steps (Future Enhancement)

Fitur yang bisa ditambahkan:
- [ ] Edit review (button edit muncul hanya di review milik user)
- [ ] Delete review (button delete hanya di review milik user)
- [ ] Helpful vote system (user bisa vote review helpful)
- [ ] Review images upload
- [ ] Reply to review (dari seller)
- [ ] Sort reviews (terbaru, rating tertinggi, terbanyak helpful)
- [ ] Filter reviews by rating
- [ ] Mark verified buyer (cek dari Order history)
- [ ] Pagination untuk list review
- [ ] Report review (spam/abuse)

---

## ✅ Testing Checklist

- [x] Create review dengan valid data
- [x] Validasi rating 1-5
- [x] Validasi comment min 10 char
- [x] Prevent duplicate review (1 user 1 produk)
- [x] Calculate average rating correctly
- [x] Display rating distribution
- [x] Show empty state jika no reviews
- [x] Loading state saat fetch
- [x] Responsive design mobile & desktop
- [x] Authentication check untuk POST
- [x] Error handling & notifikasi
- [x] Form auto-close setelah submit
- [x] Refresh list setelah submit

---

## 🎯 Summary

Review & Rating System sudah **fully functional** dengan:
- ✅ Model Review di database
- ✅ CRUD API endpoints lengkap
- ✅ UI components yang reusable
- ✅ Integration di product detail page
- ✅ Validasi & security
- ✅ Notifikasi custom
- ✅ Responsive design
- ✅ Real-time stats calculation

**Status: READY TO USE** 🚀
