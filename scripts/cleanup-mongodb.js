// Script untuk membersihkan collections duplikat/tidak terpakai di MongoDB
// Run dengan: node scripts/cleanup-mongodb.js

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

// Collections yang TIDAK DIPAKAI (akan dihapus)
const collectionsToDelete = [
  'Cart',       // Duplikat dari carts
  'CartItem',   // Tidak perlu (nested di carts)
  'Order',      // Duplikat dari orders
  'OrderItem',  // Tidak perlu (nested di orders)
  'Store',      // Duplikat dari shops
];

// Collections yang DIPAKAI (jangan dihapus)
const validCollections = [
  'carts',
  'logs',
  'orders',
  'products',
  'recipes',
  'regions',
  'reviews',
  'shops',
  'tips',
  'users',
  'wishlists',
];

const cleanupMongoDB = async () => {
  try {
    await connectDB();

    const db = mongoose.connection.db;
    
    // List semua collections yang ada
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('\n📋 Collections yang ada di database:');
    collectionNames.forEach(name => {
      const status = validCollections.includes(name) ? '✅' : '❌';
      console.log(`${status} ${name}`);
    });

    console.log('\n🗑️  Menghapus collections yang tidak terpakai...\n');

    let deletedCount = 0;
    
    for (const collectionName of collectionsToDelete) {
      if (collectionNames.includes(collectionName)) {
        try {
          await db.dropCollection(collectionName);
          console.log(`✅ Berhasil hapus: ${collectionName}`);
          deletedCount++;
        } catch (error) {
          console.log(`⚠️  Gagal hapus ${collectionName}: ${error.message}`);
        }
      } else {
        console.log(`⏭️  Skip (tidak ada): ${collectionName}`);
      }
    }

    console.log(`\n✅ Selesai! ${deletedCount} collections dihapus.`);
    
    // List collections setelah cleanup
    const collectionsAfter = await db.listCollections().toArray();
    console.log('\n📋 Collections yang tersisa:');
    collectionsAfter.forEach(c => console.log(`   - ${c.name}`));

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error saat cleanup:', error.message);
    process.exit(1);
  }
};

// Jalankan script
cleanupMongoDB();
