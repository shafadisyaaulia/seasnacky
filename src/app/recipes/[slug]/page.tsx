"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; 
import { Clock, ChefHat, ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";

export default function RecipeDetailPage() {
  const params = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil Data Resep Detail
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch("/api/recipes");
        const data = await res.json();
        
        // Cari resep yang cocok dengan slug di URL
        const found = data.find((r: any) => 
          r.slug === params.slug || r._id === params.slug
        );
        
        setRecipe(found);
      } catch (error) {
        console.error("Gagal ambil resep");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) fetchRecipe();
  }, [params.slug]);

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  }

  if (!recipe) {
    return <div className="min-h-screen flex justify-center items-center text-gray-500">Resep tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Gambar Header Besar */}
      <div className="relative h-[400px] w-full">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 text-white container mx-auto">
          <Link href="/recipes" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={20} /> Kembali ke Dapur
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{recipe.title}</h1>
          <div className="flex gap-6 text-lg">
            <span className="flex items-center gap-2"><Clock size={20} /> {recipe.time}</span>
            <span className="flex items-center gap-2"><ChefHat size={20} /> {recipe.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Kolom Kiri: Bahan & Cara Masak */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Deskripsi */}
          <p className="text-gray-600 text-lg leading-relaxed bg-blue-50 p-6 rounded-xl border border-blue-100">
            {recipe.description}
          </p>

          {/* Bahan-bahan */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-blue-600 rounded-full block"></span>
              Bahan-bahan
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipe.ingredients.map((item: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cara Masak */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-orange-500 rounded-full block"></span>
              Cara Membuat
            </h2>
            <div className="space-y-6">
              {recipe.instructions.map((step: string, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: REKOMENDASI PRODUK */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" /> Belanja Bahannya
              </h3>
              <p className="text-blue-100 text-sm mt-1">Gak perlu repot ke pasar, beli bahan utamanya di sini!</p>
            </div>

            <div className="p-6 space-y-6">
              {recipe.relatedProducts && recipe.relatedProducts.length > 0 ? (
                recipe.relatedProducts.map((product: any) => (
                  <div key={product._id} className="flex gap-4 items-center group">
                    {/* Gambar Produk */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                      {product.images && product.images[0] && (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                    
                    {/* Info Produk */}
                    <div>
                      <h4 className="font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                      <p className="text-blue-600 font-bold text-lg">Rp {product.price.toLocaleString("id-ID")}</p>
                      
                      <Link href={`/products`}> 
                        <button className="mt-2 text-sm bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition shadow-sm w-full">
                          Beli Sekarang
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Stok bahan sedang kosong.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}