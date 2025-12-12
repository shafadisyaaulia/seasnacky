"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Truck, CheckCircle, Clock, Loader2, RefreshCw, X } from "lucide-react";
import { requestNotificationPermission, notifyNewOrder } from "@/lib/notifications";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const previousOrderCount = useRef(0);
  
  // State Modal & Resi
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [resiInput, setResiInput] = useState(""); // <--- Input Resi

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        const newOrders = data.data;
        
        // Check for new orders
        if (previousOrderCount.current > 0 && newOrders.length > previousOrderCount.current) {
          const latestOrder = newOrders[0];
          notifyNewOrder(
            latestOrder._id,
            latestOrder.buyerName,
            latestOrder.totalAmount
          );
        }
        
        previousOrderCount.current = newOrders.length;
        setOrders(newOrders);
      } else if (Array.isArray(data)) {
        setOrders(data);
        previousOrderCount.current = data.length;
      }
    } catch (error) {
      console.error("Gagal ambil data pesanan", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Poll for new orders every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Fungsi Update Status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    // Validasi Resi jika mau kirim barang
    if (newStatus === 'shipped' && !resiInput) {
        return alert("Harap masukkan Nomor Resi terlebih dahulu!");
    }

    if (!confirm(`Ubah status pesanan menjadi "${newStatus}"?`)) return;
    
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            status: newStatus,
            trackingNumber: resiInput // Kirim Resi ke Backend
        }),
      });

      if (res.ok) {
        alert("✅ Status berhasil diperbarui!");
        setSelectedOrder(null);
        setResiInput(""); // Reset input resi
        fetchOrders(); 
      } else {
        alert("Gagal update status.");
      }
    } catch (error) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12} /> Menunggu</span>;
      case "process": return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><ShoppingBag size={12} /> Diproses</span>;
      case "shipped": return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck size={12} /> Dikirim</span>;
      case "completed": return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12} /> Selesai</span>;
      default: return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Unknown</span>;
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pesanan Masuk</h1>
          <p className="text-gray-500 text-sm">Kelola pesanan dan update resi pengiriman.</p>
          <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Auto-refresh setiap 10 detik
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b pb-1 overflow-x-auto">
        {["all", "pending", "process", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              filter === f ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            } capitalize`}
          >
            {f === "all" ? "Semua" : f}
          </button>
        ))}
        <button onClick={fetchOrders} className="ml-auto text-gray-400 hover:text-blue-600 p-2"><RefreshCw size={18} /></button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Belum ada pesanan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Pelanggan</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs">#{order._id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.buyerName}
                      <div className="text-xs text-gray-400 font-normal">{new Date(order.createdAt).toLocaleDateString("id-ID")}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">Rp {order.totalAmount?.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                            setSelectedOrder(order); 
                            setResiInput(order.trackingNumber || ""); // Isi resi jika sudah ada
                        }} 
                        className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      >
                        Detail & Proses
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DETAIL PESANAN */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Detail Pesanan</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-xs text-gray-500">ID Pesanan</p>
                  <p className="font-mono font-bold text-gray-800">#{selectedOrder._id}</p>
                </div>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>

              {/* TAMPILKAN RESI JIKA SUDAH ADA */}
              {selectedOrder.trackingNumber && (
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                      <p className="text-xs text-purple-600 font-bold uppercase">Nomor Resi Pengiriman</p>
                      <p className="text-lg font-mono font-bold text-gray-800 tracking-wider">{selectedOrder.trackingNumber}</p>
                  </div>
              )}

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 border-b pb-2">Produk Dipesan</h4>
                {selectedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded border overflow-hidden">
                       {item.productId?.images && item.productId.images[0] && <img src={item.productId.images[0]} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{item.productName}</p>
                      <p className="text-xs text-gray-500">{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                    <p className="font-bold text-sm text-gray-800">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                <span className="font-semibold text-blue-800">Total Pendapatan</span>
                <span className="font-bold text-xl text-blue-700">Rp {selectedOrder.totalAmount?.toLocaleString("id-ID")}</span>
              </div>

            </div>

            {/* Footer Modal: Tombol Aksi */}
            <div className="p-6 border-t bg-gray-50">
              <p className="text-xs text-gray-500 mb-3 font-semibold text-center uppercase tracking-wider">Update Status Pesanan</p>
              <div className="space-y-3">
                
                {/* 1. TOMBOL TERIMA PESANAN */}
                {selectedOrder.status === 'pending' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'process')}
                    disabled={isUpdating}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    {isUpdating ? "Memproses..." : "Terima & Proses Pesanan"}
                  </button>
                )}

                {/* 2. FORM INPUT RESI (MUNCUL KALAU STATUS DIPROSES) */}
                {selectedOrder.status === 'process' && (
                  <div className="bg-white p-4 border rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Masukkan Nomor Resi</label>
                    <input 
                        type="text"
                        placeholder="Contoh: JNE-12345678"
                        className="w-full p-2 border rounded mb-3 font-mono uppercase focus:ring-2 focus:ring-purple-500 outline-none"
                        value={resiInput}
                        onChange={(e) => setResiInput(e.target.value)}
                    />
                    <button 
                        onClick={() => handleUpdateStatus(selectedOrder._id, 'shipped')}
                        disabled={isUpdating || !resiInput}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                    >
                        {isUpdating ? "Mengirim..." : "📦 Kirim Barang (Input Resi)"}
                    </button>
                  </div>
                )}

                {/* 3. TOMBOL SELESAI */}
                {selectedOrder.status === 'shipped' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'completed')}
                    disabled={isUpdating}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    {isUpdating ? "Memproses..." : "✅ Tandai Selesai (Diterima)"}
                  </button>
                )}

                {selectedOrder.status === 'completed' && (
                  <div className="text-center p-2 bg-green-100 text-green-700 rounded-lg font-bold text-sm">
                    Pesanan Selesai
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}