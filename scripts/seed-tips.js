// Script untuk seed data tips/artikel ke MongoDB
// Run dengan: node scripts/seed-tips.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Koneksi ke MongoDB
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://disyaauliashafa_db:seasnacky123@cluster0.sy5zadd.mongodb.net/seasnacky?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Schema Tip
const TipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: null },
  category: { type: String, enum: ['penyimpanan', 'pemilihan', 'pengolahan', 'informasi'], required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: { type: String, required: true },
  views: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true });

const Tip = mongoose.models.Tip || mongoose.model('Tip', TipSchema);

// Schema User (simplified, just to find admin)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Data Tips untuk di-seed
const tipsData = [
  {
    title: "Cara Menyimpan Ikan Agar Tetap Segar",
    slug: "cara-menyimpan-ikan-agar-tetap-segar",
    excerpt: "Tips jitu agar ikan bertahan lama di kulkas tanpa bau amis dan tetap segar saat dimasak.",
    content: `Menyimpan ikan dengan benar sangat penting untuk menjaga kesegaran dan kualitasnya. Berikut langkah-langkahnya:

1. **Cuci Bersih**
   Cuci ikan dengan air mengalir hingga bersih. Buang sisik, isi perut, dan insang untuk menghindari bau amis.

2. **Keringkan**
   Lap ikan dengan tisu atau lap bersih hingga tidak ada air yang tersisa. Ikan yang basah lebih cepat busuk.

3. **Simpan dalam Wadah Tertutup**
   Masukkan ikan ke dalam wadah kedap udara atau bungkus dengan plastik wrap rapat-rapat.

4. **Suhu Dingin**
   Simpan di lemari es (chiller) jika akan dimasak dalam 1-2 hari, atau di freezer jika lebih lama.

5. **Tambahkan Es Batu**
   Untuk penyimpanan jangka pendek, letakkan ikan di atas wadah berisi es batu agar tetap dingin.

6. **Jangan Cuci Ulang Sebelum Dimasak**
   Cuci ikan hanya saat akan dimasak untuk menjaga tekstur dan kesegaran.

Dengan cara ini, ikan Anda bisa tahan hingga 3-5 hari di chiller atau 1-3 bulan di freezer!`,
    category: "penyimpanan",
    authorName: "Admin SeaSnacky",
    published: true,
  },
  {
    title: "Ciri-ciri Udang Segar yang Wajib Diketahui",
    slug: "ciri-ciri-udang-segar",
    excerpt: "Jangan sampai salah beli! Ini 7 tanda udang masih segar dan layak konsumsi.",
    content: `Membeli udang segar sangat penting agar masakan jadi lezat dan aman dikonsumsi. Berikut ciri-ciri udang segar:

1. **Kulit Keras dan Mengkilap**
   Udang segar memiliki kulit yang keras, padat, dan mengkilap. Hindari udang dengan kulit lembek atau berlendir.

2. **Warna Bening dan Cerah**
   Warna udang segar adalah bening kebiruan atau kemerahan (tergantung jenis). Jika sudah keabu-abuan atau kehitaman, tandanya tidak segar.

3. **Bau Laut yang Segar**
   Udang segar berbau seperti air laut atau tidak berbau sama sekali. Jika tercium bau amis menyengat, jangan beli!

4. **Mata Hitam dan Menonjol**
   Mata udang segar berwarna hitam pekat dan menonjol keluar. Mata yang cekung atau keruh tanda udang sudah lama.

5. **Kepala Menempel Kuat**
   Kepala udang segar menempel kuat pada badan. Jika mudah lepas atau sudah terpisah, itu tanda udang tidak segar.

6. **Tekstur Kenyal**
   Tekan sedikit badan udang. Jika kembali ke bentuk semula dengan cepat, berarti masih segar.

7. **Tidak Ada Bintik Hitam**
   Perhatikan kulit dan daging udang. Bintik hitam menandakan udang sudah mulai membusuk.

Selalu beli udang di tempat terpercaya seperti SeaSnacky untuk jaminan kesegaran!`,
    category: "pemilihan",
    authorName: "Admin SeaSnacky",
    published: true,
  },
  {
    title: "Tips Mengolah Cumi Agar Tidak Alot",
    slug: "tips-mengolah-cumi-agar-tidak-alot",
    excerpt: "Cumi jadi keras dan alot? Ini dia trik jitu mengolah cumi agar empuk dan lezat.",
    content: `Cumi-cumi adalah seafood favorit banyak orang, tapi sering kali hasilnya mengecewakan karena teksturnya alot. Berikut cara mengolah cumi yang benar:

1. **Pilih Cumi Segar**
   Gunakan cumi segar dengan kulit putih bersih dan tekstur kenyal. Cumi yang sudah tidak segar pasti akan alot.

2. **Bersihkan dengan Benar**
   Buang tinta, tulang rawan, dan kulit ari cumi. Cuci hingga bersih agar tidak berlendir.

3. **Rendam dengan Jeruk Nipis atau Cuka**
   Rendam cumi dalam air jeruk nipis atau cuka selama 15-20 menit untuk melunakkan serat.

4. **Potong Melawan Serat**
   Saat memotong, pastikan arah potongan melawan serat cumi agar lebih mudah dikunyah.

5. **Masak Cepat atau Sangat Lama**
   Ada dua cara: masak cumi dengan api besar selama 2-3 menit (cepat), atau rebus dengan api kecil selama 45-60 menit (slow cooking).

6. **Hindari Api Sedang**
   Memasak cumi dengan api sedang dalam waktu lama justru membuat teksturnya keras dan alot.

7. **Marinasi dengan Baking Soda (Opsional)**
   Untuk hasil lebih empuk, lumuri cumi dengan baking soda, diamkan 30 menit, lalu bilas sebelum dimasak.

Dengan tips ini, cumi bakar, cumi saus padang, atau calamari goreng Anda pasti empuk dan nikmat!`,
    category: "pengolahan",
    authorName: "Chef SeaSnacky",
    published: true,
  },
  {
    title: "Manfaat Omega-3 dari Ikan untuk Kesehatan",
    slug: "manfaat-omega-3-dari-ikan",
    excerpt: "Kenapa ikan sangat baik untuk kesehatan? Ini dia manfaat luar biasa dari Omega-3!",
    content: `Ikan adalah sumber protein hewani terbaik yang kaya akan Omega-3. Berikut manfaatnya:

1. **Menjaga Kesehatan Jantung**
   Omega-3 membantu menurunkan kolesterol jahat (LDL) dan meningkatkan kolesterol baik (HDL), sehingga mengurangi risiko penyakit jantung.

2. **Meningkatkan Fungsi Otak**
   DHA (salah satu jenis Omega-3) adalah komponen penting untuk perkembangan otak. Konsumsi ikan secara rutin dapat meningkatkan daya ingat dan konsentrasi.

3. **Baik untuk Mata**
   DHA juga penting untuk kesehatan retina mata, membantu mencegah degenerasi makula yang bisa menyebabkan kebutaan.

4. **Mengurangi Peradangan**
   Omega-3 memiliki sifat anti-inflamasi yang membantu mengurangi peradangan dalam tubuh, termasuk arthritis.

5. **Mendukung Kesehatan Ibu Hamil dan Janin**
   Omega-3 sangat penting untuk perkembangan otak dan mata janin. Ibu hamil disarankan mengonsumsi ikan 2-3 kali seminggu.

6. **Meningkatkan Mood dan Mengurangi Depresi**
   Penelitian menunjukkan bahwa konsumsi Omega-3 dapat membantu mengurangi gejala depresi dan kecemasan.

7. **Menjaga Kesehatan Kulit**
   Omega-3 membantu menjaga kelembapan kulit dan melindungi dari kerusakan akibat sinar matahari.

**Jenis Ikan Kaya Omega-3:**
- Salmon
- Tuna
- Makarel
- Sarden
- Teri

Konsumsi ikan minimal 2 kali seminggu untuk mendapatkan manfaat optimal!`,
    category: "informasi",
    authorName: "Dr. Nutrisi SeaSnacky",
    published: true,
  },
  {
    title: "Fakta Menarik Tentang Laut dan Seafood",
    slug: "fakta-menarik-tentang-laut-dan-seafood",
    excerpt: "Tahukah kamu? Ini 10 fakta unik tentang laut dan makanan laut yang jarang diketahui!",
    content: `Laut menyimpan banyak misteri dan keajaiban. Berikut fakta menarik yang wajib kamu tahu:

1. **71% Permukaan Bumi adalah Laut**
   Meskipun luas, hanya 5% dari laut yang sudah dieksplorasi manusia. Masih banyak misteri di dasar lautan!

2. **Udang Punya Jantung di Kepala**
   Unik tapi nyata! Jantung udang terletak di bagian kepala, bukan di dada seperti manusia.

3. **Lobster Bisa Hidup Hingga 100 Tahun**
   Lobster memiliki umur panjang dan terus tumbuh sepanjang hidupnya. Mereka juga tidak menunjukkan tanda-tanda penuaan!

4. **Cumi-cumi Punya 3 Jantung**
   Dua jantung memompa darah ke insang, dan satu jantung memompa ke seluruh tubuh. Makanya cumi bisa berenang sangat cepat!

5. **Gurita Sangat Cerdas**
   Gurita bisa membuka toples, memecahkan teka-teki, dan bahkan belajar dengan mengamati gurita lain.

6. **Ikan Tuna Bisa Berenang 75 km/jam**
   Tuna adalah salah satu ikan tercepat di dunia. Mereka juga tidak pernah berhenti berenang!

7. **Rumput Laut Bukan Tumbuhan**
   Meskipun disebut "rumput", rumput laut sebenarnya adalah alga (ganggang) yang sangat kaya nutrisi.

8. **Kepiting Berjalan Menyamping**
   Struktur tubuh kepiting membuat mereka lebih efisien berjalan ke samping daripada maju.

9. **Ikan Kerapu Bisa Ganti Kelamin**
   Beberapa jenis ikan, termasuk kerapu, bisa mengubah jenis kelamin mereka berdasarkan kondisi lingkungan.

10. **Indonesia Punya Keanekaragaman Laut Tertinggi di Dunia**
    Indonesia adalah rumah bagi lebih dari 3.000 spesies ikan dan 600 spesies karang. Lautan kita adalah surga biodiversitas!

Yuk, lestarikan laut kita dan konsumsi seafood secara bijak!`,
    category: "informasi",
    authorName: "Tim Edukasi SeaSnacky",
    published: true,
  },
  {
    title: "Cara Memilih Ikan Segar di Pasar",
    slug: "cara-memilih-ikan-segar-di-pasar",
    excerpt: "Belanja ikan di pasar tradisional? Ini panduan lengkap agar tidak tertipu ikan tidak segar!",
    content: `Membeli ikan segar di pasar memerlukan kejelian. Berikut panduannya:

1. **Mata Ikan**
   Mata ikan segar harus jernih, menonjol, dan tidak berkabut. Mata yang keruh atau cekung menandakan ikan sudah tidak segar.

2. **Insang Berwarna Merah Cerah**
   Buka tutup insang dan perhatikan warnanya. Insang segar berwarna merah cerah atau merah muda. Jika coklat atau hitam, jangan beli.

3. **Tekstur Daging Kenyal**
   Tekan daging ikan dengan jari. Jika cepat kembali ke bentuk semula, itu tandanya segar. Ikan yang tidak segar akan meninggalkan bekas lekukan.

4. **Sisik Masih Menempel Kuat**
   Sisik ikan segar tidak mudah rontok. Jika sisik lepas begitu saja saat disentuh, berarti ikan sudah lama.

5. **Bau Laut yang Segar**
   Ikan segar tidak berbau amis menyengat. Baunya lebih seperti air laut yang segar.

6. **Perut Tidak Kembung**
   Hindari ikan dengan perut yang menggelembung atau lembek. Itu tanda ikan mulai membusuk dari dalam.

7. **Warna Alami dan Cerah**
   Warna ikan segar cerah dan alami. Jika terlalu pucat atau terlalu merah, bisa jadi sudah diberi pewarna.

8. **Sirip dan Ekor Masih Utuh**
   Ikan yang fresh memiliki sirip dan ekor yang masih kuat dan tidak rusak.

9. **Beli di Pagi Hari**
   Waktu terbaik beli ikan adalah pagi hari saat ikan baru datang dari pelelangan.

10. **Pilih Pedagang Terpercaya**
    Atau lebih mudah lagi, pesan online di SeaSnacky dengan jaminan kesegaran langsung dari nelayan!

Selamat berbelanja!`,
    category: "pemilihan",
    authorName: "Admin SeaSnacky",
    published: true,
  }
];

