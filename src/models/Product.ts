// File: src/models/Product.ts (REVISI KRITIS)

import mongoose, { Schema, Document, Types } from 'mongoose';

// 1. Interface untuk TypeScript
export interface IProduct extends Document {
    shop: Types.ObjectId; 
    sellerId: Types.ObjectId; // <-- [BARU] Wajib ditambahkan
    name: string;
    slug: string; 
    price: number;
    category: 'mentah' | 'olahan'; 
    description: string;
    images: string[]; 
    countInStock: number; 
    isFeatured: boolean; 
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
        // [BARU] Tambahkan field sellerId
        sellerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', // Asumsi referensi ke model User
            required: true 
        },
        name: { 
            type: String, 
            required: true,
            trim: true
        },
        slug: { 
            type: String, 
            required: true, 
            unique: true, 
            index: true
        },
        // ... (Field lain tetap sama)
        price: { 
            type: Number, 
            required: true,
            min: 0
        },
        category: { 
            type: String, 
            enum: ["mentah", "olahan"], 
            required: true 
        },
        description: {
            type: String,
            required: true
        },
        images: {
            type: [String],
            default: []
        },
        countInStock: { // Ini adalah field 'stock' Anda
            type: Number, 
            required: true, 
            default: 0, 
            min: 0
        },
        isFeatured: { 
            type: Boolean, 
            default: false 
        },
    },
    {
        timestamps: true,
    }
);

const Product = (mongoose.models.Product ||
    mongoose.model<IProduct>('Product', ProductSchema)) as mongoose.Model<IProduct>;

export default Product;