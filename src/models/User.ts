// File: models/User.ts

import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Role: Membatasi Buyer, Seller, atau Admin
  role: { 
    type: String, 
    enum: ["buyer", "seller", "admin"], 
    default: "buyer" 
  },
  
  // Status Toko (untuk Onboarding Merchant)
  hasShop: { type: Boolean, default: false },

  // shopId: ID Toko yang dimiliki oleh Seller (Hanya diisi jika role: 'seller')
  shopId: {
    type: Schema.Types.ObjectId, // Menggunakan ObjectId jika merujuk ke model Shop
    ref: 'Shop', // Asumsi nama model Toko Anda adalah 'Shop'
    default: null, // Defaultnya null sampai seller berhasil onboarding
    index: true // Penting untuk pencarian cepat
  },

  createdAt: { type: Date, default: Date.now },
});

// Pencegahan Re-deklarasi Model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;