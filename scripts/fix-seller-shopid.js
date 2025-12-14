// Script untuk memperbaiki shopId yang hilang pada user seller
// Jalankan dengan: node scripts/fix-seller-shopid.js

const mongoose = require('mongoose');

async function fixSellerShopId() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/seasnacky';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define schemas
    const UserSchema = new mongoose.Schema({}, { strict: false });
    const ShopSchema = new mongoose.Schema({}, { strict: false });
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Shop = mongoose.models.Shop || mongoose.model('Shop', ShopSchema);

    // Find all active shops
    const shops = await Shop.find({ status: 'active' });
    console.log(`\n🔍 Found ${shops.length} active shops`);

    let fixedCount = 0;

    for (const shop of shops) {
      // Check if user has correct shopId
      const user = await User.findById(shop.sellerId);
      
      if (!user) {
        console.log(`⚠️  Shop "${shop.name}" has invalid sellerId`);
        continue;
      }

      if (user.role !== 'seller' || !user.shopId || user.shopId.toString() !== shop._id.toString()) {
        console.log(`\n🔧 Fixing user: ${user.name} (${user.email})`);
        console.log(`   - Old role: ${user.role} → New role: seller`);
        console.log(`   - Old shopId: ${user.shopId} → New shopId: ${shop._id}`);
        
        await User.findByIdAndUpdate(user._id, {
          role: 'seller',
          hasShop: true,
          shopId: shop._id
        });
        
        fixedCount++;
      } else {
        console.log(`✅ User ${user.name} sudah benar`);
      }
    }

    console.log(`\n✨ Selesai! ${fixedCount} user diperbaiki`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixSellerShopId();
