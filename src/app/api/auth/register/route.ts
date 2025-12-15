// File: src/app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import logger from "@/lib/logger";

export async function POST(req: Request) {
    try {
        // Ambil data dari body request
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Data tidak lengkap (Nama, Email, atau Password hilang)" }, { status: 400 });
        }

        await connectDB();

        // Cek apakah email sudah ada
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email sudah terdaftar. Silakan gunakan email lain atau login." }, { status: 400 });
        }

        // Enkripsi password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat user baru
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            
            // PERBAIKAN KRITIS: Mengganti "user" menjadi "buyer"
            // Karena enum Mongoose di model User hanya menerima 'buyer', 'seller', atau 'admin'.
            role: "buyer", // Default role
            
            // Karena ini adalah pendaftaran awal, pastikan hasShop dan shopId default
            hasShop: false, 
            shopId: null,
        });

        // Hapus password dari objek sebelum dikirim ke client (opsional, tapi disarankan)
        const userResponse = newUser.toObject();
        delete userResponse.password;

        logger.info(`User baru terdaftar: ${newUser.name || newUser.email}`, {
            source: "API Auth Register",
            userId: newUser._id.toString(),
            email: newUser.email,
        });

        return NextResponse.json(
            { 
                message: "Registrasi berhasil", 
                data: userResponse 
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Register Error:", error);
        
        logger.error(`Registration error: ${error.message}`, {
            source: "API Auth Register",
            error: error.message,
            stack: error.stack,
        });
        
        // Tambahkan penanganan error validasi Mongoose untuk informasi lebih baik
        if (error.name === 'ValidationError') {
            return NextResponse.json({ error: error.message }, { status: 422 });
        }
        
        return NextResponse.json({ error: "Gagal mendaftar. Terjadi error server internal." }, { status: 500 });
    }
}