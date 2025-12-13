"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useNotification } from "@/context/NotificationContext";
import WishlistButton from "@/components/ui/WishlistButton";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  unit?: string;
  images?: string[];
  rating?: number;
  reviewsCount?: number;
  description?: string;
};

function formatCurrency(value: number, currency = "IDR") {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

export default function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [store, setStore] = React.useState<{ name: string; city: string } | null>(null);
  const cart = useCart();
  const { showNotification } = useNotification();
  
  console.log("🔍 ProductCard - cart context:", cart);
  console.log("🔍 ProductCard - addItem function:", cart?.addItem);
  
  const { addItem } = cart || {};

  React.useEffect(() => {
    let mounted = true;
    async function fetchStore() {
      try {
        const res = await fetch(`/api/stores?productId=${encodeURIComponent(product.id)}`);
        if (!res.ok) throw new Error("failed");
        const json = await res.json();
        if (!mounted) return;
        setStore({ name: json.data.name, city: json.data.city });
      } catch (e) {
        if (!mounted) return;
        setStore({ name: "SeaSnacky", city: "Indonesia" });
      }
    }
    fetchStore();
    return () => {
      mounted = false;
    };
  }, [product.id]);

  async function addToCart() {
    setLoading(true);
    try {
      console.log("🛒 addToCart - Starting...");
      console.log("🛒 addToCart - addItem function:", addItem);
      console.log("🛒 addToCart - product:", { productId: product.id, quantity: 1 });
      
      if (!addItem) {
        console.error("❌ addItem is not available!");
        throw new Error("Cart context tidak tersedia");
      }
      
      await addItem({ productId: product.id, quantity: 1 });
      console.log("✅ Item added successfully");
      setAdded(true);
      
      // Show custom notification
      showNotification(
        "Ditambahkan ke Keranjang!",
        product.name,
        product.images?.[0]
      );
      
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      showNotification("Gagal", msg);
    } finally {
      setLoading(false);
    }
  }

  function buyNow() {
    // Save product to sessionStorage for direct checkout
    sessionStorage.setItem(
      "directBuy",
      JSON.stringify({
        productId: product.id,
        quantity: 1,
        isDirect: true,
      })
    );
    // Redirect to checkout
    window.location.href = "/checkout?direct=true";
  }

  return (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow hover:ring-2 hover:ring-sky-200 hover-lift">
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="w-full h-44 bg-gray-100 overflow-hidden relative img-zoom">
            <Image
              src={product.images && product.images[0] || "/placeholder-300.png"}
              alt={`Gambar ${product.name}`}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover object-center"
            />
          </div>
        </Link>

        {/* Wishlist Button top-left */}
        <div className="absolute top-3 left-3 z-10">
          <WishlistButton productId={product.id} productName={product.name} size="sm" />
        </div>

        {/* unit badge top-right */}
        {product.unit && (
          <div className="absolute top-3 right-3 bg-white/90 text-xs text-slate-700 px-2 py-1 rounded-full shadow-sm">
            {product.unit}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3">
              <div className="text-sm font-semibold" style={{ color: 'var(--primary-700, #075bb8)' }}>
                {formatCurrency(product.price)}{product.unit ? `/${product.unit}` : ""}
              </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full text-white text-xs font-semibold" style={{ backgroundColor: 'var(--primary)' }}>
                ★
              </span>
                  <div className="text-xs text-slate-500">{product.rating ?? 0} ({product.reviewsCount ?? 0})</div>
            </div>
          </div>

              <div className="text-xs text-slate-400 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 21s8-4 8-10V6l-8-4-8 4v5c0 6 8 10 8 10z" />
                </svg>
                <span>{store ? `${store.name} • ${store.city}` : "SeaSnacky"}</span>
              </div>
        </div>

        <div className="space-y-2">
          {/* Button Lihat Detail */}
          <Link
            href={`/products/${product.id}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 shadow-sm hover:shadow-md group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Lihat Detail
          </Link>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart();
              }}
              disabled={loading}
              type="button"
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors border border-sky-600 text-sky-700 hover:bg-sky-50 disabled:opacity-60`}
              style={{ boxShadow: '0 1px 0 rgba(2,6,23,0.04)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3-8H6.4" />
              </svg>
              {loading ? "..." : added ? "✓" : "Keranjang"}
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                buyNow();
              }}
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors btn-primary btn-press"
              style={{ boxShadow: '0 1px 0 rgba(2,6,23,0.04)' }}
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 


