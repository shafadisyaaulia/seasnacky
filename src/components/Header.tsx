"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = { id: string; name?: string; email?: string; storeId?: string } | null;

export default function Header() {
  const [user, setUser] = useState<User>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setUser(json.data ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    // simple refresh to update UI
    window.location.href = "/";
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-40">
      <div className="site-container flex items-center gap-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center text-sky-800 font-bold">S</div>
            <div className="text-xl font-semibold text-sky-800">SeaSnacky</div>
          </Link>
        </div>

        <div className="flex-1 hidden md:flex items-center justify-center">
          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link href="/marketplace" className="text-white/90 hover:text-white/100">Marketplace</Link>
            <Link href="/education" className="text-white/80 hover:text-white/100">Panduan Olahan</Link>
            <Link href="/store/create" className="text-white/80 hover:text-white/100">Buka Toko</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/user/login" className="hidden md:inline-flex items-center rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-800">Daftar/Masuk</Link>
              <button aria-label="Buka Pencarian" className="md:hidden p-2 rounded-full bg-sky-100 text-sky-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
                </svg>
              </button>
              <Link href="/user/login" className="md:hidden rounded-full border border-sky-500 px-3 py-2 text-sky-700 text-sm">Masuk</Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setOpen((s) => !s)} className="inline-flex items-center gap-2 rounded-full bg-sky-50/50 px-3 py-1 text-sm font-medium text-sky-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" />
                </svg>
                <span className="hidden md:inline">{user.name ?? user.email}</span>
              </button>

              {open ? (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-white p-4 shadow">
                  <ul className="space-y-2">
                    <li><Link href="/user" className="block text-sm">Profil</Link></li>
                    {user.storeId ? (
                      <li><Link href={`/store/${user.storeId}`} className="block text-sm">Toko Anda</Link></li>
                    ) : (
                      <li><Link href="/store/create" className="block text-sm">Buka Toko</Link></li>
                    )}
                    <li>
                      <button onClick={handleLogout} className="w-full text-left text-sm text-red-600">Keluar</button>
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
