import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session"; // Pastikan helper ini ada

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    // Cari user
    const user = await User.findOne({ email });

    // Cek User & Password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // Cek Role Admin
    if (user.role !== "ADMIN" && user.role !== "admin") {
         return NextResponse.json({ error: "Anda bukan Admin!" }, { status: 403 });
    }

    // Buat Session
    await createSession({ sub: user._id, role: user.role });

    return NextResponse.json({ message: "Login Admin Berhasil" });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}