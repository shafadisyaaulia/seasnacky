"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { QRCodeSVG } from "qrcode.react";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clear } = useCart();
  
  const [orderData, setOrderData] = useState<any>(null);
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cod">("qris");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingOrder");
    if (pending) {
      setOrderData(JSON.parse(pending));
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0 || paymentMethod === "cod") return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, paymentMethod]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePaymentComplete = async () => {
    setLoading(true);
    try {
      console.log("Starting payment process for orderId:", orderId);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update order status to paid
      console.log("Sending payment request to API...");
      const res = await fetch("/api/orders/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentMethod,
          status: "paid"
        })
      });

      console.log("API response status:", res.status);
      
      if (res.ok) {
        const responseData = await res.json();
        console.log("Payment successful:", responseData);
        
        // Clear cart if not direct buy
        if (orderData?.isDirect) {
          sessionStorage.removeItem("directBuy");
        } else {
          clear();
        }
        
        sessionStorage.removeItem("pendingOrder");
        router.push(`/payment/success?orderId=${orderId}`);
      } else {
        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
        console.error("Payment failed:", errorData);
        alert(`Gagal memproses pembayaran: ${errorData.message || "Silakan coba lagi"}`);
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <p className="text-sky-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-sky-800 mb-2">Selesaikan Pembayaran</h1>
        <p className="text-sky-600">Order ID: <span className="font-mono">{orderId}</span></p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Timer - Only show for QRIS */}
          {paymentMethod === "qris" && (
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 font-medium">Batas Waktu Pembayaran</p>
                  <p className="text-xs text-red-600">Selesaikan pembayaran sebelum waktu habis</p>
                </div>
                <div className="text-3xl font-bold text-red-700 font-mono">
                  {formatTime(countdown)}
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-sky-800 mb-4">Pilih Metode Pembayaran</h2>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("qris")}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === "qris" 
                    ? "border-sky-500 bg-sky-50" 
                    : "border-gray-200 hover:border-sky-300"
                }`}
              >
                <div className="w-12 h-12 bg-white rounded border flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sky-800">QRIS</p>
                  <p className="text-xs text-sky-600">Scan QR dengan aplikasi e-wallet</p>
                </div>
                {paymentMethod === "qris" && (
                  <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              <button
                onClick={() => setPaymentMethod("cod")}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === "cod" 
                    ? "border-sky-500 bg-sky-50" 
                    : "border-gray-200 hover:border-sky-300"
                }`}
              >
                <div className="w-12 h-12 bg-white rounded border flex items-center justify-center">
                  <span className="text-2xl">💵</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sky-800">COD (Bayar di Tempat)</p>
                  <p className="text-xs text-sky-600">Bayar saat barang diterima</p>
                </div>
                {paymentMethod === "cod" && (
                  <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === "qris" ? (
            <div className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-sky-800 mb-4">Scan QRIS</h2>
              <div className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-lg border-2 border-sky-200 shadow-md mb-4">
                  {/* Generate scannable QR Code */}
                  <QRCodeSVG
                    value={`seasnacky://payment?orderId=${orderId}&amount=${orderData.total}&merchant=SeaSnacky&timestamp=${Date.now()}`}
                    size={256}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: "/logo.png",
                      x: undefined,
                      y: undefined,
                      height: 40,
                      width: 40,
                      excavate: true,
                    }}
                  />
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm font-semibold text-sky-800">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-sky-900">Rp {orderData.total.toLocaleString("id-ID")}</p>
                  <p className="text-xs text-sky-600 mt-1">Order ID: {orderId?.substring(0, 8)}...</p>
                </div>
                <div className="w-full space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium mb-2">📱 Cara Pembayaran:</p>
                    <ol className="text-xs text-blue-700 space-y-1">
                      <li>1. Buka aplikasi e-wallet (GoPay, OVO, Dana, ShopeePay, dll)</li>
                      <li>2. Pilih menu <strong>Scan QR</strong> atau <strong>Bayar</strong></li>
                      <li>3. Arahkan kamera ke QR Code di atas</li>
                      <li>4. Periksa nominal dan konfirmasi pembayaran</li>
                      <li>5. Klik tombol "Saya Sudah Bayar" setelah selesai</li>
                    </ol>
                  </div>
                  <div className="bg-yellow-50 rounded p-3 border border-yellow-200">
                    <p className="text-xs text-yellow-800">
                      <strong>⚠️ Note Demo:</strong> QR Code ini hanya untuk demo. Dalam production akan terhubung ke payment gateway (Midtrans/Xendit) untuk pembayaran real.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-sky-800 mb-4">COD (Cash on Delivery)</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-green-800 mb-2">Bayar Saat Barang Diterima</p>
                      <p className="text-sm text-green-700">
                        Anda akan membayar langsung kepada kurir saat menerima pesanan.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-sky-50 rounded-lg">
                  <p className="text-sm text-sky-800 font-medium mb-1">Total yang harus dibayar:</p>
                  <p className="text-3xl font-bold text-sky-900">Rp {orderData.total.toLocaleString("id-ID")}</p>
                </div>
                <div className="text-xs text-sky-600 space-y-2">
                  <p className="font-medium">Ketentuan COD:</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Siapkan uang pas saat kurir tiba</li>
                    <li>Cek kondisi paket sebelum membayar</li>
                    <li>Bayar langsung ke kurir</li>
                    <li>Minta bukti pembayaran dari kurir</li>
                  </ul>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-xs text-orange-800">
                    <strong>⚠️ Penting:</strong> Jika Anda tidak berada di lokasi saat pengiriman atau menolak paket tanpa alasan jelas, pesanan akan dibatalkan dan akun Anda mungkin dikenakan sanksi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Demo: Simulate Payment Button */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-700 mb-3">
              <strong>Mode Demo:</strong> Klik tombol di bawah untuk {paymentMethod === "qris" ? "simulasi pembayaran berhasil" : "konfirmasi pesanan COD"}
            </p>
            <button
              onClick={handlePaymentComplete}
              disabled={loading}
              className="w-full bg-green-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Memproses..." : paymentMethod === "qris" ? "✓ Saya Sudah Bayar" : "✓ Konfirmasi Pesanan COD"}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-sky-100 bg-white p-6 shadow-sm sticky top-4">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-3 mb-4">
              {orderData.items.map((item: any) => (
                <div key={item.productId} className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-sky-50 rounded flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sky-800 font-medium truncate">{item.name}</p>
                    <p className="text-sky-600 text-xs">{item.quantity}x Rp {item.price?.toLocaleString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-sky-600">
                <span>Subtotal</span>
                <span>Rp {orderData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm text-sky-600">
                <span>Ongkir</span>
                <span>Rp {(orderData.total - orderData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-sky-800 pt-2 border-t">
                <span>Total</span>
                <span>Rp {orderData.total.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-700">
              <p className="font-medium mb-1">Penerima: {orderData.customerName}</p>
              <p className="text-blue-600">{orderData.items.length} item</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
