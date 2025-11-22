"use client";

import React, { useState } from "react";

export default function ProductDetailClient({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function addToCart() {
    setLoading(true);
    setSuccess(null);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "usr-001", productId, quantity }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Gagal menambahkan ke keranjang");
      setSuccess("Produk berhasil ditambahkan ke keranjang");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm text-slate-600">Jumlah</label>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-2 py-1 rounded border"
            aria-label="kurangi"
          >
            -
          </button>
          <input
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
            className="w-12 text-center rounded border px-2 py-1"
          />
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-2 py-1 rounded border"
            aria-label="tambah"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={addToCart}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 btn-primary"
        style={{ boxShadow: '0 1px 0 rgba(2,6,23,0.04)' }}
      >
        {loading ? "Menambahkan..." : "Tambah ke Keranjang"}
      </button>

      {success && <div className="mt-3 text-sm text-sky-700">{success}</div>}
    </div>
  );
}
