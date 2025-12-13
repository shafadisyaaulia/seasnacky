/**
 * Script untuk membuat user ADMIN
 * Jalankan: node scripts/create-admin.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI tidak ditemukan di .env.local');
  process.exit(1);
}

// Schema User (copy dari models/User.ts)
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['BUYER', 'SELLER', 'ADMIN'], default: 'BUYER' },
    address: { type: String },
    phone: { type: String },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Data admin
    const adminData = {
      name: 'Admin SeaSnacky',
      email: 'admin@seasnacky.com',
      password: 'admin123', // Password default
      role: 'ADMIN',
    };

    // Cek apakah admin sudah ada
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Admin dengan email', adminData.email, 'sudah ada!');
      console.log('📝 Role:', existingAdmin.role);
      
      // Update role jika bukan ADMIN
      if (existingAdmin.role !== 'ADMIN') {
        console.log('🔄 Mengubah role menjadi ADMIN...');
        existingAdmin.role = 'ADMIN';
        await existingAdmin.save();
        console.log('✅ Role berhasil diubah menjadi ADMIN!');
      }
      
      console.log('\n📧 Email:', adminData.email);
      console.log('🔑 Password:', adminData.password);
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Buat admin baru
    const admin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: 'ADMIN',
    });

    await admin.save();
    
    console.log('\n✅ Admin berhasil dibuat!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Role:', admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🚀 Login di: http://localhost:3000/admin/login');
    console.log('📊 Dashboard: http://localhost:3000/dashboard/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

createAdmin();
