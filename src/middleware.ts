import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dapatkan cookie "kartu akses demo"
  const hasDemoSession = request.cookies.has("demo_session");

  // Jika mencoba akses halaman admin (selain halaman login DAN register) TAPI tidak punya kartu akses,
  // arahkan ke halaman login.
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/register") && // <-- TAMBAHKAN KONDISI INI
    !hasDemoSession
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Jika sudah punya kartu akses dan mencoba ke halaman login,
  // langsung arahkan ke dasbor.
  if (pathname.startsWith("/admin/login") && hasDemoSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Izinkan akses ke semua halaman lainnya
  return NextResponse.next();
}

// Terapkan middleware ini untuk semua path di bawah /admin
export const config = {
  matcher: ["/admin/:path*", "/admin/login", "/admin/register"], // Pastikan register juga masuk matcher
};
