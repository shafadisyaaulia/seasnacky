import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const secretKey = process.env.JWT_SECRET || "rahasia-negara-seasnacky";
const encodedKey = new TextEncoder().encode(secretKey);
const COOKIE_NAME = "seasnacky_session";

// ----------------------------------------------------------------------
// 1. FUNGSI BARU: createSession (Khusus untuk Server Action / API Route biasa)
// Ini yang dicari oleh error build tadi!
// ----------------------------------------------------------------------
export async function createSession(payload: any) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Hari
  
  // Buat Token JWT
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  // Set Cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

// ----------------------------------------------------------------------
// 2. FUNGSI LAMA: createSessionResponse (Tetap dipertahankan biar kode lain gak rusak)
// ----------------------------------------------------------------------
export async function createSessionResponse<T>(
  payload: any,
  body: T,
  options?: { remember?: boolean; status?: number }
) {
  // Logic JWT
  const expiresAt = new Date(Date.now() + (options?.remember ? 30 : 7) * 24 * 60 * 60 * 1000);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(options?.remember ? "30d" : "7d")
    .sign(encodedKey);
  
  const response = NextResponse.json(body, { status: options?.status ?? 200 });
  
  // Set Cookie di Response
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
  
  return response;
}

// ----------------------------------------------------------------------
// 3. FUNGSI DELETE SESSION (Logout)
// ----------------------------------------------------------------------
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
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

// ----------------------------------------------------------------------
// 4. FUNGSI AUTH: Ambil User Login (Penting untuk Header & Proteksi)
// ----------------------------------------------------------------------
export async function getAuthUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;

  if (!session) return null;

  try {
    // 1. Verifikasi Token JWT
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    if (!payload || !payload.sub) return null;

    // 2. Cek ke Database MongoDB (Data User Real-time)
    //    Ini penting untuk memastikan user belum dihapus dan role-nya update
    try {
        await connectDB();
        const user = await User.findById(payload.sub).select("-password");
        
        if (!user) return null;

        // Return Data Gabungan (Payload Token + Data Database)
        return {
            ...payload,
            sub: user._id.toString(), // Pastikan sub adalah string ID
            role: user.role,
            name: user.name,
            email: user.email,
            hasShop: user.hasShop || false,
        };
    } catch (dbError) {
        // Fallback: Jika DB error/lambat, kembalikan data dari token saja (biar gak crash total)
        console.warn("Session DB Lookup Failed, using token payload only:", dbError);
        return payload;
    }

  } catch (error) {
    // Token tidak valid/expired
    return null;
  }
}

// ----------------------------------------------------------------------
// 5. FUNGSI: Get User from Request (untuk API routes)
// ----------------------------------------------------------------------
export async function getUserFromRequest(request: NextRequest) {
  const session = request.cookies.get(COOKIE_NAME)?.value;

  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    if (!payload || !payload.sub) return null;

    try {
      await connectDB();
      const user = await User.findById(payload.sub).select("-password");
      
      if (!user) return null;

      return {
        id: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
        hasShop: user.hasShop || false,
      };
    } catch (dbError) {
      console.warn("Session DB Lookup Failed:", dbError);
      return {
        id: payload.sub as string,
        role: payload.role as string,
        name: payload.name as string,
        email: payload.email as string,
      };
    }
  } catch (error) {
    return null;
  }
}