"use client";

import { useEffect, useState } from "react";
import { Package, AlertCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useNotification } from "@/context/NotificationContext";
import AdminNavbar from "@/components/admin/AdminNavbar";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  countInStock: number;
  images: string[];
  shop: {
    name: string;
  };
  sellerId: {
    name: string;
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/dashboard/admin/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Yakin ingin menghapus produk "${productName}"? Tindakan ini tidak dapat dibatalkan!`)) return;

    setDeletingId(productId);
    try {
      const res = await fetch(`/api/dashboard/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showNotification("Produk berhasil dihapus!", "success");
        fetchProducts();
      } else {
        const data = await res.json();
        showNotification(data.message || "Gagal menghapus produk!", "error");
      }
    } catch (error) {
      showNotification("Error menghapus produk!", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white rounded-xl shadow animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📦 Kelola Produk</h1>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
            <Package className="text-blue-600" size={20} />
            <span className="font-bold text-blue-600">{products.length} Produk</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Package size={48} />
                  </div>
                )}
                {product.countInStock === 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <AlertCircle size={12} /> Stok Habis
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Toko:</strong> {product.shop?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Seller:</strong> {product.sellerId?.name || "Unknown"}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-blue-600">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                  <span className={`text-sm font-medium ${product.countInStock > 0 ? "text-green-600" : "text-red-600"}`}>
                    Stok: {product.countInStock}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {product.category}
                  </span>
                  <button
                    onClick={() => handleDeleteProduct(product._id, product.name)}
                    disabled={deletingId === product._id}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    {deletingId === product._id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500">Belum ada produk</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
