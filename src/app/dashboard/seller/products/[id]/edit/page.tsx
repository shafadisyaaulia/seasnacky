"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [productId, setProductId] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "kg",
    stock: "",
    category: "mentah",
    description: "",
    image: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { id } = await params;
        setProductId(id);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        
        if (data) {
          setForm({
            name: data.name || "",
            price: data.price ? data.price.toString() : "",
            unit: data.unit || "kg",
            stock: data.countInStock ? data.countInStock.toString() : "",
            category: data.category || "mentah",
            description: data.description || "",
            image: data.images && data.images.length > 0 ? data.images[0] : "",
          });
        }
      } catch (error) {
        console.error("Gagal ambil data produk:", error);
        toast.error("Gagal memuat data produk");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) return toast.error("Wajib upload gambar produk!");

    setIsSaving(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal update produk");

      toast.success("🎉 Produk berhasil diupdate!");
      router.push("/dashboard/seller/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <span className="ml-3 text-gray-600 font-medium">Memuat data produk...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Edit Produk
        </h1>
        <p className="text-gray-600">Perbarui informasi produk Anda</p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Upload Gambar */}
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
                    <div className="text-center py-12">
                      <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full inline-block mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                        <ImagePlus size={48} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Klik untuk upload gambar produk
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">Format: JPG, PNG, WEBP</p>
                      <p className="text-xs text-gray-500">Maksimal 1 file, ukuran hingga 10MB</p>
                    </div>
                  )}
                </div>
              )}
            </CldUploadWidget>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Detail Produk
            </h2>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <div className="pt-6 border-t-2 border-gray-200 mt-8">
            <button 
              type="submit" 
              disabled={isSaving || !form.image} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={26} /> 
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">💾</span>
                  <span>Update Produk</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Pastikan semua data sudah benar sebelum menyimpan
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
