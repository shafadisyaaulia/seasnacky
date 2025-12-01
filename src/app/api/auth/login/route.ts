import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs"; // Pastikan sudah npm install bcryptjs
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { createSessionResponse } from "@/lib/session"; // Fungsi yang sudah kita perbaiki tadi

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validasi Input
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Input tidak valid" }, { status: 400 });
    }
    const { email, password } = parsed.data;

    // 2. Konek Database
    await connectDB();

    // 3. Cari User by Email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // 4. Cek Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // 5. Buat Session & Cookie
    // Payload ini yang akan disimpan di cookie user
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role, // 'buyer', 'seller', atau 'admin'
      hasShop: user.hasShop
    };

    return await createSessionResponse(payload, { 
      success: true,
      user: { 
        name: user.name, 
        email: user.email, 
        role: user.role,
        hasShop: user.hasShop
      } 
    });

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}