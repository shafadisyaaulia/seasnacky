"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OpenShopPage() {
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/dashboard/open-shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard/seller");
    } else {
      setError(json?.message ?? "Gagal membuka toko.");
    }
  };

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Buka Toko Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl shadow p-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nama Toko</label>
          <input
            required
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Nama Toko"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Kota</label>
          <input
            required
            value={form.city}
            onChange={e => handleChange("city", e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Contoh: Banda Aceh"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
          <input
            required
            value={form.address}
            onChange={e => handleChange("address", e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Jalan, RT/RW, dsb"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
          <textarea
            required
            value={form.description}
            onChange={e => handleChange("description", e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            rows={3}
            placeholder="Deskripsi singkat toko"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-sky-700 text-white font-semibold py-2 hover:bg-sky-800 transition disabled:opacity-60"
        >
          {loading ? "Membuka Toko..." : "Buka Toko"}
        </button>
      </form>
    </main>
  );
}
