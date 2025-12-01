import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Validasi Input
const RegisterSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email salah"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validasi Zod
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    
    const { name, email, password } = parsed.data;

    // 2. Konek Database
    await connectDB();

    // 3. Cek Email Sudah Ada?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar!" }, { status: 400 });
    }

    // 4. Hash Password (Enkripsi)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Simpan User Baru
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "buyer", // Default role
    });

    return NextResponse.json({ 
      success: true, 
      message: "Registrasi berhasil! Silakan login.",
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}