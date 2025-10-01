"use client";

import { useState } from "react";

export default function UserRegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("Mendaftarkan akun...");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    setMessage(result.message ?? "Pendaftaran selesai.");
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="mx-auto w-full max-w-xl px-6 pt-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-400">
          Registrasi Pengguna
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">
          Buat akun Marine Snack Marketplace.
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Dapatkan akses ke katalog camilan laut, histori pesanan, dan rekomendasi personal.
        </p>
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Nama Lengkap
            </label>
            <input
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-500 focus:outline-none"
              placeholder="Mira Sasmita"
              required
            />
          </div>
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
              placeholder="Minimal 8 karakter"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Alamat Pengiriman
            </label>
            <textarea
              value={form.address}
              onChange={(event) => handleChange("address", event.target.value)}
              className="h-28 w-full resize-none rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-500 focus:outline-none"
              placeholder="Jalan Bahari No. 18, Jakarta"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
          >
            Daftar Sekarang
          </button>
        </form>
        {message && (
          <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-rose-500">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}