"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("Login berhasil! Mengalihkan ke dasbor admin...");

    // Buat cookie "kartu akses" sederhana untuk demo
    document.cookie = "demo_session=true; path=/";

    // Arahkan ke dasbor admin setelah 1 detik
    setTimeout(() => {
      window.location.href = "/admin";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto w-full max-w-md px-6 pt-24">
        <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">
                SeaSnacky Admin Hub
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
                Portal Admin
            </h1>
            <p className="mt-2 text-sm text-slate-500">
                Masuk untuk mengelola produk, pesanan, dan konten.
            </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
              placeholder="admin@seasnacky.id"
              defaultValue="admin@seasnacky.id"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
              placeholder="Password Anda"
              defaultValue="password"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
          >
            Masuk
          </button>
        </form>
        {message && (
          <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-blue-600">
            {message}
          </p>
        )}
         {/* BAGIAN YANG DITAMBAHKAN ADA DI SINI */}
         <p className="mt-8 text-center text-sm text-slate-600">
          Butuh akun admin?{" "}
          <Link href="/admin/register" className="font-semibold text-blue-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}