// File: seasnacky/src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // <-- Sesuaikan dengan library JWT Anda (Pastikan ini diimpor)

// Konfigurasi Kunci Rahasia JWT (Harus sama dengan lib/session.ts)
const secretKey = process.env.JWT_SECRET || "rahasia-negara-seasnacky";
const encodedKey = new TextEncoder().encode(secretKey);
const USER_COOKIE_NAME = "seasnacky_session";
const ADMIN_COOKIE_NAME = "demo_session"; // Cookie untuk Admin Lama Anda

// --- Fungsi Verifikasi Token (Harus ada) ---
async function verifyUserToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

// --- FUNGSI UTAMA MIDDLEWARE ---
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const url = request.nextUrl.clone();

    // =========================================================
    // A. LOGIKA PROTEKSI RUTE ADMIN LAMA (Menggunakan demo_session)
    // =========================================================
    const isAdminRoute = path.startsWith("/admin");
    const hasDemoSession = request.cookies.has(ADMIN_COOKIE_NAME);

    if (isAdminRoute) {
        if (!hasDemoSession && !path.startsWith("/admin/login") && !path.startsWith("/admin/register")) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        if (hasDemoSession && (path.startsWith("/admin/login") || path.startsWith("/admin/register"))) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    }
    
    // =========================================================
    // B. LOGIKA PROTEKSI RUTE USER & SELLER (Menggunakan seasnacky_session)
    // =========================================================
    
    const userSession = request.cookies.get(USER_COOKIE_NAME)?.value;
    const isAuthRoute = path.startsWith('/dashboard') || path.startsWith('/open-shop');
    const isSellerRoute = path.startsWith('/dashboard/seller'); 

    let userPayload: any = null;
    if (userSession) {
        userPayload = await verifyUserToken(userSession);
    }
    const isAuthenticated = !!userPayload;

    // 1. Proteksi Halaman Login/Register (Jika sudah login, redirect ke /dashboard)
    if ((path.startsWith("/auth/login") || path.startsWith("/auth/regis")) && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    
    // 2. Proteksi Halaman Dashboard Umum & Open Shop (Membutuhkan login)
    if (isAuthRoute && !isAuthenticated) {
        url.pathname = '/auth/login';
        url.searchParams.set('redirect', path);
        return NextResponse.redirect(url);
    }
    
    // 3. Proteksi Halaman Seller (Membutuhkan role 'seller')
    if (isSellerRoute && isAuthenticated) {
        // Cek jika user login tapi BUKAN seller atau statusnya pending (role masih 'buyer')
        if (userPayload?.role !== 'seller') {
            // Redirect ke dashboard utama (halaman pending seller)
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
    
    // Izinkan akses ke semua halaman lainnya
    return NextResponse.next();
}

// --- KONFIGURASI MATCHER ---
export const config = {
    matcher: [
        // Rute Admin
        "/admin/:path*", "/admin/login", "/admin/register",
        // Rute User & Seller
        "/dashboard/:path*", "/open-shop", "/login", "/register",
        // Pengecualian: jangan proses file statis
        "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)", 
    ],
};