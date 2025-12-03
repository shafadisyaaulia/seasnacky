"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = useState<any>(null);
  const [products, setProducts] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products first
    fetch("/api/products")
      .then((r) => r.json())
      .then((json) => {
        const list = Array.isArray(json) ? json : json.data ?? json;
        const map: Record<string, any> = {};
        (list ?? []).forEach((p: any) => {
          const productId = p._id || p.id;
          map[productId] = p;
        });
        setProducts(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    (async () => {
      try {
        const r = await fetch(`/api/orders/${id}`);
        if (!mounted) return;
        const j = await r.json();
        console.log("Order response:", j);
        
        if (j.data) {
          console.log("Parsed order from API:", j.data);
          setOrder(j.data);
        } else {
          // If API returns 404, try localStorage
          console.log("Order not found in API, checking localStorage...");
          const storedOrder = localStorage.getItem(`order_${id}`);
          if (storedOrder) {
            const parsedOrder = JSON.parse(storedOrder);
            console.log("Parsed order from localStorage:", parsedOrder);
            setOrder(parsedOrder);
          } else {
            console.log("Order not found in localStorage either");
            setOrder(null);
          }
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        // Try localStorage as fallback
        const storedOrder = localStorage.getItem(`order_${id}`);
        if (storedOrder && mounted) {
          setOrder(JSON.parse(storedOrder));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading || !order) {
    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-gray-500 mt-4">Memuat pesanan...</p>
          </div>
        </div>
      </main>
    );
  }

  const totalCalculated = order.items?.reduce((sum: number, item: any) => {
    const product = products[item.productId];
    const itemPrice = product ? product.price * item.quantity : item.price || 0;
    return sum + itemPrice;
  }, 0) || order.total || 0;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Detail Pesanan</h1>
              <p className="text-gray-500 mt-1">Order ID: <span className="font-mono font-semibold text-blue-600">{order.id}</span></p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {order.status}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">Status Pembayaran</p>
              <p className="font-semibold text-gray-800 capitalize mt-1">{order.paymentStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tanggal Pesanan</p>
              <p className="font-semibold text-gray-800 mt-1">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }) : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimasi Pengiriman</p>
              <p className="font-semibold text-gray-800 mt-1">
                {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }) : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Alamat Pengiriman */}
        {order.shippingAddress && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Alamat Pengiriman
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              {order.recipientName && <p className="font-semibold text-gray-800">{order.recipientName}</p>}
              {order.recipientPhone && <p className="text-sm text-gray-600 mt-1">{order.recipientPhone}</p>}
              <p className="text-gray-700 mt-2">{order.shippingAddress}</p>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Produk Pesanan</h2>
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item: any, index: number) => {
                const product = products[item.productId];
                const itemPrice = product ? product.price * item.quantity : item.price || 0;
                
                return (
                  <div key={item.productId || index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product?.image || product?.images?.[0] ? (
                        <Image
                          src={product.image || product.images[0]}
                          alt={product.name || "Produk"}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {product?.name || item.productId}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Jumlah: {item.quantity} {product?.unit || "pcs"}
                      </p>
                      {product?.price && (
                        <p className="text-sm text-gray-600 mt-1">
                          Rp {product.price.toLocaleString("id-ID")} × {item.quantity}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-600">
                        Rp {itemPrice.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-8">Tidak ada produk</p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Pembayaran</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({order.items?.length || 0} item)</span>
              <span>Rp {totalCalculated.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Ongkos Kirim</span>
              <span className="text-green-600 font-semibold">Gratis</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total Pembayaran</span>
              <span className="text-2xl font-bold text-blue-600">
                Rp {totalCalculated.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Kembali
            </button>
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Lacak Pesanan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
