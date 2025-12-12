// File: src/app/dashboard/seller/products/new/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary"; 
import { ImagePlus, X, Loader2 } from "lucide-react"; 

// --- Interface Data User yang Diharapkan dari /api/auth/me ---
interface UserData {
  id: string;
  hasShop: boolean;
  role: 'buyer' | 'seller' | 'admin';
}

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  // State Form
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "1", // Tambahkan Stock di Form
    category: "mentah",
    description: "",
    image: "", 
  });

  // 1. OTOMATIS AMBIL ID USER & OTORISASI SAAT HALAMAN DIBUKA
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        if (data?.user?.id && data.user.role === 'seller' && data.user.hasShop) {
          setUserId(data.user.id);
        } else {
          // Jika bukan seller atau belum onboarding, redirect
          alert("Akses ditolak. Pastikan Anda login sebagai seller dan toko sudah disetujui.");
          router.push("/dashboard/seller");
        }
      } catch (err) {
        console.error("Gagal ambil user ID:", err);
        router.push("/login"); // Redirect ke login jika gagal fetch
      }
    };
    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validasi sebelum submit
    if (!form.image) return setErrorMessage("Wajib upload gambar produk!");
    if (!userId) return setErrorMessage("Sedang memuat data user. Coba lagi.");

    setIsLoading(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock), // Kirim stock
        userId: userId, // Kirim ID User untuk otorisasi di backend
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Tampilkan error dari backend (misalnya: "Akses ditolak" atau "Data produk tidak valid")
        throw new Error(errorData.error || errorData.message || "Gagal menyimpan produk.");
      }

      alert("🎉 Produk berhasil ditambahkan!");
      router.push("/dashboard/seller/products"); 
      
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilan loading otorisasi
  if (!userId) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <span className="ml-3 text-gray-600 font-medium">Memuat otorisasi seller...</span>
      </div>
    );
  }

  // --- JSX (Form Tampilan) ---
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Produk Baru</h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* TAMPILAN ERROR MESSAGE */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          {/* === BAGIAN UPLOAD GAMBAR (CLOUDINARY WIDGET) === */}
          <div>
            {/* ... (Kode Cloudinary Widget seperti yang Anda berikan, tidak diubah) ... */}
            <label className="block text-sm font-medium mb-3 text-gray-700">
              Foto Produk <span className="text-red-500">*</span>
            </label>
            
            <CldUploadWidget 
              uploadPreset="seasnacky" 
              onSuccess={(result: any) => {
                setForm({ ...form, image: result.info.secure_url });
              }}
              options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["png", "jpeg", "jpg", "webp"], }}
            >
              {({ open }) => {
                return (
                  <div 
                    onClick={() => open?.()}
                    className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group ${
                      form.image ? "border-blue-300 bg-blue-50/30" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }`}
                  >
                    {/* TAMPILAN PREVIEW JIKA ADA GAMBAR */}
                    {form.image ? (
                      <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-sm">
                        <img src={form.image} alt="Preview" className="w-full h-full object-contain bg-gray-100" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            setForm({ ...form, image: "" });
                          }}
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-600 p-2 rounded-full hover:bg-red-50 hover:text-red-600 shadow-sm transition-all"
                          title="Hapus Gambar"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      // TAMPILAN BELUM UPLOAD
                      <div className="text-center py-10">
                        <div className="p-5 bg-blue-100 text-blue-600 rounded-full inline-block mb-4 group-hover:scale-110 transition-transform">
                          <ImagePlus size={40} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">
                          Klik untuk upload gambar
                        </h3>
                        <p className="text-sm text-gray-500">
                          Format: JPG, PNG, WEBP. Maksimal 1 file.
                        </p>
                      </div>
                    )}
                  </div>
                );
              }}
            </CldUploadWidget>
          </div>

          {/* === BAGIAN FORM INPUT TEKS === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Nama */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Nama Produk <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Contoh: Kerupuk Ikan Premium"
                required
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
            </div>
            {/* Input Harga */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Harga (Rp) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="15000"
                required
                min={100}
                value={form.price}
                onChange={(e) => setForm({...form, price: e.target.value})}
              />
            </div>
            {/* Input Stok */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Stok Produk <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="100"
                required
                min={1}
                value={form.stock}
                onChange={(e) => setForm({...form, stock: e.target.value})}
              />
            </div>
          </div>

          {/* Input Kategori */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Kategori <span className="text-red-500">*</span></label>
            <div className="relative">
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none transition-all"
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
              >
                <option value="mentah">🐟 Bahan Mentah</option>
                <option value="olahan">📦 Produk Olahan</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Input Deskripsi */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Deskripsi Produk</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              rows={5}
              placeholder="Jelaskan keunggulan produkmu, komposisi, cara penyajian, dll..."
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
            ></textarea>
            <p className="text-xs text-gray-400 mt-2 text-right">{form.description.length} karakter</p>
          </div>

          <div className="pt-4 border-t">
            <button 
              type="submit" 
              disabled={isLoading || !form.image} // Disable jika belum ada gambar
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-70 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> Menyimpan Produk...
                </>
              ) : (
                "🚀 Upload & Jual Sekarang"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}