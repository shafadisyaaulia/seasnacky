// Script untuk memeriksa dan memperbaiki unit produk
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

async function checkAndFixProductUnits() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all products
        const products = await Product.find({});
        console.log(`\n📦 Found ${products.length} products in database\n`);

        let fixedCount = 0;

        for (const product of products) {
            console.log(`\n📝 Product: ${product.name}`);
            console.log(`   ID: ${product._id}`);
            console.log(`   Current Unit: ${product.unit || 'NOT SET'}`);
            console.log(`   Price: Rp ${product.price.toLocaleString('id-ID')}`);
            
            // Check if unit is missing or wrong
            if (!product.unit) {
                console.log(`   ⚠️  Unit is missing! Setting to default 'kg'`);
                product.unit = 'kg';
                await product.save();
                fixedCount++;
            }
        }

        console.log(`\n\n✅ Check complete!`);
        console.log(`   Total products: ${products.length}`);
        console.log(`   Fixed: ${fixedCount}`);
        console.log(`\n📋 Summary by unit:`);
        
        const unitSummary = {};
        for (const product of products) {
            const unit = product.unit || 'undefined';
            unitSummary[unit] = (unitSummary[unit] || 0) + 1;
        }
        
        Object.entries(unitSummary).forEach(([unit, count]) => {
            console.log(`   - ${unit}: ${count} products`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkAndFixProductUnits();
