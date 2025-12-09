"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const items = cart.items;
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [provinces, setProvinces] = useState<Array<{id: string, name: string}>>([]);
  const [provinceId, setProvinceId] = useState<string>("");
  const [cities, setCities] = useState<Array<{id: string, name: string}>>([]);
  const [cityId, setCityId] = useState<string>("");
  const [products, setProducts] = useState<Record<string, any>>({});

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
    fetch("/api/products")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        const list = Array.isArray(json) ? json : json.data ?? json;
        const map: Record<string, any> = {};
        (list ?? []).forEach((p: any) => {
          map[p.id] = p;
        });
        setProducts(map);
      })
      .catch(() => {});
    fetch("/api/regions/provinces")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setProvinces(json.data ?? []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!provinceId) {
      setCities([]);
      setCityId("");
      return;
    }
    fetch(`/api/regions/cities?provinceId=${provinceId}`)
      .then((r) => r.json())
      .then((json) => {
        setCities(json.data ?? []);
        setCityId("");
      })
      .catch(() => {
        setCities([]);
        setCityId("");
      });
  }, [provinceId]);

  const handleCheckout = async () => {
    if (!me) {
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
      if (cart?.clear) cart.clear();
      router.push(`/user/orders/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan checkout. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((s: number, it: any) => s + (products[it.productId]?.price ?? 0) * it.quantity, 0);

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-sky-800">Checkout</h1>
        <div className="text-sm text-sky-600">SeaSnacky • Pilihan Lautan</div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <section className="md:col-span-2 rounded-lg border border-sky-100 bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold text-sky-800 mb-6 flex items-center gap-2">
            <span className="w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 21s8-4 8-10V6l-8-4-8 4v5c0 6 8 10 8 10z" /></svg>
            </span>
            Alamat Pengiriman
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input type="text" placeholder="Nama Lengkap" className="rounded-md border p-2" />
            <input type="text" placeholder="Nomor Telepon" className="rounded-md border p-2" />
            <select
              className="rounded-md border p-2 md:col-span-2"
              value={provinceId}
              onChange={(e) => setProvinceId(e.target.value)}
            >
              <option value="">Cari dan pilih provinsi</option>
              {provinces.map((prov) => (
                <option key={prov.id} value={prov.id}>{prov.name}</option>
              ))}
            </select>
            <select
              className="rounded-md border p-2 md:col-span-2"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              disabled={!provinceId || cities.length === 0}
            >
              <option value="">Pilih kota terlebih dahulu</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat lengkap (nama jalan, nomor rumah, RT/RW, dll)" className="w-full rounded-md border p-2 min-h-[80px] md:col-span-2" />
          </div>
          <div className="mt-4 text-xs text-sky-600 bg-sky-50 rounded p-2">Lengkapi semua field alamat untuk melihat opsi pengiriman yang tersedia.</div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-sky-800 mb-3">Pesanan Anda</h3>
            {items.length === 0 ? (
              <p className="text-sm text-sky-500">Keranjang Anda kosong.</p>
            ) : (
              items.map((it: any) => {
                const p = products[it.productId];
                return (
                  <div key={it.productId} className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-sky-50 rounded overflow-hidden flex items-center justify-center">
                      {p?.image ? (
                        <Image src={p.image} alt={p.name} width={56} height={56} className="object-cover" />
                      ) : (
                        <div className="text-sky-300 text-xs">No image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-sky-800 truncate">{p?.name ?? it.productId}</div>
                      <div className="text-xs text-sky-500">{it.quantity} {p?.unit ?? "pcs"} × Rp {p?.price?.toLocaleString("id-ID")}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-sky-800 mb-3">Ringkasan Pesanan</h3>
            <div className="flex justify-between text-sm text-sky-600 mb-2">
              <div>Subtotal ({items.length} item)</div>
              <div>Rp {subtotal.toLocaleString("id-ID")}</div>
            </div>
            <div className="flex justify-between text-sm text-sky-600 mb-2">
              <div>Ongkos Kirim</div>
              <div>Belum dipilih</div>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <div className="text-sm text-sky-700 font-medium">Total</div>
              <div className="text-xl font-semibold text-sky-800">Rp {subtotal.toLocaleString("id-ID")}</div>
            </div>
            <div className="mt-4">
              <button onClick={handleCheckout} disabled={loading} className="block w-full text-center rounded-md bg-sky-700 text-white px-4 py-2 disabled:opacity-60">
                {loading ? "Memproses..." : "Bayar Sekarang"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

