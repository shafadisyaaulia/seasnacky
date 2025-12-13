"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Store, Package, ShoppingBag, TrendingUp, Activity } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  pendingShops: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/admin/stats");
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-white rounded-xl shadow-md animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  }

  const statsCards = [
    {
      title: "Total Pengguna",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      link: "/dashboard/admin/users",
    },
    {
      title: "Total Seller",
      value: stats?.totalSellers || 0,
      icon: Store,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Total Produk",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "from-green-500 to-emerald-500",
      link: "/dashboard/admin/products",
    },
    {
      title: "Total Pesanan",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Toko Pending",
      value: stats?.pendingShops || 0,
      icon: Activity,
      color: "from-yellow-500 to-amber-500",
      link: "/dashboard/admin/shops",
      highlight: true,
    },
    {
      title: "Total Pendapatan",
      value: `Rp ${(stats?.totalRevenue || 0).toLocaleString("id-ID")}`,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
            🎯 Admin Dashboard
          </h1>
          <p className="text-gray-600">Kelola seluruh sistem SeaSnacky</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <Link
              key={index}
              href={card.link || "#"}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 ${
                card.link ? "cursor-pointer hover:scale-105" : "cursor-default"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                  <card.icon className="text-white" size={24} />
                </div>
                {card.highlight && card.value > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold animate-pulse">
                    Action Required
                  </span>
                )}
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/admin/shops"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
            >
              <Store size={20} className="text-blue-600" />
              <span className="font-semibold text-gray-700">Kelola Toko</span>
            </Link>
            <Link
              href="/dashboard/admin/users"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
            >
              <Users size={20} className="text-purple-600" />
              <span className="font-semibold text-gray-700">Kelola User</span>
            </Link>
            <Link
              href="/dashboard/admin/products"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
            >
              <Package size={20} className="text-green-600" />
              <span className="font-semibold text-gray-700">Kelola Produk</span>
            </Link>
            <Link
              href="/dashboard/admin/logs"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow"
            >
              <Activity size={20} className="text-orange-600" />
              <span className="font-semibold text-gray-700">System Logs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}