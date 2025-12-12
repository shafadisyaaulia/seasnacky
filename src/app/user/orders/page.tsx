"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Truck, CheckCircle, Clock, Package, Eye } from "lucide-react";
import Image from "next/image";
import { requestNotificationPermission, notifyOrderStatusChange } from "@/lib/notifications";

export default function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const previousOrderStatuses = useRef<Record<string, string>>({});

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders/buyer");
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        const newOrders = data.data;
        
        // Check for status changes
        newOrders.forEach((order: any) => {
          const orderId = order._id;
          const currentStatus = order.status;
          const previousStatus = previousOrderStatuses.current[orderId];
          
          if (previousStatus && previousStatus !== currentStatus && currentStatus !== 'pending') {
            notifyOrderStatusChange(orderId, currentStatus);
          }
          
          previousOrderStatuses.current[orderId] = currentStatus;
        });
        
        setOrders(newOrders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Gagal ambil pesanan", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Poll for status updates every 15 seconds
    const interval = setInterval(fetchOrders, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
            <Clock size={12} /> Menunggu Pembayaran
          </span>
        );
      case "paid":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
            <CheckCircle size={12} /> Dibayar
          </span>
        );
      case "process":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
            <Package size={12} /> Diproses
          </span>
        );
      case "shipped":
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
            <Truck size={12} /> Dikirim
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
            <CheckCircle size={12} /> Selesai
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
            Dibatalkan
          </span>
        );
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{status}</span>;
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pesanan Saya</h1>
          <p className="text-gray-600 mt-2">Lacak dan kelola semua pesanan Anda</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            Status diperbarui otomatis setiap 15 detik
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-2 p-4 overflow-x-auto">
            {["all", "pending", "paid", "process", "shipped", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } capitalize`}
              >
                {f === "all" ? "Semua" : f === "paid" ? "Dibayar" : f === "process" ? "Diproses" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-16 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum ada pesanan</h3>
            <p className="text-gray-500 text-sm mb-6">
              Yuk mulai belanja dan nikmati berbagai produk seafood berkualitas!
            </p>
            <button
              onClick={() => router.push("/marketplace")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">ID Pesanan</p>
                      <p className="font-mono font-semibold text-gray-900">
                        #{order._id.substring(0, 12).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Tanggal Pesan</p>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                          {item.productId?.images && item.productId.images[0] ? (
                            <Image
                              src={item.productId.images[0]}
                              alt={item.productName}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.productName || item.productId?.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.quantity}x Rp {item.price?.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                    <div className="space-y-2">
                      <div>{getStatusBadge(order.status)}</div>
                      {order.trackingNumber && (
                        <p className="text-xs text-gray-600">
                          <strong>No. Resi:</strong> {order.trackingNumber}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                      <p className="text-2xl font-bold text-blue-600">
                        Rp {order.totalAmount?.toLocaleString("id-ID")}
                      </p>
                      <button
                        onClick={() => router.push(`/user/orders/${order._id}`)}
                        className="mt-3 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                      >
                        <Eye size={16} /> Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
