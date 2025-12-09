import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    await connectDB();

    // Cek apakah email sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", data: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Gagal mendaftar" }, { status: 500 });
  }
}