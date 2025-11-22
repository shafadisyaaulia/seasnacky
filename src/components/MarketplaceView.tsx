"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  unit?: string;
  image?: string;
  rating?: number;
  reviewsCount?: number;
  description?: string;
};

export default function MarketplaceView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (category) q.set("category", category);

    fetch(`/api/products?${q.toString()}`)
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        const data: Product[] = json.data ?? [];
        // ensure fields for ProductCard
        setProducts(
          data.map((p) => ({
            ...p,
            image: p.image ?? "/placeholder-300.png",
            description: p.description ?? "",
          }))
        );
        setTotal(json.meta?.total ?? json.data?.length ?? 0);
      })
      .catch(() => {
        if (!mounted) return;
        setProducts([]);
        setTotal(0);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [search, category]);

  return (
    <div>
      <header className="mb-6">
        <div className="flex gap-4 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="flex-1 rounded-lg border border-slate-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="">Semua Kategori</option>
            <option value="Keripik">Keripik</option>
            <option value="Abon">Abon</option>
            <option value="Frozen">Frozen</option>
          </select>

          <button
            onClick={() => { setSearch(""); setCategory(""); }}
            className="px-4 py-2 rounded-md bg-sky-100 text-sky-700 text-sm hover:bg-sky-200"
          >
            Reset
          </button>
        </div>

        <div className="mt-3 text-sm text-slate-500">
          {loading ? "Memuat produk..." : `Menampilkan ${products.length} dari ${total ?? 0} produk`}
        </div>
      </header>

      <section>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
      </section>
    </div>
  );
}
