"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OpenShopPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // PENTING: Nanti ini diganti ID User asli dari session
      // Untuk tes, buka MongoDB Atlas -> User -> Copy _id salah satu user -> Paste disini
      // Contoh format ID: "65b2f..."
      const dummyUserId = "MASUKKAN_ID_MONGO_DB_DISINI_KALAU_MAU_TES_SUBMIT"; 
      
      const payload = { 
        ...formData, 
        userId: dummyUserId 
      };

      const res = await fetch("/api/shop/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("🎉 Selamat! Toko berhasil dibuat.");
      router.push("/dashboard/seller"); 

    } catch (error: any) {
      alert("Gagal: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Container Form */}
      <div className="max-w-lg w-full bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Buka Toko Seasnacky</h1>
          <p className="text-gray-500 mt-2">Mulai jualan olahan lautmu sekarang!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Nama Toko */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
            <input
              name="name"
              required
              placeholder="Contoh: Kerupuk Tenggiri Maknyus"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={handleChange}
            />
          </div>

          {/* Input Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
            <textarea
              name="description"
              placeholder="Jual apa aja nih?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              rows={3}
              onChange={handleChange}
            />
          </div>

          {/* Input Alamat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <textarea
              name="address"
              required
              placeholder="Jalan Ikan Hiu No. 12..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              rows={2}
              onChange={handleChange}
            />
          </div>

          {/* Tombol Submit */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sedang Memproses..." : "Buka Toko Gratis 🚀"}
          </button>
        </form>

      </div>
    </div>
  );
}