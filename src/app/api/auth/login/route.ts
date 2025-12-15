// File: seasnacky/src/app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs"; 
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { createSessionResponse } from "@/lib/session";
import logger from "@/lib/logger"; 

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const parsed = LoginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Input tidak valid" }, { status: 400 });
        }
        const { email, password } = parsed.data;

        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            logger.error(`Login gagal: Email tidak ditemukan - ${email}`, {
                source: "API Auth Login",
                email: email,
                reason: "Email tidak terdaftar"
            });
            return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.error(`Login gagal: Password salah untuk ${email}`, {
                source: "API Auth Login",
                email: email,
                userId: user._id.toString(),
                reason: "Password tidak cocok"
            });
            return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
        }

        // Log successful login
        logger.info(`User ${user.name || user.email} login berhasil`, {
            source: "API Auth Login",
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // 5. Buat Session & Cookie
        const payload = {
            // KRITIS: Gunakan 'sub' (subject) untuk ID User, karena getAuthUser membaca ini
            sub: user._id.toString(), 
            email: user.email,
            role: user.role,
            hasShop: user.hasShop,
            name: user.name, // Tambahkan name dan email ke payload untuk fallback
        };

        // Mengembalikan Response dengan cookie yang sudah diatur
        return await createSessionResponse(payload, { 
            message: "Login Berhasil",
            user: { 
                id: user._id.toString(), // Pastikan ID dikirim kembali ke client setelah login
                name: user.name, 
                email: user.email, 
                role: user.role,
                hasShop: user.hasShop
            } 
        });

    } catch (error: any) {
        console.error("Login Error:", error);
        logger.error(`Login error: ${error.message}`, {
            source: "API Auth Login",
            error: error.message,
            stack: error.stack,
        });
        return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
    }
}