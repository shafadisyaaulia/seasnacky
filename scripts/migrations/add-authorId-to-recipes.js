// Migration: Add authorId to existing recipes
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/seasnacky';

async function migrateRecipes() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Recipe = mongoose.model('Recipe', new mongoose.Schema({
      title: String,
      authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    }));

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      role: String,
    }));

    // Find recipes without authorId
    const recipesWithoutAuthor = await Recipe.find({ 
      $or: [
        { authorId: { $exists: false } },
        { authorId: null }
      ]
    });

    console.log(`📝 Found ${recipesWithoutAuthor.length} recipes without authorId`);

    if (recipesWithoutAuthor.length === 0) {
      console.log('✨ All recipes already have authorId!');
      await mongoose.connection.close();
      return;
    }

    // Strategy: Link recipes to their product sellers if possible
    let updatedCount = 0;
    for (const recipe of recipesWithoutAuthor) {
      let authorId = null;

      // Try to find author from related products
      if (recipe.relatedProducts && recipe.relatedProducts.length > 0) {
        const Product = mongoose.model('Product', new mongoose.Schema({
          name: String,
          sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        }));

        const product = await Product.findById(recipe.relatedProducts[0]);
        if (product && product.sellerId) {
          authorId = product.sellerId;
        }
      }

      // If still no author, assign to first seller found
      if (!authorId) {
        const firstSeller = await User.findOne({ role: 'seller' });
        if (firstSeller) {
          authorId = firstSeller._id;
        } else {
          // Last resort: assign to first user
          const firstUser = await User.findOne();
          if (firstUser) {
            authorId = firstUser._id;
          }
        }
      }

      if (authorId) {
        await Recipe.updateOne(
          { _id: recipe._id },
          { $set: { authorId: authorId } }
        );
        updatedCount++;
        console.log(`✅ Updated recipe "${recipe.title}" with authorId`);
      } else {
        console.log(`⚠️ Could not find author for recipe "${recipe.title}"`);
      }
    }

    console.log(`\n✨ Migration complete! Updated ${updatedCount}/${recipesWithoutAuthor.length} recipes`);
    await mongoose.connection.close();
    console.log('🔌 Connection closed');

  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateRecipes();
