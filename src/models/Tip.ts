import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITip extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string; // 'penyimpanan', 'pemilihan', 'pengolahan', 'informasi'
  author: Types.ObjectId;
  authorName: string;
  views: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TipSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      required: true,
      enum: ['penyimpanan', 'pemilihan', 'pengolahan', 'informasi'],
      default: 'informasi',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk search dan filter
TipSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
TipSchema.index({ category: 1, published: 1 });
TipSchema.index({ createdAt: -1 });

export default mongoose.models.Tip || mongoose.model<ITip>('Tip', TipSchema);
