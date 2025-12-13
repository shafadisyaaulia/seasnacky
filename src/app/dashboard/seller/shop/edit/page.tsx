"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, MapPin, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useNotification } from "@/context/NotificationContext";

export default function EditShopPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
  });

  useEffect(() => {
    fetchShopInfo();
  }, []);

  const fetchShopInfo = async () => {
    try {
      const res = await fetch("/api/shop/me");
      const data = await res.json();
      
      if (res.ok && data.shop) {
        setFormData({
          name: data.shop.name || "",
          address: data.shop.address || "",
          description: data.shop.description || "",
          bankName: data.shop.bankName || "",
          bankAccountNumber: data.shop.bankAccountNumber || "",
          bankAccountName: data.shop.bankAccountName || "",
        });
      }
    } catch (error) {
      console.error("Error fetching shop:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/shop/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        showNotification("Toko Berhasil Diperbarui", "✅ Informasi toko Anda telah diperbarui");
        router.push("/dashboard/seller");
        router.refresh();
      } else {
        showNotification("Gagal Memperbarui", data.message || "Terjadi kesalahan saat memperbarui toko");
      }
    } catch (error) {
      console.error("Error updating shop:", error);
      showNotification("Error", "Terjadi kesalahan pada server");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-3xl px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-48 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        {/* Back Button */}
        <Link
          href="/dashboard/seller"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Kembali ke Dashboard
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <Store size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Edit Informasi Toko</h1>
                <p className="text-blue-100 text-sm mt-1">Perbarui detail toko Anda</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Nama Toko */}
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Store size={16} />
                Nama Toko
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Contoh: Toko Ikan Segar Mas Budi"
              />
              <p className="text-xs text-gray-500 mt-1">Nama toko yang akan ditampilkan kepada pembeli</p>
            </div>

            {/* Alamat */}
            <div>
              <label htmlFor="address" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} />
                Alamat Toko
              </label>
              <input
                type="text"
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Jl. Pasar Ikan No. 123, Jakarta Utara"
              />
              <p className="text-xs text-gray-500 mt-1">Alamat lengkap lokasi toko atau gudang Anda</p>
            </div>

            {/* Deskripsi */}
            <div>
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText size={16} />
                Deskripsi Toko (Opsional)
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Ceritakan tentang toko Anda, spesialisasi produk, atau keunggulan yang ditawarkan..."
              />
              <p className="text-xs text-gray-500 mt-1">Maksimal 500 karakter</p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Informasi Rekening Bank</h3>
              <p className="text-sm text-gray-600 mb-4">Rekening untuk menerima pembayaran dari pembeli</p>
            </div>

            {/* Nama Bank */}
            <div>
              <label htmlFor="bankName" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                🏦 Nama Bank
              </label>
              <select
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Pilih Bank</option>
                <option value="BCA">BCA (Bank Central Asia)</option>
                <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                <option value="BNI">BNI (Bank Negara Indonesia)</option>
                <option value="Mandiri">Bank Mandiri</option>
                <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                <option value="CIMB Niaga">CIMB Niaga</option>
                <option value="Danamon">Bank Danamon</option>
                <option value="Permata">Bank Permata</option>
                <option value="BTN">BTN (Bank Tabungan Negara)</option>
                <option value="BNI Syariah">BNI Syariah</option>
                <option value="Muamalat">Bank Muamalat</option>
                <option value="Lainnya">Bank Lainnya</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Bank yang akan menerima pembayaran dari pembeli</p>
            </div>

            {/* Nomor Rekening */}
            <div>
              <label htmlFor="bankAccountNumber" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                💳 Nomor Rekening
              </label>
              <input
                type="text"
                id="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value.replace(/\D/g, '') })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="1234567890"
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">Hanya angka, tanpa spasi atau karakter lain</p>
            </div>

            {/* Nama Pemilik Rekening */}
            <div>
              <label htmlFor="bankAccountName" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                👤 Nama Pemilik Rekening
              </label>
              <input
                type="text"
                id="bankAccountName"
                value={formData.bankAccountName}
                onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="BUDI SANTOSO"
              />
              <p className="text-xs text-gray-500 mt-1">Sesuai dengan nama di buku tabungan (HURUF KAPITAL)</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              >
                {isLoading ? "Menyimpan..." : "💾 Simpan Perubahan"}
              </button>
              <Link
                href="/dashboard/seller"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Tips:</strong> Gunakan nama toko yang mudah diingat dan deskripsi yang menarik untuk meningkatkan kepercayaan pembeli.
          </p>
        </div>
      </div>
    </div>
  );
}
