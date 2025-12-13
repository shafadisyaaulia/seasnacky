"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store, MapPin, Edit, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface ShopInfo {
  name: string;
  address: string;
  description: string;
  status: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export default function SellerShopInfo() {
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchShopInfo();
  }, []);

  const fetchShopInfo = async () => {
    try {
      const res = await fetch("/api/dashboard/seller/stats");
      const data = await res.json();
      
      if (res.ok && data.hasShop) {
        setShop({
          name: data.shopName || "Toko Saya",
          address: data.shopAddress || "-",
          description: data.shopDescription || "-",
          status: data.shopStatus || "pending",
          bankName: data.shopBankName || "",
          bankAccountNumber: data.shopBankAccountNumber || "",
          bankAccountName: data.shopBankAccountName || "",
        });
      }
    } catch (error) {
      console.error("Error fetching shop info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            <CheckCircle size={14} />
            Aktif
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
            <Clock size={14} />
            Menunggu Persetujuan
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
            <AlertCircle size={14} />
            Ditangguhkan
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="flex-1">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl">
                <Store size={32} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Belum Punya Toko</h2>
                <p className="text-gray-600 text-sm mt-1">Buka toko gratis dan mulai berjualan sekarang!</p>
              </div>
            </div>
            <Link
              href="/open-shop"
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              🏪 Buka Toko Sekarang
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Shop Info - Kiri (Lebih Compact) */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-md flex-shrink-0">
              <Store size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-gray-900 truncate">{shop.name}</h2>
                {getStatusBadge(shop.status)}
              </div>
              <div className="flex items-start gap-1.5 text-xs text-gray-600">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                <span className="line-clamp-1">{shop.address}</span>
              </div>
            </div>
          </div>

          {/* Rekening Bank - Kanan (Compact & Biru) */}
          <div className="flex-shrink-0 w-96">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Rekening Toko
                </h3>
                <Link
                  href="/dashboard/seller/shop/edit"
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <Edit size={12} />
                  Edit
                </Link>
              </div>
              
              {shop.bankName && shop.bankAccountNumber ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Bank</p>
                    <p className="text-sm font-bold text-gray-900">{shop.bankName}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">No. Rekening</p>
                    <p className="text-sm font-mono font-bold text-gray-900">{shop.bankAccountNumber}</p>
                  </div>
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-gray-500">Atas Nama</p>
                    <p className="text-sm font-bold text-gray-900 text-right max-w-[180px]">{shop.bankAccountName}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-yellow-700 mb-2">⚠️ Rekening belum diisi</p>
                  <Link
                    href="/dashboard/seller/shop/edit"
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    Lengkapi Sekarang
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
