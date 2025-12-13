"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store, Package, User, ShoppingBag, LogOut, Edit2, Save, X, Phone, MapPin, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        if (!data.user) {
          router.push("/login");
          return;
        }
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
        });
      } catch (error) {
        console.error("Gagal ambil data user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      showNotification("Data Tidak Lengkap", "Nama harus diisi");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal update profile");
      }

      const data = await res.json();
      setUser(data.data);
      setIsEditing(false);
      showNotification("Profile Diperbarui!", "Data profile Anda berhasil disimpan");
    } catch (error: any) {
      showNotification("Gagal Update", error.message || "Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6 sm:py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Profil */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {user?.name}
              </h1>
              <p className="text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-2">
                <Mail size={16} />
                {user?.email}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 capitalize">
                  <User size={12} className="mr-1" /> {user?.role}
                </span>
                {user?.hasShop && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                    <Store size={12} className="mr-1" /> Seller Aktif
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Edit2 size={18} /> 
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button 
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      window.location.href = "/login";
                    }}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-200"
                  >
                    <LogOut size={18} /> 
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Save size={18} /> 
                    {isSaving ? "..." : <span className="hidden sm:inline">Simpan</span>}
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors border"
                  >
                    <X size={18} />
                    <span className="hidden sm:inline">Batal</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details - Editable Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="text-blue-600" size={24} />
            Informasi Profile
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {user?.name || "-"}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-1" />
                Email
              </label>
              <div className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-500">
                {user?.email} <span className="text-xs">(tidak bisa diubah)</span>
              </div>
            </div>

            {/* No. Telepon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-1" />
                No. Telepon
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="08xxxxxxxxxx"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {user?.phone || "Belum diisi"}
                </div>
              )}
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Alamat Lengkap
              </label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Masukkan alamat lengkap"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 min-h-[80px]">
                  {user?.address || "Belum diisi"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA TOKO (Logika Cerdas) */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Store className="w-8 h-8" /> 
              {user?.hasShop ? "Kelola Toko Anda" : "Punya Produk Olahan Laut?"}
            </h2>
            <p className="mt-2 text-blue-50 max-w-lg">
              {user?.hasShop 
                ? "Cek pesanan masuk, update stok produk, dan pantau pendapatan toko Anda di Dashboard Seller."
                : "Bergabunglah menjadi seller di Seasnacky! Buka toko gratis dan jangkau ribuan pembeli sekarang."}
            </p>
          </div>

          <Link href={user?.hasShop ? "/dashboard/seller" : "/open-shop"} className="relative z-10">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2">
              {user?.hasShop ? "Masuk Dashboard Toko 📦" : "Buka Toko Gratis 🚀"}
            </button>
          </Link>
        </div>

        {/* Menu Grid (Statistik User) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:border-blue-200 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-lg font-bold">Riwayat Belanja</h3>
            </div>
            <p className="text-gray-500 text-sm">Lihat status pesanan yang sedang dikirim atau sudah selesai.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:border-blue-200 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                <User size={24} />
              </div>
              <h3 className="text-lg font-bold">Pengaturan Akun</h3>
            </div>
            <p className="text-gray-500 text-sm">Ubah password, alamat pengiriman, dan info pribadi.</p>
          </div>
        </div>

      </div>
    </div>
  );
}