"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";

// Definisikan tipe User biar typescript ga ngamuk
interface UserData {
  name?: string;
  email?: string;
  role?: string;
  hasShop?: boolean;
}

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  const router = useRouter();
  const cart = useContext(CartContext as any);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hitung jumlah keranjang
  useEffect(() => {
    setCartCount((cart?.items ?? []).reduce((s: number, it: any) => s + (it.quantity || 0), 0));
  }, [cart?.items]);

  // 1. Cek User Login (Arahkan ke API yang benar)
  useEffect(() => {
    fetch("/api/auth/me") // <-- UBAH KE PATH INI
      .then((r) => r.json())
      .then((json) => setUser(json?.user ?? null)) // <-- Sesuaikan dengan response API kita { user: ... }
      .catch(() => setUser(null));
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

  // 2. Logout (Arahkan ke API yang benar)
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }); // <-- UBAH KE PATH INI
    setUser(null);
    router.refresh(); // Refresh biar state bersih
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-lg">
            SS
          </div>
          <span className="text-xl font-semibold text-slate-900">SeaSnacky</span>
        </Link>

        {/* MENU TENGAH */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium text-slate-700 transition hover:text-blue-600">
            Marketplace
          </Link>
          <Link href="/recipes" className="text-sm font-medium text-slate-700 transition hover:text-blue-600">
            Edukasi
          </Link>
        </nav>

        {/* BAGIAN KANAN */}
        <div className="relative flex items-center gap-4">
          
          {/* Ikon Cart (Opsional kalau mau ditampilkan) */}
          <Link href="/cart" className="relative text-slate-600 hover:text-blue-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
             {cartCount > 0 && (
               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                 {cartCount}
               </span>
             )}
          </Link>

          {/* Logic Tombol Login / User Dropdown */}
          {!user ? (
            <Link
              href="/login" // <-- SUDAH DIPERBAIKI (Bukan /user/login lagi)
              className="rounded-full border border-blue-200 px-4 py-2 text-blue-600 font-semibold transition hover:border-blue-500 hover:text-blue-700"
            >
              Masuk
            </Link>
          ) : (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full px-4 py-2 bg-sky-50 text-sky-700 font-semibold shadow hover:bg-sky-200 transition"
              >
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* ISI DROPDOWN */}
              {open && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white p-2 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b mb-1">
                    <p className="text-xs text-gray-500">Login sebagai</p>
                    <p className="text-sm font-semibold truncate">{user.email}</p>
                  </div>

                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="/profile" // <-- Mengarah ke Profil User
                        className="block rounded px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 transition"
                        onClick={() => setOpen(false)}
                      >
                        Profil Saya
                      </Link>
                    </li>

                    {/* LOGIKA SWITCH TOKO / BUKA TOKO */}
                    <li>
                      {user.hasShop ? (
                        <Link
                          href="/dashboard/seller"
                          className="block rounded px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                          onClick={() => setOpen(false)}
                        >
                          📦 Dashboard Toko
                        </Link>
                      ) : (
                        <Link
                          href="/open-shop"
                          className="block rounded px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                          onClick={() => setOpen(false)}
                        >
                          🚀 Buka Toko Anda
                        </Link>
                      )}
                    </li>

                    <li className="border-t pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left rounded px-3 py-2 text-sm text-red-600 hover:bg-rose-50 transition"
                      >
                        Keluar
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}