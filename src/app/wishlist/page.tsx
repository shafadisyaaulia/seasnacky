"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNotification } from "@/context/NotificationContext";

interface WishlistItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    description: string;
    category: string;
    countInStock: number;
  };
  createdAt: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { addItem } = useCart();
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/wishlist");
      
      if (res.status === 401) {
        showNotification("Login Diperlukan", "Silakan login untuk melihat wishlist");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      showNotification("Gagal", "Tidak dapat memuat wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setRemovingId(productId);
    try {
      const res = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      setWishlist((prev) => prev.filter((item) => item.productId._id !== productId));
      showNotification("Berhasil", "Dihapus dari wishlist");
    } catch (error) {
      showNotification("Gagal", "Tidak dapat menghapus item");
    } finally {
      setRemovingId(null);
    }
  };

  const addToCart = async (product: WishlistItem["productId"]) => {
    try {
      await addItem({ productId: product._id, quantity: 1 });
      showNotification(
        "Ditambahkan ke Keranjang!",
        product.name,
        product.images?.[0]
      );
    } catch (error: any) {
      showNotification("Gagal", error.message || "Tidak dapat menambah ke keranjang");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft size={18} />
            <span>Kembali ke Produk</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Heart className="w-8 h-8 text-red-600 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wishlist Saya</h1>
              <p className="text-gray-600 mt-1">
                {wishlist.length} produk favorit
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist Grid */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Wishlist Kosong
            </h2>
            <p className="text-gray-600 mb-6">
              Belum ada produk favorit. Jelajahi produk dan tambahkan ke wishlist!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100"
              >
                <Link href={`/products/${item.productId._id}`} className="block">
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={item.productId.images?.[0] || "/placeholder.png"}
                      alt={item.productId.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium capitalize">
                      {item.productId.category}
                    </span>
                  </div>
                </Link>

                <div className="p-5">
                  <Link href={`/products/${item.productId._id}`}>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {item.productId.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {item.productId.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(item.productId.price)}
                    </p>
                    {item.productId.countInStock > 0 ? (
                      <span className="text-xs text-green-600 font-medium">
                        Stok tersedia
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">
                        Stok habis
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item.productId)}
                      disabled={item.productId.countInStock === 0}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={18} />
                      Keranjang
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.productId._id)}
                      disabled={removingId === item.productId._id}
                      className="px-4 py-2.5 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Hapus dari wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
