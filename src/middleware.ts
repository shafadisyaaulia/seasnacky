// File: seasnacky/src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Konfigurasi Kunci Rahasia JWT (Harus sama dengan lib/session.ts)
const secretKey = process.env.JWT_SECRET || "rahasia-negara-seasnacky";
const encodedKey = new TextEncoder().encode(secretKey);
const USER_COOKIE_NAME = "seasnacky_session";

// --- Fungsi Verifikasi Token ---
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

    const userSession = request.cookies.get(USER_COOKIE_NAME)?.value;
    const isAuthRoute = path.startsWith('/dashboard') || path.startsWith('/open-shop');
    const isSellerRoute = path.startsWith('/dashboard/seller');
    const isAdminRoute = path.startsWith('/dashboard/admin');

    let userPayload: any = null;
    if (userSession) {
        userPayload = await verifyUserToken(userSession);
    }
    const isAuthenticated = !!userPayload;

    // 1. Proteksi Halaman Login/Register (Jika sudah login, redirect berdasarkan role)
    if ((path.startsWith("/login") || path.startsWith("/register")) && isAuthenticated) {
        if (userPayload?.role === 'ADMIN' || userPayload?.role === 'admin') {
            return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        } else if (userPayload?.role === 'SELLER' || userPayload?.role === 'seller') {
            return NextResponse.redirect(new URL("/dashboard/seller", request.url));
        } else {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
    
    // 2. Proteksi Halaman Dashboard (Membutuhkan login)
    if (isAuthRoute && !isAuthenticated) {
        url.pathname = '/login';
        url.searchParams.set('redirect', path);
        return NextResponse.redirect(url);
    }
    
    // 3. Proteksi Halaman Admin (Membutuhkan role 'ADMIN')
    if (isAdminRoute && isAuthenticated) {
        if (userPayload?.role !== 'ADMIN' && userPayload?.role !== 'admin') {
            // Log ke console saja (middleware tidak bisa akses DB)
            console.warn('[MIDDLEWARE] Unauthorized access attempt:', {
                userId: userPayload?.sub || userPayload?.id,
                email: userPayload?.email,
                role: userPayload?.role,
                attemptedPath: path,
            });
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
    
    // 4. Proteksi Halaman Seller (Membutuhkan role 'SELLER')
    if (isSellerRoute && isAuthenticated) {
        if (userPayload?.role !== 'SELLER' && userPayload?.role !== 'seller') {
            // Log ke console saja (middleware tidak bisa akses DB)
            console.warn('[MIDDLEWARE] Unauthorized access attempt:', {
                userId: userPayload?.sub || userPayload?.id,
                email: userPayload?.email,
                role: userPayload?.role,
                attemptedPath: path,
            });
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
    
    // Izinkan akses ke semua halaman lainnya
    return NextResponse.next();
}

// --- KONFIGURASI MATCHER ---
export const config = {
    matcher: [
        "/dashboard/:path*", 
        "/open-shop", 
        "/login", 
        "/register",
        "/((?!_next/static|_next/image|favicon.ico|api|.*\\.png$).*)", 
    ],
};