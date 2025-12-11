"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function PaymentConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      // Fetch order details
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            setOrderData(data.data);
          }
        })
        .catch(err => console.error("Error fetching order:", err));
    }
  }, [orderId]);

  const handlePayNow = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update order status to paid
      const res = await fetch("/api/orders/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentMethod: "qris",
          status: "paid"
        })
      });

      if (res.ok) {
        // Redirect to success page
        router.push(`/payment/success?orderId=${orderId}`);
      } else {
        alert("Gagal memproses pembayaran. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600">Invalid payment link</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 rounded-full mb-4">
            <span className="text-3xl">🐟</span>
          </div>
          <h1 className="text-2xl font-bold text-sky-900 mb-1">SeaSnacky</h1>
          <p className="text-sky-600 text-sm">Konfirmasi Pembayaran QRIS</p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          {/* Amount */}
          <div className="text-center mb-6 pb-6 border-b">
            <p className="text-sm text-gray-600 mb-2">Total Pembayaran</p>
            <p className="text-4xl font-bold text-sky-900">
              Rp {parseFloat(amount || "0").toLocaleString("id-ID")}
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order ID</span>
              <span className="font-mono font-medium text-gray-900">
                {orderId?.substring(0, 12)}...
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Metode Pembayaran</span>
              <span className="font-medium text-gray-900">QRIS</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Merchant</span>
              <span className="font-medium text-gray-900">SeaSnacky</span>
            </div>
          </div>

          {/* Order Items */}
          {orderData && orderData.items && orderData.items.length > 0 && (
            <div className="mb-6 p-4 bg-sky-50 rounded-lg">
              <p className="text-sm font-medium text-sky-900 mb-3">Detail Pesanan:</p>
              <div className="space-y-2">
                {orderData.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.productName} <span className="text-gray-500">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl py-4 font-semibold text-lg hover:from-sky-700 hover:to-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Memproses Pembayaran...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">✓</span>
                Bayar Sekarang
              </span>
            )}
          </button>

          {/* Security Info */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-800 text-center">
              🔒 Transaksi ini aman dan terenkripsi
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Dengan melanjutkan, Anda menyetujui <span className="text-sky-600">Syarat & Ketentuan</span> SeaSnacky
          </p>
        </div>
      </div>
    </main>
  );
}
