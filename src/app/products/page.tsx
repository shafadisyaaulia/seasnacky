"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Filter, Loader2 } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products?t=" + new Date().getTime());
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Gagal ambil produk", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
            
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Cari cumi, kerupuk, ikan..."
                className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button onClick={() => setSelectedCategory("all")} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Semua</button>
            <button onClick={() => setSelectedCategory("mentah")} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'mentah' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>🐟 Bahan Mentah</button>
            <button onClick={() => setSelectedCategory("olahan")} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'olahan' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>📦 Produk Olahan</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed"><p className="text-gray-500">Produk tidak ditemukan</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col">
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow text-gray-700 capitalize">{product.category}</span>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-blue-600">Rp {product.price.toLocaleString("id-ID")}</span>
                    <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors"><ShoppingCart size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}