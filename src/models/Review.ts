import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  comment: string;
  helpful: number; // Jumlah orang yang vote "helpful"
  verified: boolean; // Apakah user sudah beli produk ini
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false, // Set true jika user sudah beli produk
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk query yang sering digunakan
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true }); // Satu user hanya bisa review 1x per produk

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
