"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, Loader2 } from "lucide-react"; // Pastikan lucide-react terinstall

export default function OpenShopPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(""); // State untuk simpan ID User
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  // State Form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
  });

  // 1. OTOMATIS AMBIL ID USER SAAT HALAMAN DIBUKA
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        // Cek apakah user ada ID-nya
        if (data?.user?.id) {
          // Jika user ternyata SUDAH punya toko, lempar ke dashboard
          if (data.user.hasShop) {
             router.push("/dashboard/seller");
          }
          setUserId(data.user.id);
        } else {
          // Kalau tidak login, tendang ke halaman login
          alert("Silakan login terlebih dahulu.");
          router.push("/login");
        }
      } catch (err) {
        console.error("Gagal ambil user ID");
      } finally {
        setIsCheckingUser(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Safety check
    if (!userId) return alert("Data user belum dimuat. Tunggu sebentar.");

    setIsLoading(true);

    try {
      // Kita pakai ID User yang didapat otomatis tadi
      const payload = { 
        ...formData, 
        userId: userId 
      };

      const res = await fetch("/api/shop/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal membuat toko");

      // Sukses!
      alert("🎉 Selamat! Toko berhasil dibuat. Mengalihkan ke Dashboard...");
      
      // Refresh window biar navbar terupdate (tombol berubah jadi Dashboard Toko)
      window.location.href = "/dashboard/seller"; 

    } catch (error: any) {
      alert("Gagal: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-blue-600 font-semibold">
          <Loader2 className="animate-spin" /> Memuat data akun...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <Store size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Buka Toko Seasnacky</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Isi formulir singkat di bawah ini untuk mulai berjualan produk olahan laut.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Nama Toko */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko <span className="text-red-500">*</span></label>
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
              placeholder="Jual apa aja nih? (Opsional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              rows={3}
              onChange={handleChange}
            />
          </div>

          {/* Input Alamat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap <span className="text-red-500">*</span></label>
            <textarea
              name="address"
              required
              placeholder="Jalan Ikan Hiu No. 12, Kecamatan..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              rows={2}
              onChange={handleChange}
            />
          </div>

          {/* Tombol Submit */}
          <button 
            type="submit" 
            disabled={isLoading || !userId}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Memproses...
              </>
            ) : (
              "Buka Toko Gratis 🚀"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}