"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Filter, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { useNotification } from "@/context/NotificationContext";

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
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const cart = useCart();
  const { showNotification } = useNotification();
  
  console.log("🔍 Products Page - cart context:", cart);
  console.log("🔍 Products Page - addItem function:", cart?.addItem);

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
                  <div className="mt-auto space-y-2">
                    <div className="text-lg font-bold text-blue-600 mb-3">Rp {product.price.toLocaleString("id-ID")}</div>
                    
                    {/* Button Lihat Detail */}
                    <Link 
                      href={`/products/${product._id}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Lihat Detail
                    </Link>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={async (e) => {
                          console.log("🔴 BUTTON CLICKED - Product:", product._id);
                          e.preventDefault();
                          e.stopPropagation();
                          
                          if (!cart?.addItem) {
                            console.error("❌ Cart context tidak tersedia");
                            alert("Gagal menambahkan ke keranjang");
                            return;
                          }
                          
                          setAddingToCart(product._id);
                          try {
                            console.log("🛒 Calling addItem...");
                            await cart.addItem({ productId: product._id, quantity: 1 });
                            console.log("✅ Item added successfully");
                            
                            // Show custom notification
                            showNotification(
                              "Ditambahkan ke Keranjang!",
                              product.name,
                              product.images?.[0]
                            );
                          } catch (error) {
                            console.error("❌ Error adding to cart:", error);
                            alert("Gagal menambahkan ke keranjang");
                          } finally {
                            setAddingToCart(null);
                          }
                        }}
                        disabled={addingToCart === product._id}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <ShoppingCart size={16} />
                        <span className="hidden sm:inline">
                          {addingToCart === product._id ? "..." : "Keranjang"}
                        </span>
                      </button>
                      <button 
                        onClick={() => {
                          const directBuyData = {
                            productId: product._id,
                            quantity: 1,
                            isDirect: true,
                          };
                          sessionStorage.setItem("directBuy", JSON.stringify(directBuyData));
                          window.location.href = "/checkout?direct=true";
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Beli Sekarang
                      </button>
                    </div>
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