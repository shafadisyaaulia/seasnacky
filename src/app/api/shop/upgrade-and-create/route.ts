// File: src/app/api/shop/upgrade-and-create/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Shop from "@/models/Shop";
import User from "@/models/User";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const { name, description, address, userId } = body; 

        // 1. Validasi Input
        if (!name || !address || !userId) {
            return NextResponse.json({ error: "Nama Toko, Alamat, dan ID User wajib diisi." }, { status: 400 });
        }
        
        // 2. Cek User
        const user = await User.findById(userId);
        console.log("[API/upgrade-and-create] userId diterima:", userId);
        console.log("[API/upgrade-and-create] user ditemukan:", user);
        if (!user) {
            return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
        }
        
        // Cek duplikasi: Jika user sudah punya shopId (berarti sudah mendaftar)
        if (user.shopId) {
            console.log("[API/upgrade-and-create] User sudah punya shopId:", user.shopId);
            return NextResponse.json({ error: "Anda sudah mendaftar toko dan sedang menunggu persetujuan." }, { status: 409 });
        }

        // 3. Buat Dokumen Toko Baru (Shop)
        const newShop = await Shop.create({
            name,
            description,
            address,
            sellerId: new mongoose.Types.ObjectId(userId),
            status: 'pending', // KRITIS: Status Awal PENDING
        });
        
        // 4. Update Dokumen User: Hanya tautkan shopId dan hasShop
        // ROLE TIDAK DIUBAH DARI BUYER
        await User.findByIdAndUpdate(userId, {
            $set: {
                shopId: newShop._id, 
                hasShop: true, // Menandakan bahwa pendaftaran toko sudah diajukan
                // role: 'buyer' (tetap)
            }
        });

        // 5. Sukses
        return NextResponse.json({
            message: "Pendaftaran toko berhasil diajukan. Menunggu persetujuan Admin!",
            shop: newShop
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error Open Shop (Pending Approval):", error);
        
        if (error.code === 11000) { 
            return NextResponse.json({ error: "User ini sudah pernah mendaftar toko (Key Duplikat)." }, { status: 409 });
        }
        
        return NextResponse.json({ error: error.message || "Gagal memproses pendaftaran toko." }, { status: 500 });
    }
}