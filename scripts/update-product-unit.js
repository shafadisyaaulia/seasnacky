// Script utilitas untuk mengupdate unit produk berdasarkan nama atau ID
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

async function updateProductUnit(productNameOrId, newUnit) {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Try to find by ID first, then by name
        let product = await Product.findById(productNameOrId).catch(() => null);
        
        if (!product) {
            product = await Product.findOne({ 
                name: new RegExp(productNameOrId, 'i') 
            });
        }

        if (!product) {
            console.log(`❌ Produk "${productNameOrId}" tidak ditemukan`);
            await mongoose.connection.close();
            return;
        }

        console.log(`\n📦 Found product: ${product.name}`);
        console.log(`   Current unit: ${product.unit}`);
        console.log(`   ID: ${product._id}`);

        // Validate new unit
        const validUnits = ['kg', 'gram', 'pcs', 'pack', 'box', 'liter', 'ml', 'dozen'];
        if (!validUnits.includes(newUnit)) {
            console.log(`\n❌ Invalid unit: ${newUnit}`);
            console.log(`   Valid units: ${validUnits.join(', ')}`);
            await mongoose.connection.close();
            return;
        }

        // Update unit
        product.unit = newUnit;
        await product.save();

        console.log(`\n✅ Successfully updated unit!`);
        console.log(`   Product: ${product.name}`);
        console.log(`   Old unit: ${product.unit}`);
        console.log(`   New unit: ${newUnit}`);

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('\n📖 Usage: node update-product-unit.js <product-name-or-id> <new-unit>');
    console.log('\nValid units: kg, gram, pcs, pack, box, liter, ml, dozen');
    console.log('\nExample:');
    console.log('  node scripts/update-product-unit.js "Ayam Ungkep" pcs');
    console.log('  node scripts/update-product-unit.js 693f41bc4c04b226b84b6379 pcs');
    process.exit(0);
}

const [productNameOrId, newUnit] = args;
updateProductUnit(productNameOrId, newUnit);
