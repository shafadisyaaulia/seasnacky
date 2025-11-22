// src/components/ProductCatalog.tsx

"use client";

import { useState, useEffect } from "react";

// Definisikan tipe untuk produk
interface Product {
  id: string;
  name: string;
  description: string;
  image: string; // Pastikan ini 'image', bukan 'imageUrl'
  price: number;
  slug: string;
}

// Fungsi untuk memformat mata uang
function formatCurrency(value: number, currency: string = "IDR") {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

import Image from "next/image";

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
        setProducts(result.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <p className="py-8 text-center text-slate-500">Memuat katalog produk...</p>
    );
  }

  if (error) {
    return <p className="py-8 text-center text-red-500">Error: {error}</p>;
  }

  if (products.length === 0) {
    return (
      <p className="py-8 text-center text-slate-500">
        Tidak ada produk untuk ditampilkan.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <div className="aspect-h-1 aspect-w-1 lg:aspect-none w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80 relative img-zoom">
            <Image
              src={product.image || "https://via.placeholder.com/300"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 25vw"
              className="object-cover object-center"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm text-gray-700">
                <a href={`/products/${product.slug}`}>
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.name}
                </a>
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {product.description}
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(product.price)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}