"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import { User, Store, LogOut, LayoutDashboard, ShoppingCart } from "lucide-react"; // Ikon biar cantik

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
      .then((json) => setUser(json?.data ?? null))
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

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    setOpen(false);
    router.refresh(); // Refresh halaman biar header update
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-lg font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
            SS
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            SeaSnacky
          </span>
        </Link>

        {/* MENU TENGAH */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
            Belanja
          </Link>
          <Link href="/recipes" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
            Resep
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
              <Link
                href="/login" // Pastikan arahnya ke login page yang benar (bukan /user/login kalau folder lama udh dihapus)
                className="rounded-full bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition"
              >
                Masuk
              </Link>
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

                      {/* 1.5. Pesanan Saya (Untuk semua user) */}
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
                            href="/open-shop" // Arahkan ke form buka toko
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