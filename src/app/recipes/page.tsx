"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ChefHat, ArrowRight, Loader2 } from "lucide-react";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes");
        const data = await res.json();
        if (Array.isArray(data)) setRecipes(data);
      } catch (error) {
        console.error("Gagal ambil resep");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="bg-blue-600 py-16 px-4">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Dapur Seasnacky 👨‍🍳</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Bingung mau masak apa hari ini? Temukan inspirasi olahan laut lezat dan sehat di sini.
          </p>
        </div>
      </div>

      {/* Grid Resep */}
      <div className="container mx-auto px-4 -mt-10">
        {isLoading ? (
          <div className="flex justify-center py-20 bg-white rounded-xl shadow-sm">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all group">
                {/* Gambar Resep */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                    {recipe.difficulty}
                  </div>
                </div>

                {/* Konten */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <Clock size={16} /> {recipe.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <ChefHat size={16} /> {recipe.ingredients.length} Bahan
                    </div>
                  </div>

                  {/* Tombol Lihat Detail (Mengarah ke folder slug) */}
                  <Link href={`/recipes/${recipe.slug || recipe._id}`}> 
                    <button className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                      Lihat Resep <ArrowRight size={18} />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}