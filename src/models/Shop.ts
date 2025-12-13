// File: src/models/Shop.ts

import mongoose, { Schema } from "mongoose";

const ShopSchema = new mongoose.Schema({
    // Nama Toko (Wajib)
    name: { 
        type: String, 
        required: [true, "Nama toko wajib diisi"], 
        trim: true 
    },
    
    // Deskripsi Toko (Opsional)
    description: { 
        type: String, 
        default: "" 
    },
    
    // Alamat Toko (Wajib)
    address: { 
        type: String, 
        required: [true, "Alamat toko wajib diisi"] 
    },

    // Informasi Rekening untuk Pembayaran
    bankName: {
        type: String,
        default: ""
    },
    
    bankAccountNumber: {
        type: String,
        default: ""
    },
    
    bankAccountName: {
        type: String,
        default: ""
    },

    // ID Seller: Menautkan Toko ini ke User Seller tertentu (Wajib)
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Satu seller hanya boleh punya satu toko
        index: true
    },
    
    // Status Persetujuan Admin (Default: PENDING)
    status: {
        type: String,
        enum: ['active', 'pending', 'suspended'],
        default: 'pending', // KRITIS: Menunggu persetujuan Admin
    },
    
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Shop = mongoose.models.Shop || mongoose.model("Shop", ShopSchema);

export default Shop;