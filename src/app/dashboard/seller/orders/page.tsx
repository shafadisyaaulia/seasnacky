"use client";

import { useState } from "react";
import { ShoppingBag, Eye, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

// DATA DUMMY (Supaya halaman tidak kosong saat Demo)
const mockOrders = [
  {
    id: "#ORD-7782",
    customer: "Budi Santoso",
    items: "Kerupuk Ikan Tenggiri (2x), Abon Tuna (1x)",
    total: 45000,
    status: "pending",
    date: "01 Des 2025",
  },
  {
    id: "#ORD-7781",
    customer: "Siti Aminah",
    items: "Udang Windu Segar 1kg",
    total: 120000,
    status: "process",
    date: "30 Nov 2025",
  },
  {
    id: "#ORD-7780",
    customer: "Rudi Hartono",
    items: "Cumi Asin Kering (500gr)",
    total: 65000,
    status: "shipped",
    date: "29 Nov 2025",
  },
  {
    id: "#ORD-7779",
    customer: "Dewi Persik",
    items: "Terasi Udang Premium (5x)",
    total: 50000,
    status: "completed",
    date: "28 Nov 2025",
  },
];

export default function SellerOrdersPage() {
  const [filter, setFilter] = useState("all");

  // Helper untuk warna status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12} /> Menunggu</span>;
      case "process": return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1"><ShoppingBag size={12} /> Diproses</span>;
      case "shipped": return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1"><Truck size={12} /> Dikirim</span>;
      case "completed": return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Selesai</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">Unknown</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pesanan Masuk</h1>
          <p className="text-gray-500 text-sm">Pantau dan kelola pesanan dari pembeli.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-1 overflow-x-auto">
        {["all", "pending", "process", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              filter === f 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            } capitalize`}
          >
            {f === "all" ? "Semua Pesanan" : f}
          </button>
        ))}
      </div>

      {/* Tabel Pesanan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Pesanan</th>
                <th className="px-6 py-4 font-semibold">Pelanggan</th>
                <th className="px-6 py-4 font-semibold">Item</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-mono text-gray-500">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.customer}
                    <div className="text-xs text-gray-400 font-normal">{order.date}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={order.items}>
                    {order.items}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    Rp {order.total.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer Tabel */}
        <div className="p-4 border-t bg-gray-50 text-center text-xs text-gray-500">
          Menampilkan {mockOrders.length} pesanan terbaru
        </div>
      </div>
    </div>
  );
}