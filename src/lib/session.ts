import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AuthTokenPayload } from "./auth";
import { createAuthToken, verifyAuthToken } from "./auth";

// IMPORT PENTING: Koneksi ke DB & Model
import connectDB from "@/lib/mongodb";
import User from "@/models/User"; 

const COOKIE_NAME = "seasnacky_session";
const ONE_DAY = 60 * 60 * 24;

export async function createSessionResponse<T>(
  payload: AuthTokenPayload,
  body: T,
  options?: { remember?: boolean; status?: number }
) {
  const token = await createAuthToken(
    payload,
    options?.remember ? "30d" : "7d"
  );
  
  const response = NextResponse.json(body, { status: options?.status ?? 200 });
  
  // Set Cookie
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: options?.remember ? ONE_DAY * 30 : ONE_DAY * 7,
    path: "/",
  });
  
  return response;
}

export function clearSession() {
  const response = NextResponse.json(
    { message: "Logout berhasil." },
    { status: 200 }
  );
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    expires: new Date(0),
    path: "/",
  });
  return response;
}

export async function getSessionCookie() {
  const cookieStore = cookies();
  return (await cookieStore).get(COOKIE_NAME)?.value ?? null;
}

// FUNGSI UTAMA: Mengambil User Asli dari MongoDB
export async function getAuthUser() {
  const token = await getSessionCookie();
  if (!token) return null;

  try {
    // 1. Verifikasi Token
    const verified = await verifyAuthToken(token);
    if (!verified || !verified.sub) return null;

    // 2. Koneksi DB
    await connectDB();

    // 3. Cari User di MongoDB berdasarkan ID (sub)
    // .select("-password") artinya jangan ambil field password
    const user = await User.findById(verified.sub).select("-password");

    if (!user) return null;

    // 4. Kembalikan data user + payload token
    // Kita gabungkan data token dengan data real-time dari DB (penting untuk role/hasShop)
    return {
      ...verified,
      role: user.role,
      hasShop: user.hasShop,
      _id: user._id.toString(), // Pastikan ID jadi string
      name: user.name,
      email: user.email
    };

  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}