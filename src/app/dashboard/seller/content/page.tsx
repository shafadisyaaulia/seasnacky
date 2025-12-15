"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X, Loader2, Save, ChefHat, Trash2, Clock, Edit, XCircle } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";

export default function CreateRecipePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);
  const [myRecipes, setMyRecipes] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<{ isEditing: boolean; recipeId: string | null }>({
    isEditing: false,
    recipeId: null,
  });

  // State awal dipisah biar gampang di-reset
  const initialFormState = {
    title: "",
    description: "",
    image: "",
    difficulty: "Mudah",
    time: "",
    ingredients: "",
    instructions: "",
    relatedProductId: ""
  };
  
  const [form, setForm] = useState(initialFormState);

  // 1. Get user ID dan fetch data
  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        // Get current user
        const userRes = await fetch("/api/me");
        const userData = await userRes.json();
        if (userData.id) {
          setUserId(userData.id);
          
          // Fetch products (sudah terfilter by seller di API products)
          const productsRes = await fetch("/api/products?t=" + Date.now()); 
          const productsData = await productsRes.json();
          if (Array.isArray(productsData)) {
            setSellerProducts(productsData);
          }
          
          // Fetch only MY recipes
          const recipesRes = await fetch(`/api/recipes?authorId=${userData.id}&t=` + Date.now());
          const recipesData = await recipesRes.json();
          if (Array.isArray(recipesData)) {
            setMyRecipes(recipesData);
          }
        }
      } catch (error) {
        console.error("Gagal ambil data", error);
      }
    };

    fetchUserAndData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      showNotification("Foto Diperlukan", "Wajib upload foto hasil masakan!");
      return;
    }
    
    setIsLoading(true);

    try {
      // Convert text area menjadi Array
      const ingredientsArray = form.ingredients.split("\n").filter(line => line.trim() !== "");
      const instructionsArray = form.instructions.split("\n").filter(line => line.trim() !== "");

      const payload = {
        ...form,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        authorId: userId, // Include author ID
      };

      let res;
      if (editMode.isEditing && editMode.recipeId) {
        // UPDATE mode
        res = await fetch(`/api/recipes/${editMode.recipeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE mode
        res = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Gagal menyimpan resep");

      showNotification(
        editMode.isEditing ? "Resep Diperbarui!" : "Resep Diterbitkan!",
        editMode.isEditing ? "Perubahan berhasil disimpan! ✅" : "Resep berhasil diterbitkan! 👨‍🍳",
        form.image
      );
      
      // ✅ RESET FORM & EDIT MODE
      setForm(initialFormState);
      setEditMode({ isEditing: false, recipeId: null });

      // ✅ Refresh list resep (hanya milik user ini)
      const recipesRes = await fetch(`/api/recipes?authorId=${userId}&t=` + Date.now());
      const data = await recipesRes.json();
      if (Array.isArray(data)) {
        setMyRecipes(data);
      }

      setIsLoading(false);

    } catch (error: any) {
      console.error("Error submit resep:", error);
      showNotification("Gagal Menyimpan", error.message || "Terjadi kesalahan saat menyimpan resep");
      setIsLoading(false);
    }
  };

  const handleEditRecipe = (recipe: any) => {
    // Pre-fill form dengan data resep yang akan diedit
    // Extract relatedProductId from relatedProducts array
    const relatedProductId = recipe.relatedProducts && recipe.relatedProducts.length > 0
      ? (typeof recipe.relatedProducts[0] === 'string' 
          ? recipe.relatedProducts[0] 
          : recipe.relatedProducts[0]._id || recipe.relatedProducts[0])
      : "";

    setForm({
      title: recipe.title,
      description: recipe.description,
      image: recipe.image,
      difficulty: recipe.difficulty,
      time: recipe.time,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join("\n") : recipe.ingredients,
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join("\n") : recipe.instructions,
      relatedProductId: relatedProductId,
    });
    setEditMode({ isEditing: true, recipeId: recipe._id });
    
    // Scroll ke form
    window.scrollTo({ top: document.querySelector('form')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setForm(initialFormState);
    setEditMode({ isEditing: false, recipeId: null });
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!confirm("Yakin ingin menghapus resep ini?")) return;

    try {
      const res = await fetch(`/api/recipes/${recipeId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus resep");
      
      showNotification("Resep Dihapus", "Resep berhasil dihapus dari koleksi Anda");
      setMyRecipes(myRecipes.filter(r => r._id !== recipeId));
    } catch (error: any) {
      showNotification("Error", error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resep Saya</h1>
      </div>

      {/* List Resep yang Sudah Dibuat */}
      {myRecipes.length > 0 && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ChefHat size={24} className="text-blue-600" />
            Resep yang Sudah Diterbitkan ({myRecipes.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRecipes.map((recipe) => (
              <div key={recipe._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1">{recipe.title}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                    <Clock size={14} /> {recipe.time}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditRecipe(recipe)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRecipe(recipe._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {editMode.isEditing ? "Edit Resep" : "Tulis Resep Baru"}
        </h2>
        {editMode.isEditing && (
          <button
            onClick={handleCancelEdit}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <XCircle size={16} /> Batal Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
        
        {/* Upload Gambar */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Foto Masakan (Wajib)</label>
          <CldUploadWidget 
            uploadPreset="seasnacky" // Pastikan SAMA dengan dashboard Cloudinary
            onSuccess={(result: any) => setForm({ ...form, image: result.info.secure_url })}
            options={{ maxFiles: 1, resourceType: "image" }}
          >
            {({ open }) => (
              <div 
                onClick={() => open?.()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  form.image ? "border-blue-300 bg-blue-50/20" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
              >
                {form.image ? (
                  <div className="relative w-full h-64">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); setForm({...form, image: ""}) }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <ImagePlus className="mx-auto mb-2" size={32} />
                    <p>Klik untuk upload foto</p>
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>
        </div>

        {/* Info Dasar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Judul Resep</label>
            <input 
              required
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Udang Saus Padang Spesial"
              value={form.title} // ✅ Controlled Input
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimasi Waktu</label>
            <input 
              required
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: 30 Menit"
              value={form.time} // ✅ Controlled Input
              onChange={(e) => setForm({...form, time: e.target.value})}
            />
          </div>
          <div>
             <label className="block text-sm font-medium mb-1">Tingkat Kesulitan</label>
             <select 
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={form.difficulty} // ✅ Controlled Input
                onChange={(e) => setForm({...form, difficulty: e.target.value})}
             >
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sulit">Sulit</option>
             </select>
          </div>
          
          {/* FITUR WOW: Link Produk */}
          <div>
             <label className="block text-sm font-medium mb-1 text-blue-600 font-bold">Tautkan Produk Anda (Promosi)</label>
             <select 
                className="w-full p-3 border border-blue-200 bg-blue-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={form.relatedProductId} // ✅ Controlled Input
                onChange={(e) => setForm({...form, relatedProductId: e.target.value})}
             >
                <option value="">-- Pilih Produk untuk Dipromosikan --</option>
                {sellerProducts.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} - Rp {p.price}</option>
                ))}
             </select>
             <p className="text-xs text-gray-500 mt-1">Produk ini akan muncul di halaman detail resep.</p>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium mb-1">Deskripsi Singkat</label>
           <textarea 
              required
              rows={3}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ceritakan sedikit tentang rasa masakan ini..."
              value={form.description} // ✅ Controlled Input
              onChange={(e) => setForm({...form, description: e.target.value})}
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-medium mb-1">Bahan-bahan (Satu per baris)</label>
              <textarea 
                required
                rows={8}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={"500gr Udang\n2 Siung Bawang\n1 sdt Garam..."}
                value={form.ingredients}
                onChange={(e) => setForm({...form, ingredients: e.target.value})}
              />
           </div>
           <div>
              <label className="block text-sm font-medium mb-1">Cara Memasak (Satu per baris)</label>
              <textarea 
                required
                rows={8}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={"Cuci bersih udang.\nTumis bumbu halus.\nMasukkan udang..."}
                value={form.instructions} // ✅ Controlled Input
                onChange={(e) => setForm({...form, instructions: e.target.value})}
              />
           </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
            editMode.isEditing
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } disabled:opacity-70`}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Save size={20} /> {editMode.isEditing ? "Simpan Perubahan" : "Terbitkan Resep"}
            </>
          )}
        </button>

      </form>
    </div>
  );
}