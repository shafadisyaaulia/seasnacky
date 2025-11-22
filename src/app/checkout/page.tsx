"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useContext(CartContext as any);
  const items = cart?.items ?? [];
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        const u = json.data ?? null;
        setMe(u);
        if (u?.address) setAddress(u.address);
      })
      .catch(() => {})
      .finally(() => {
        if (!mounted) return;
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleCheckout = async () => {
    if (!me) {
      // redirect to login with next
      window.location.href = `/user/login?next=/checkout`;
      return;
    }
    if (!items || items.length === 0) return alert("Keranjang kosong.");
    setLoading(true);
    try {
      const payload = {
        userId: me.id,
        items: items.map((it: any) => ({ productId: it.productId, quantity: it.quantity })),
        shippingAddress: address,
      };
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("checkout failed");
      const data = await res.json();
      // clear cart if provider exists
      if (cart?.clear) cart.clear();
      router.push(`/user/orders/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan checkout. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const total = (items ?? []).reduce((s: number, it: any) => s + (it.quantity || 0) * (it.price || 0), 0);

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold mb-3">Alamat Pengiriman</h2>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-md border p-2 min-h-[120px]" />
          <div className="mt-4">
            <button onClick={handleCheckout} disabled={loading} className="rounded bg-sky-700 px-4 py-2 text-white">
              {loading ? "Memproses..." : "Bayar & Pesan"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="font-semibold mb-3">Ringkasan Pesanan</h2>
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">Keranjang Anda kosong.</p>
          ) : (
            <div className="space-y-3">
              {items.map((it: any) => (
                <div key={it.productId} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{it.productId}</p>
                    <p className="text-xs text-slate-500">Qty: {it.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold">Rp {((it.price ?? 0) * (it.quantity ?? 1)).toLocaleString("id-ID")}</div>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 flex items-center justify-between">
                <div className="text-sm text-slate-600">Total</div>
                <div className="text-lg font-semibold">Rp {total.toLocaleString("id-ID")}</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
