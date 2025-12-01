"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X, Loader2, Save } from "lucide-react";

export default function CreateRecipePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);

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

  // 1. Ambil Daftar Produk Seller
  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await fetch("/api/products?t=" + Date.now()); 
        const data = await res.json();
        
        if (Array.isArray(data)) {
            setSellerProducts(data);
        }
      } catch (error) {
        console.error("Gagal ambil produk", error);
      }
    };
    fetchMyProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) return alert("Wajib upload foto hasil masakan!");
    
    setIsLoading(true);

    try {
      // Convert text area menjadi Array
      const ingredientsArray = form.ingredients.split("\n").filter(line => line.trim() !== "");
      const instructionsArray = form.instructions.split("\n").filter(line => line.trim() !== "");

      const payload = {
        ...form,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
      };

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan resep");

      alert("Resep berhasil diterbitkan! 👨‍🍳");
      
      // ✅ RESET FORM SEKARANG
      setForm(initialFormState); 

      // ✅ REFRESH DAN PINDAH HALAMAN
      router.refresh(); 
      router.push("/dashboard/seller/content"); 

      // Note: Kita biarkan isLoading true sampai halaman berpindah
      // supaya user tidak bisa klik tombol lagi.

    } catch (error: any) {
      alert("Error: " + error.message);
      setIsLoading(false); // Nyalakan tombol lagi kalau error
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tulis Resep Baru</h1>

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
                value={form.ingredients} // ✅ Controlled Input
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
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-70 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Terbitkan Resep</>}
        </button>

      </form>
    </div>
  );
}