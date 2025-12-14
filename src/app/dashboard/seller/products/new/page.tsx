// File: src/app/dashboard/seller/products/new/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary"; 
import { ImagePlus, X, Loader2 } from "lucide-react"; 
import toast from "react-hot-toast";

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
    unit: "kg",
    stock: "1", 
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
          toast.error("Akses ditolak. Pastikan Anda login sebagai seller yang terotorisasi.");
          router.push("/dashboard/seller");
        }
      } catch (err) {
        console.error("Gagal ambil user ID:", err);
        router.push("/login");
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
        stock: Number(form.stock), 
        userId: userId,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || "Gagal menyimpan produk.");
      }

      toast.success("🎉 Produk berhasil ditambahkan!"); 
      router.push("/dashboard/seller/products"); 
      
    } catch (error: any) {
      setErrorMessage(error.message);
      toast.error(error.message);
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header dengan Gradient */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Tambah Produk Baru
        </h1>
        <p className="text-gray-600">Lengkapi informasi produk Anda untuk mulai berjualan</p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* TAMPILAN ERROR MESSAGE */}
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg shadow-sm" role="alert">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <span className="font-medium">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* === BAGIAN UPLOAD GAMBAR (CLOUDINARY WIDGET) === */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-100">
            <label className="block text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📸</span>
              Foto Produk <span className="text-red-500">*</span>
            </label>
            
            <CldUploadWidget 
              uploadPreset="seasnacky" 
              onSuccess={(result: any) => {
                setForm({ ...form, image: result.info.secure_url });
              }}
              options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["png", "jpeg", "jpg", "webp"] }}
            >
              {({ open }) => (
                <div 
                  onClick={() => open?.()}
                  className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${
                    form.image ? "border-blue-400 bg-white shadow-inner" : "border-blue-300 hover:border-blue-500 hover:bg-white hover:shadow-md"
                  }`}
                >
                  {/* TAMPILAN PREVIEW JIKA ADA GAMBAR */}
                  {form.image ? (
                    <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg border-2 border-blue-200">
                      <img src={form.image} alt="Preview" className="w-full h-full object-contain bg-white" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setForm({ ...form, image: "" });
                        }}
                        className="absolute top-4 right-4 bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                        title="Hapus Gambar"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    // TAMPILAN BELUM UPLOAD
                    <div className="text-center py-12">
                      <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full inline-block mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                        <ImagePlus size={48} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Klik untuk upload gambar produk
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Format: JPG, PNG, WEBP
                      </p>
                      <p className="text-xs text-gray-500">
                        Maksimal 1 file, ukuran hingga 10MB
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CldUploadWidget>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* === BAGIAN FORM INPUT TEKS === */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Detail Produk
            </h2>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Input Nama */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full p-3.5 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Contoh: Kerupuk Ikan Premium"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>

              {/* Input Harga */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  className="w-full p-3.5 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="15000"
                  required
                  min={100}
                  value={form.price}
                  onChange={(e) => setForm({...form, price: e.target.value})}
                />
              </div>

              {/* Input Satuan */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    className="w-full p-3.5 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white appearance-none transition-all cursor-pointer"
                    value={form.unit}
                    onChange={(e) => setForm({...form, unit: e.target.value})}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="gram">Gram (g)</option>
                    <option value="pcs">Pcs</option>
                    <option value="pack">Pack</option>
                    <option value="box">Box</option>
                    <option value="liter">Liter (L)</option>
                    <option value="ml">Mililiter (mL)</option>
                    <option value="dozen">Lusin</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Stok - Full width below */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Stok Produk <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  className="w-full p-3.5 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
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
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  className="w-full p-3.5 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white appearance-none transition-all cursor-pointer"
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                >
                  <option value="mentah">🐟 Bahan Mentah</option>
                  <option value="olahan">📦 Produk Olahan</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Input Deskripsi */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Deskripsi Produk</label>
              <textarea 
                className="w-full p-4 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                rows={6}
                placeholder="Jelaskan keunggulan produkmu, komposisi, cara penyajian, manfaat, dll..."
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
              ></textarea>
              <p className="text-xs text-gray-500 mt-2 text-right flex items-center justify-end gap-1">
                <span className="font-medium">{form.description.length}</span> karakter
              </p>
            </div>
          </div>

          {/* Button Submit */}
          <div className="pt-6 border-t-2 border-gray-200 mt-8">
            <button 
              type="submit" 
              disabled={isLoading || !form.image} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={26} /> 
                  <span>Menyimpan Produk...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🚀</span>
                  <span>Upload & Jual Sekarang</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Pastikan semua data sudah benar sebelum mengunggah
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