// Fungsi untuk seed data
const seedTips = async () => {
  try {
    await connectDB();

    // Cari user ADMIN atau SELLER untuk dijadikan author
    let adminUser = await User.findOne({ role: 'ADMIN' });
    
    if (!adminUser) {
      // Jika tidak ada admin, cari seller
      adminUser = await User.findOne({ role: 'SELLER' });
    }

    if (!adminUser) {
      // Jika masih tidak ada, ambil user pertama yang ada
      adminUser = await User.findOne({});
      
      if (!adminUser) {
        console.log('❌ Tidak ada user di database. Harap buat user terlebih dahulu.');
        process.exit(1);
      }
      
      console.log(`⚠️  Menggunakan user ${adminUser.name} (${adminUser.role || 'USER'}) sebagai author`);
    }

    // Hapus data tips lama (opsional)
    await Tip.deleteMany({});
    console.log('🗑️  Data tips lama dihapus');

    // Insert data tips baru
    const tipsWithAuthor = tipsData.map(tip => ({
      ...tip,
      author: adminUser._id,
    }));

    await Tip.insertMany(tipsWithAuthor);
    console.log(`✅ Berhasil seed ${tipsData.length} tips`);

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error saat seed tips:', error.message);
    process.exit(1);
  }
};

// Jalankan script
seedTips();
