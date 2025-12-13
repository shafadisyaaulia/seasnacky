"use client";

import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalRevenue: number;
  activeProducts: number;
  newOrders: number;
  totalOrders: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    activeProducts: 0,
    newOrders: 0,
    totalOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasShop, setHasShop] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/seller/stats");
      const data = await res.json();
      
      if (res.ok) {
        setStats(data.stats);
        setHasShop(data.hasShop);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Selamat Datang! 👋</h1>
        <p className="text-gray-600 mt-2">Kelola toko dan produk Anda dengan mudah</p>
      </div>
      
      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Pendapatan</p>
              {isLoading ? (
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-1 text-green-600">
                  {formatRupiah(stats.totalRevenue)}
                </h3>
              )}
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Produk Aktif</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-1">{stats.activeProducts}</h3>
              )}
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Package size={20} />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Pesanan Baru</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-1">{stats.newOrders}</h3>
              )}
            </div>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <ShoppingCart size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* CTA Tambah Produk */}
        {!isLoading && hasShop && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Tambah Produk Baru</h3>
                <p className="text-blue-100 text-sm">Upload produk seafood Anda</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Package size={24} />
              </div>
            </div>
            <Link 
              href="/dashboard/seller/products" 
              className="inline-block bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm"
            >
              + Kelola Produk
            </Link>
          </div>
        )}

        {/* CTA Lihat Pesanan */}
        {!isLoading && hasShop && (
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Kelola Pesanan</h3>
                <p className="text-orange-100 text-sm">Cek pesanan masuk dari pembeli</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <ShoppingCart size={24} />
              </div>
            </div>
            <Link 
              href="/dashboard/seller/orders" 
              className="inline-block bg-white text-orange-600 px-5 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-sm"
            >
              Lihat Pesanan
            </Link>
          </div>
        )}
      </div>

      {/* Info Toko Belum Ada */}
      {!isLoading && !hasShop && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Belum Punya Toko</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Buka toko gratis dan mulai jual produk seafood Anda ke seluruh Indonesia!</p>
          <Link 
            href="/open-shop" 
            className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            🏪 Buka Toko Sekarang
          </Link>
        </div>
      )}
    </div>
  );
}