import mongoose, { Schema, Document, Types } from 'mongoose';

// 1. Interface untuk TypeScript (Wajib agar Next.js tidak error)
export interface IProduct extends Document {
  shop: Types.ObjectId; // ID dari Toko yang memiliki produk ini
  name: string;
  slug: string;           // URL-friendly name (Wajib untuk SEO & URL)
  price: number;
  category: 'mentah' | 'olahan'; // Menggunakan enum yang sudah Anda tentukan
  description: string;
  images: string[];       // Array URL gambar
  countInStock: number;   // Stok (Wajib untuk e-commerce)
  isFeatured: boolean;    // Produk unggulan
  createdAt: Date;
  updatedAt: Date;
}

// 2. Schema Mongoose
const ProductSchema: Schema = new mongoose.Schema(
  {
    shop: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Shop', 
      required: true 
    },
    name: { 
      type: String, 
      required: true,
      trim: true // Menghapus spasi di awal/akhir nama
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true, // Tidak boleh ada slug yang sama
      index: true // Dioptimalkan untuk pencarian
    },
    price: { 
      type: Number, 
      required: true,
      min: 0 // Harga tidak boleh negatif
    },
    category: { 
      type: String, 
      enum: ["mentah", "olahan"], 
      required: true 
    },
    description: {
      type: String,
      required: true // Deskripsi wajib
    },
    images: {
      type: [String], // Array of strings (URLs/paths)
      default: []
    },
    countInStock: { 
      type: Number, 
      required: true, 
      default: 0, 
      min: 0 // Stok tidak boleh negatif
    },
    isFeatured: { 
      type: Boolean, 
      default: false 
    },
  },
  {
    timestamps: true, // Menggantikan manual createdAt dan menambahkan updatedAt
  }
);

// Pengecekan agar tidak membuat model berulang kali (Penting di Next.js)
const Product = (mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema)) as mongoose.Model<IProduct>;

export default Product;