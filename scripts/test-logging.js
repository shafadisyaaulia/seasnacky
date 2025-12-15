// Script untuk testing logging system
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/seasnacky';

// Log Schema
const LogSchema = new mongoose.Schema({
  level: { type: String, enum: ["info", "warning", "error"], required: true },
  message: { type: String, required: true },
  source: { type: String }, 
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.models.Log || mongoose.model("Log", LogSchema);

async function testLogging() {
  try {
    console.log('🔌 Menghubungkan ke MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Terhubung ke MongoDB');

    // Buat beberapa log test
    const testLogs = [
      {
        level: 'info',
        message: 'Test log system - Info level',
        source: 'Test Script',
      },
      {
        level: 'warning',
        message: 'Test log system - Warning level',
        source: 'Test Script',
      },
      {
        level: 'error',
        message: 'Test log system - Error level',
        source: 'Test Script',
      },
      {
        level: 'info',
        message: 'Testing real-time logging pada tanggal ' + new Date().toLocaleString('id-ID'),
        source: 'Test Script',
      },
    ];

    console.log('📝 Membuat test logs...');
    for (const logData of testLogs) {
      const log = await Log.create(logData);
      console.log(`✅ Log created: [${log.level.toUpperCase()}] ${log.message}`);
    }

    console.log('\n✨ Test logging berhasil!');
    console.log('🌐 Buka http://localhost:3000/dashboard/admin/logs untuk melihat log');

    await mongoose.connection.close();
    console.log('🔌 Koneksi MongoDB ditutup');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testLogging();
