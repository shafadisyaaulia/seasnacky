"use client";

import { useState } from "react";
import Link from "next/link";

export default function UserLoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("Mengalihkan ke dasbor...");

    // Baris-baris di bawah ini kita jadikan komentar atau hapus
    /*
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setMessage("Login berhasil! Mengalihkan ke dasbor...");
      window.location.href = "/user"; // Arahkan ke dasbor
    } else {
      const result = await response.json();
      setMessage(result.message ?? "Login gagal. Silakan coba lagi.");
    }
    */

    // Langsung arahkan ke halaman dasbor tanpa login
    window.location.href = "/user";
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="mx-auto w-full max-w-xl px-6 pt-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-400">
          Login Pengguna
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">
          Selamat datang kembali.
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Masuk untuk mengakses histori pesanan dan rekomendasi personal Anda.
        </p>
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {/* ... sisa form input sama ... */}
           <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-500 focus:outline-none"
              placeholder="email@contoh.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-500 focus:outline-none"
              placeholder="Password Anda"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
          >
            Masuk
          </button>
        </form>
        {message && (
          <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-rose-500">
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link href="/user/register" className="font-semibold text-rose-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}