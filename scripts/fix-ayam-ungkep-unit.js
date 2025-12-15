// Script untuk memperbaiki unit produk tertentu
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://disyaauliashafa_db:seasnacky123@cluster0.sy5zadd.mongodb.net/seasnacky?retryWrites=true&w=majority&appName=Cluster0';

const ProductSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    unit: {
        type: String,
        required: true,
        default: 'kg',
        enum: ['kg', 'gram', 'pcs', 'pack', 'box', 'liter', 'ml', 'dozen']
    },
    category: { type: String, enum: ["mentah", "olahan"], required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    countInStock: { type: Number, required: true, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function fixAyamUngkepUnit() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find the Ayam Ungkep product
        const ayamUngkep = await Product.findOne({ 
            name: /Ayam Ungkep/i 
        });

        if (!ayamUngkep) {
            console.log('❌ Produk Ayam Ungkep tidak ditemukan');
            await mongoose.connection.close();
            return;
        }

        console.log(`\n📦 Found product: ${ayamUngkep.name}`);
        console.log(`   Current unit: ${ayamUngkep.unit}`);
        console.log(`   ID: ${ayamUngkep._id}`);

        // Update to pcs
        ayamUngkep.unit = 'pcs';
        await ayamUngkep.save();

        console.log(`\n✅ Successfully updated unit to: pcs`);
        console.log(`   Product: ${ayamUngkep.name}`);
        console.log(`   New unit: ${ayamUngkep.unit}`);

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixAyamUngkepUnit();
