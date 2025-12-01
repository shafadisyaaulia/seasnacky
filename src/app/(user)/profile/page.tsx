"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store, Package, User, ShoppingBag, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        if (!data.user) {
          router.push("/login"); // Kalau belum login, tendang ke login
          return;
        }
        setUser(data.user);
      } catch (error) {
        console.error("Gagal ambil data user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Profil */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Selamat datang kembali, {user?.name}!</h1>
            <p className="text-gray-500">{user?.email}</p>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border capitalize">
              Role: {user?.role}
            </div>
          </div>
          <button 
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
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