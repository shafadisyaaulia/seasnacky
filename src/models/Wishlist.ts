import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  createdAt: Date;
}

const WishlistSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk query yang sering digunakan
WishlistSchema.index({ userId: 1, createdAt: -1 });
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true }); // User tidak bisa tambah produk yang sama 2x

export default mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);
