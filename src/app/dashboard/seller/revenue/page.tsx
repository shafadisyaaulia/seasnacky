"use client";

import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Calendar, Download } from "lucide-react";

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: { month: string; amount: number }[];
  recentOrders: {
    id: string;
    productName: string;
    amount: number;
    date: string;
    status: string;
  }[];
}

export default function RevenuePage() {
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("month"); // month, quarter, year

  useEffect(() => {
    fetchRevenue();
  }, [period]);

  const fetchRevenue = async () => {
    try {
      const res = await fetch(`/api/dashboard/seller/revenue?period=${period}`);
      const data = await res.json();
      if (res.ok) {
        setRevenue(data);
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white p-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-xl shadow-md animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
            💰 Pendapatan Toko
          </h1>
          <p className="text-gray-600">Pantau pendapatan dan transaksi Anda</p>
        </div>

        {/* Period Filter */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setPeriod("month")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === "month"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-cyan-400"
            }`}
          >
            Bulan Ini
          </button>
          <button
            onClick={() => setPeriod("quarter")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === "quarter"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-cyan-400"
            }`}
          >
            3 Bulan
          </button>
          <button
            onClick={() => setPeriod("year")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === "year"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-cyan-400"
            }`}
          >
            Tahun Ini
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
                <DollarSign className="text-white" size={24} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                +12.5%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Pendapatan</h3>
            <p className="text-3xl font-bold text-gray-900">
              Rp {revenue?.totalRevenue.toLocaleString("id-ID") || 0}
            </p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                +8.2%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Pesanan</h3>
            <p className="text-3xl font-bold text-gray-900">
              {revenue?.recentOrders.length || 0}
            </p>
          </div>

          {/* Period */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg">
                <Calendar className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Periode</h3>
            <p className="text-3xl font-bold text-gray-900">
              {period === "month" ? "1 Bulan" : period === "quarter" ? "3 Bulan" : "1 Tahun"}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Transaksi Terbaru</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-shadow text-sm font-medium">
              <Download size={16} />
              Export
            </button>
          </div>

          {revenue?.recentOrders && revenue.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Produk</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tanggal</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Jumlah</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-cyan-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-600">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.productName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                      <td className="py-3 px-4 text-sm font-bold text-right text-green-600">
                        Rp {order.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {order.status === "completed" ? "Selesai" : order.status === "pending" ? "Pending" : order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada transaksi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
