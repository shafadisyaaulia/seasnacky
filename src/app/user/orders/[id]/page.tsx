"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    
    async function loadOrder() {
      try {
        console.log("Fetching order:", orderId);
        const res = await fetch(`/api/orders/${orderId}`);
        console.log("Response status:", res.status);
        
        if (res.ok) {
          const response = await res.json();
          console.log("API response:", response);
          console.log("Order data:", response.data);
          setOrder(response.data || response); // API returns { data: order }
        } else {
          const errorData = await res.json();
          console.error("Order not found:", errorData);
        }
      } catch (err) {
        console.error("Failed to load order:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <p className="text-sky-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Order Tidak Ditemukan</h1>
          <Link href="/products" className="text-sky-600 underline">
            Kembali ke Belanja
          </Link>
        </div>
      </main>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Menunggu Pembayaran" },
      paid: { bg: "bg-green-100", text: "text-green-800", label: "Dibayar" },
      process: { bg: "bg-blue-100", text: "text-blue-800", label: "Diproses" },
      shipped: { bg: "bg-purple-100", text: "text-purple-800", label: "Dikirim" },
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Selesai" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Dibatalkan" },
    };
    
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link href="/products" className="text-sky-600 hover:underline mb-4 inline-block">
          ← Kembali ke Belanja
        </Link>
        <h1 className="text-3xl font-bold text-sky-800">Detail Pesanan</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-sky-600">Order ID</p>
                <p className="font-mono font-semibold text-sky-900">{orderId}</p>
              </div>
              {getStatusBadge(order.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-sky-600">Tanggal Order</p>
                <p className="font-medium text-sky-900">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-sky-600">Metode Pembayaran</p>
                <p className="font-medium text-sky-900 uppercase">
                  {order.paymentMethod ? (order.paymentMethod === "cod" ? "COD (Bayar di Tempat)" : order.paymentMethod) : "Belum dipilih"}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          {order.shippingAddress && (
            <div className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-sky-800 mb-4">Alamat Pengiriman</h3>
              <div>
                <p className="font-medium text-sky-900">{order.recipientName || order.buyerName}</p>
                <p className="text-sky-700 mt-1">{order.shippingAddress}</p>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">Item Pesanan</h3>
            <div className="space-y-4">
              {order.items && order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  <div className="w-16 h-16 bg-sky-50 rounded flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sky-900">{item.productName || item.name || "Product"}</p>
                    <p className="text-sm text-sky-600">
                      {item.quantity}x @ Rp {(item.price || 0).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sky-900">
                      Rp {((item.price || 0) * (item.quantity || 1)).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-sky-800 mb-2">Nomor Resi</h3>
              <p className="font-mono text-sky-900">{order.trackingNumber}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm sticky top-4">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">Ringkasan</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-sky-600">Subtotal</span>
                <span className="text-sky-900">Rp {((order.totalAmount || 0) - (order.shippingCost || 0)).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sky-600">Ongkir</span>
                <span className="text-sky-900">Rp {(order.shippingCost || 0).toLocaleString("id-ID")}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-sky-800">Total</span>
                <span className="text-xl font-bold text-sky-900">
                  Rp {(order.totalAmount || 0).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {order.status === "pending" && (
                <button
                  onClick={() => router.push(`/payment?orderId=${orderId}`)}
                  className="w-full bg-sky-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-sky-700 transition-colors"
                >
                  Bayar Sekarang
                </button>
              )}
              
              {order.status === "shipped" && (
                <button className="w-full bg-green-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-green-700 transition-colors">
                  Pesanan Diterima
                </button>
              )}

              <Link
                href="/products"
                className="block w-full text-center border border-sky-300 text-sky-700 rounded-lg px-4 py-2 font-medium hover:bg-sky-50 transition-colors"
              >
                Belanja Lagi
              </Link>
            </div>
          </div>

          {/* Help */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">Butuh Bantuan?</p>
            <p className="text-xs text-blue-700 mb-3">
              Hubungi customer service kami jika ada pertanyaan tentang pesanan Anda.
            </p>
            <a
              href="mailto:support@seasnacky.com"
              className="text-xs text-blue-600 underline"
            >
              support@seasnacky.com
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
