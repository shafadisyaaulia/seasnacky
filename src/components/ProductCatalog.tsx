// src/components/ProductCatalog.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // Gunakan Link dari Next.js biar navigasi cepat

// Definisikan tipe untuk produk (Sesuaikan dengan Mongoose)
interface Product {
  _id: string; // MongoDB pakai _id
  name: string;
  description: string;
  image: string;
  images?: string[]; // Jaga-jaga kalau pakai array images
  price: number;
  slug: string;
  category?: string;
}

// Fungsi untuk memformat mata uang
function formatCurrency(value: number, currency: string = "IDR") {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }
        
        const result = await response.json();

        // 🛠️ PERBAIKAN LOGIKA DISINI:
        // Cek apakah result langsung array ATAU dibungkus .data
        if (Array.isArray(result)) {
            setProducts(result);
        } else if (result.data && Array.isArray(result.data)) {
            setProducts(result.data);
        } else {
            setProducts([]); // Set kosong jika format tidak dikenali
        }

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
        }
        setProducts([]); // Pastikan array kosong kalau error
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-slate-500 animate-pulse">Sedang memuat katalog produk...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="py-8 text-center bg-red-50 rounded-lg">
            <p className="text-red-500 font-medium">Gagal memuat: {error}</p>
        </div>
    );
  }

  // Safety check: Pastikan products ada dan punya length
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
        <p className="text-slate-500 text-lg">Tidak ada produk untuk ditampilkan.</p>
        <p className="text-sm text-slate-400 mt-2">Coba tambahkan produk lewat Dashboard Seller.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <div key={product._id} className="group relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          
          {/* Bagian Gambar */}
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-xl bg-gray-200 lg:aspect-none lg:h-64 relative">
            <Image
              // Logika Gambar: Cek image utama -> Cek array images -> Fallback placeholder
              src={product.image || (product.images && product.images[0]) || "/placeholder-300.png"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Bagian Info Produk */}
          <div className="p-4 flex flex-col justify-between h-[120px]">
            <div>
              <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                {/* Gunakan Link dari Next.js */}
                <Link href={`/products/${product._id}`}> 
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.name}
                </Link>
              </h3>
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {product.description}
              </p>
            </div>
            
            <div className="mt-2 flex items-center justify-between">
                <p className="text-sm font-bold text-blue-600">
                {formatCurrency(product.price)}
                </p>
                {product.category && (
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {product.category}
                    </span>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}