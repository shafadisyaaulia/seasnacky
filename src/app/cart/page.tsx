"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  images?: string[];
  unit?: string;
};

export default function CartPage() {
  const cart = useCart();
  const { items, updateItem, removeItem, clear } = cart;
  const [products, setProducts] = useState<Record<string, Product>>({});
  
  console.log("🛒 Cart Page - cart context:", cart);
  console.log("🛒 Cart Page - items:", items);
  
  useEffect(() => {
    let mounted = true;
   async function loadAll() {
      try {
        // Gunakan relative URL untuk menghindari CORS
        const res = await fetch("/api/products");
        if (!res.ok) return;
        const data = await res.json();
        // data may be { data: [...] } or list
        const list = Array.isArray(data) ? data : data.data ?? data;
        if (!mounted) return;
        const map: Record<string, Product> = {};
        (list ?? []).forEach((p: any) => {
          map[p.id] = { id: p.id, name: p.name, price: p.price, images: p.images, unit: p.unit };
        });
        setProducts(map);
      } catch (err) {
        console.error(err);
      }
    }
    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  const subtotal = items.reduce((s, it) => s + (products[it.productId]?.price ?? 0) * it.quantity, 0);

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-sky-800">Keranjang Belanja</h1>
        <div className="text-sm text-sky-600">SeaSnacky • Pilihan Lautan</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2 space-y-4">
          <div className="rounded-lg border border-sky-100 bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-sky-700 font-medium">{items.length} item dalam keranjang</div>
              <div className="flex items-center gap-3">
                <button onClick={() => clear()} className="text-sm text-red-600 border border-red-100 px-3 py-1 rounded">Kosongkan Keranjang</button>
                <Link href="/products" className="text-sm text-sky-700 underline">Lanjut Belanja</Link>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-sky-100 bg-white p-8 text-center">
              <p className="text-sky-700 font-medium">Keranjang Anda kosong</p>
              <p className="text-sm text-sky-500">Jelajahi produk terbaik kami di SeaSnacky.</p>
            </div>
          ) : (
            items.map((it) => {
              const p = products[it.productId];
              return (
                <article key={it.productId} className="rounded-lg border border-sky-50 bg-white p-4 shadow-sm flex gap-4 items-center">
                  <div className="w-28 h-28 bg-sky-50 rounded-md overflow-hidden flex items-center justify-center">
                    {p?.images && p.images[0] ? (
                      <Image src={p.images[0]} alt={p.name} width={96} height={96} className="object-cover" />
                    ) : (
                      <div className="text-sky-300 text-sm">No image</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-sky-800">{p?.name ?? it.productId}</h3>
                    <p className="text-sm text-sky-500">Unit: {p?.unit ?? "pcs"}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center border rounded-md overflow-hidden">
                        <button onClick={() => updateItem(it.productId, Math.max(1, it.quantity - 1))} className="px-3 py-2 text-sky-700">−</button>
                        <div className="px-4 py-2">{it.quantity}</div>
                        <button onClick={() => updateItem(it.productId, it.quantity + 1)} className="px-3 py-2 text-sky-700">+</button>
                      </div>
                      <button onClick={() => removeItem(it.productId)} className="text-red-600 text-sm">Hapus</button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-sky-600">Harga</div>
                    <div className="text-lg font-semibold text-sky-800">Rp {(p?.price ?? 0 * it.quantity).toLocaleString("id-ID")}</div>
                    <div className="text-sm text-sky-500">Total: Rp {((p?.price ?? 0) * it.quantity).toLocaleString("id-ID")}</div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <aside className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-sky-800">Ringkasan Pesanan</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm text-sky-600">
              <div>Subtotal ({items.length} item)</div>
              <div>Rp {subtotal.toLocaleString("id-ID")}</div>
            </div>
            <div className="flex justify-between text-sm text-sky-600">
              <div>Ongkos Kirim</div>
              <div>Dihitung saat checkout</div>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <div className="text-sm text-sky-700 font-medium">Total</div>
              <div className="text-xl font-semibold text-sky-800">Rp {subtotal.toLocaleString("id-ID")}</div>
            </div>
            <div className="mt-4">
              <Link href="/checkout" className="block text-center rounded-md bg-sky-700 text-white px-4 py-2">Lanjut ke Checkout</Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
