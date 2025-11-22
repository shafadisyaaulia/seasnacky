"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateStoreForm() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Nama toko wajib diisi");
    setLoading(true);
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), city: city.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Gagal membuat toko");
      const id = json.data?.id;
      if (id) {
        router.push(`/store/${id}`);
      } else {
        setError("Tidak menerima id toko dari server");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xl bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Buat Toko Baru</h2>
      <label className="block text-sm text-slate-700 mb-2">
        Nama Toko
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2" placeholder="Nama Toko Anda" />
      </label>
      <label className="block text-sm text-slate-700 mb-4">
        Kota / Lokasi
        <input value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2" placeholder="Contoh: Banda Aceh" />
      </label>
      {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 rounded-full bg-sky-700 text-white font-semibold hover:bg-sky-800 disabled:opacity-60">
          {loading ? "Membuat..." : "Buat Toko"}
        </button>
        <button type="button" onClick={() => { setName(""); setCity(""); }} className="px-4 py-2 rounded-full border">Reset</button>
      </div>
    </form>
  );
}
