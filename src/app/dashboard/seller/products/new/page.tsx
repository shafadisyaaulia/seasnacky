"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "mentah", // Default category
    description: "",
    image: "", // Nanti kita ganti upload beneran, skrg pakai URL gambar dulu
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // PENTING: Ganti ID User ini dengan ID User kamu yang sudah punya Toko
      const dummyUserId = "692320a73f71b6dcc5be9cea"; 

      const payload = {
        ...form,
        price: Number(form.price),
        userId: dummyUserId
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal upload produk");

      alert("Produk berhasil ditambahkan!");
      router.push("/dashboard/seller"); // Balik ke dashboard
      
    } catch (error) {
      alert("Error: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Produk</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-lg"
            required
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
            <input 
              type="number" 
              className="w-full p-2 border rounded-lg"
              required
              onChange={(e) => setForm({...form, price: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select 
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setForm({...form, category: e.target.value})}
            >
              <option value="mentah">Bahan Mentah (Ikan, Udang)</option>
              <option value="olahan">Produk Olahan (Kerupuk, Abon)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL Gambar (Sementara)</label>
          <input 
            type="text" 
            placeholder="https://contoh.com/gambar-ikan.jpg"
            className="w-full p-2 border rounded-lg"
            onChange={(e) => setForm({...form, image: e.target.value})}
          />
          <p className="text-xs text-gray-400 mt-1">*Nanti kita ganti fitur upload gambar</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea 
            className="w-full p-2 border rounded-lg"
            rows={4}
            onChange={(e) => setForm({...form, description: e.target.value})}
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Menyimpan..." : "Upload Produk"}
        </button>
      </form>
    </div>
  );
}