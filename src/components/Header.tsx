"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import { User, Store, LogOut, LayoutDashboard, ShoppingCart, Heart } from "lucide-react"; // Ikon biar cantik

export default function Header() {
  // 1. Tambahkan 'role' di tipe state user
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const cart = useContext(CartContext);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hitung Keranjang
  useEffect(() => {
    if (!cart) return;
    setCartCount(cart.items.reduce((s: number, it: any) => s + (it.quantity || 0), 0));
  }, [cart?.items]);

  // Ambil Data User (Termasuk Role)
  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((json) => {
        console.log("API /api/me response:", json); // Debug log
        setUser(json?.data ?? null);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setUser(null);
      });
  }, []);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    setOpen(false);
    router.refresh(); // Refresh halaman biar header update
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-cyan-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* LOGO with Wave Animation */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="relative w-11 h-11 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 rounded-full opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative w-11 h-11 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Image 
                src="/seasnacky-logo.png" 
                alt="SeaSnacky Logo" 
                width={44}
                height={44}
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
          </div>
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 animate-gradient bg-[length:200%_auto] group-hover:scale-105 transition-transform">
            SeaSnacky
          </span>
        </Link>

        {/* MENU TENGAH */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="relative text-sm font-semibold text-slate-700 hover:text-cyan-600 transition-colors group">
            <span>Belanja</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/recipes" className="relative text-sm font-semibold text-slate-700 hover:text-cyan-600 transition-colors group">
            <span>Resep</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/tips" className="relative text-sm font-semibold text-slate-700 hover:text-cyan-600 transition-colors group">
            <span>Tips & Artikel</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          {/* Menu Dashboard di Navbar Utama kita hilangkan biar rapi, pindah ke dropdown */}
        </nav>

        {/* MENU KANAN */}
        <div className="flex items-center gap-4">
          
          {/* Icon Keranjang (Hanya muncul jika user login/guest) */}
          <Link href="/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* LOGIKA LOGIN / DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            {!user ? (
              // KONDISI: BELUM LOGIN
              <button
                onClick={async () => {
                  // Logout dulu jika ada session tersembunyi
                  await fetch("/api/logout", { method: "POST" });
                  router.push("/login");
                }}
                className="rounded-full bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition"
              >
                Masuk
              </button>
            ) : (
              // KONDISI: SUDAH LOGIN
              <div>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-700 font-medium hover:border-blue-300 hover:bg-blue-50 transition shadow-sm"
                >
                  {/* Avatar Inisial */}
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name?.split(" ")[0]}</span>
                  <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* DROPDOWN MENU */}
                {open && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50">
                    
                    {/* Header Dropdown */}
                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                      <p className="text-xs text-gray-500">Halo,</p>
                      <p className="font-bold text-gray-800 truncate">{user.name}</p>
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 border border-gray-200 uppercase font-bold tracking-wide">
                        {user.role}
                      </span>
                    </div>

                    <ul className="space-y-1">
                      {/* Conditional Menu Based on Role */}
                      {user.role === "ADMIN" || user.role === "admin" ? (
                        // ADMIN: Dashboard Admin + Keluar
                        <>
                          <li>
                            <Link
                              href="/dashboard/admin"
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                            >
                              <LayoutDashboard size={16} className="text-slate-400" />
                              Dashboard Admin
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                            >
                              <LogOut size={16} />
                              Keluar
                            </button>
                          </li>
                        </>
                      ) : (
                        // BUYER/SELLER: Full Menu
                        <>
                          {/* 1. Link ke PROFIL (Umum) */}
                          <li>
                            <Link
                              href="/profile"
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                            >
                              <User size={16} className="text-slate-400" />
                              Profil Saya
                            </Link>
                          </li>

                          {/* 1.5. Wishlist (Untuk semua user) */}
                          <li>
                            <Link
                              href="/wishlist"
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                            >
                              <Heart size={16} className="text-slate-400" />
                              Wishlist Saya
                            </Link>
                          </li>

                          {/* 1.6. Pesanan Saya (Untuk semua user) */}
                          <li>
                            <Link
                              href="/user/orders"
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                            >
                              <ShoppingCart size={16} className="text-slate-400" />
                              Pesanan Saya
                            </Link>
                          </li>

                          {/* 2. Link ke TOKO (Logika IF-ELSE) */}
                          <li>
                            {user.role === "SELLER" || user.role === "seller" ? (
                              // JIKA SELLER: Masuk ke Dashboard Toko
                              <Link
                                href="/dashboard/seller"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                              >
                                <Store size={16} />
                                Toko Saya
                              </Link>
                            ) : (
                              // JIKA USER BIASA: Buka Toko
                              <Link
                                href="/open-shop"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 transition"
                              >
                                <LayoutDashboard size={16} />
                                Buka Toko Gratis
                              </Link>
                            )}
                          </li>

                          <div className="my-2 border-t border-gray-100"></div>

                          {/* 3. LOGOUT */}
                          <li>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                            >
                              <LogOut size={16} />
                              Keluar
                            </button>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}