"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react"; // Pastikan lucide-react terinstall

// Definisikan tipe data Produk sesuai MongoDB
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
}

export default function ProductCatalog() {
  // PENTING: Inisialisasi state dengan array kosong [] biar gak error 'undefined'
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        // Safety Check: Pastikan data yang diterima benar-benar Array
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Format data salah:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Gagal ambil produk:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Tampilan saat Loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  // Tampilan jika Produk Kosong (FIX: Cek length dengan aman)
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500">Belum ada produk yang dijual saat ini.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product._id} 
          className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
        >
          {/* Gambar Produk */}
          <div className="relative h-48 bg-gray-100 w-full">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            
            {/* Badge Kategori */}
            <span className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-medium px-2 py-1 rounded-md shadow-sm text-gray-700 capitalize">
              {product.category}
            </span>
          </div>

          {/* Info Produk */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-grow">
              {product.description}
            </p>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-blue-600">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
              
              <Link href={`/products/${product._id}`}>
                <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                  <ShoppingCart size={18} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}