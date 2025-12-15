"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Clear any pending order data
    sessionStorage.removeItem("pendingOrder");
  }, []);

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <div className="rounded-lg border border-green-200 bg-white shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-green-700 mb-3">Pembayaran Berhasil!</h1>
        <p className="text-sky-600 mb-6">
          Terima kasih telah berbelanja di SeaSnacky. Pesanan Anda sedang diproses.
        </p>

        {/* Order Info */}
        <div className="bg-sky-50 rounded-lg p-4 mb-6 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-sky-700">Order ID</span>
            <span className="font-mono font-semibold text-sky-800">{orderId}</span>
          </div>
          <div className="text-xs text-sky-600">
            <p>✓ Pembayaran diterima</p>
            <p>✓ Pesanan akan segera diproses</p>
            <p>✓ Anda akan menerima notifikasi status pesanan</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/user/orders"
            className="block w-full bg-sky-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-sky-700 transition-colors"
          >
            Lihat Semua Pesanan Saya
          </Link>
          <Link 
            href={`/user/orders/${orderId}`}
            className="block w-full border border-sky-600 text-sky-700 rounded-lg px-6 py-3 font-medium hover:bg-sky-50 transition-colors"
          >
            Detail Pesanan Ini
          </Link>
          <Link 
            href="/products"
            className="block w-full border border-sky-300 text-sky-700 rounded-lg px-6 py-3 font-medium hover:bg-sky-50 transition-colors"
          >
            Lanjut Belanja
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-sky-100">
          <p className="text-xs text-sky-600">
            Butuh bantuan? Hubungi customer service kami di{" "}
            <a href="mailto:support@seasnacky.com" className="text-sky-700 underline">
              support@seasnacky.com
            </a>
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-3">💡 Informasi Penting</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• Pesanan akan dikirim dalam 1-3 hari kerja</li>
          <li>• Lacak pesanan di halaman <Link href="/user/orders" className="underline font-semibold">"Pesanan Saya"</Link></li>
          <li>• Nomor resi akan muncul setelah seller mengirim pesanan</li>
          <li>• Status pesanan akan diperbarui secara otomatis</li>
        </ul>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-12 px-4 text-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
