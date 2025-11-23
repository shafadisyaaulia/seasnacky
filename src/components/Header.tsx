"use client"; // <--- INI WAJIB DI BARIS 1 (Paling Atas)

import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react"; // Sekarang ini aman
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";

export default function Header() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const cart = useContext(CartContext as any);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartCount((cart?.items ?? []).reduce((s: number, it: any) => s + (it.quantity || 0), 0));
  }, [cart?.items]);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((json) => setUser(json?.data ?? null))
      .catch(() => setUser(null));
  }, []);

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
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-lg">
            SS
          </div>
          <span className="text-xl font-semibold text-slate-900">SeaSnacky</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/marketplace" className="text-sm font-medium text-slate-700 transition hover:text-blue-600">
            Marketplace
          </Link>
          <Link href="#edu" className="text-sm font-medium text-slate-700 transition hover:text-blue-600">
            Edukasi
          </Link>
          <Link href="#dashboard" className="text-sm font-medium text-slate-700 transition hover:text-blue-600">
            Dashboard
          </Link>
        </nav>
        <div className="relative">
          {!user ? (
            <Link
              href="/user/login"
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" />
                </svg>
                <span>{user.name ?? user.email}</span>
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-white p-4 shadow-lg z-50">
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/dashboard"
                        className="block rounded px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 transition"
                        onClick={() => setOpen(false)}
                      >
                        Dashboard Pengguna
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/open-shop"
                        className="block rounded px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                        onClick={() => setOpen(false)}
                      >
                        Buka Toko Anda
                      </Link>
                    </li>
                    <li>
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
