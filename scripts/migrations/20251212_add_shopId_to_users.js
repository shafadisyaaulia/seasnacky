// File: scripts/migrations/20251212_add_shopId_to_users.js

require('dotenv').config({ path: './.env.local' });
const mongoose = require('mongoose');

// --- Definisi Skema Model di Script (Solusi Paling Andal) ---
// Kita mendefinisikan skema yang sama di sini agar Node.js tidak error require.
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
    hasShop: { type: Boolean, default: false },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', default: null, index: true }, // Field baru
    createdAt: { type: Date, default: Date.now },
});

// Pencegahan Re-deklarasi Model
const User = mongoose.models.User || mongoose.model("User", UserSchema);
// -------------------------------------------------------------

async function connectDB() {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI); // Cukup URI saja
        console.log('✅ Terhubung ke MongoDB.');
    }
}
async function migrate() {
    await connectDB();
    
    console.log('--- Memulai Migrasi: Menambahkan shopId ke semua user lama ---');

    try {
        // Operasi BulkWrite sangat cepat dan direkomendasikan untuk migrasi
        const result = await User.updateMany(
            // Query: Hanya user yang belum punya field shopId
            { shopId: { $exists: false } }, 
            // Update: Set shopId ke null dan hasShop ke false (jika belum ada)
            { $set: { shopId: null, hasShop: false } }
        );

        console.log(`🎉 Migrasi berhasil! ${result.modifiedCount} dokumen user diperbarui.`);

    } catch (error) {
        console.error('❌ Gagal menjalankan migrasi:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Koneksi MongoDB ditutup.');
    }
}

migrate();