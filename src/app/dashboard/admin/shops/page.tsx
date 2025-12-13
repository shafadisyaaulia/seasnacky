"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, MapPin, User, Loader2 } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";

interface Shop {
  _id: string;
  name: string;
  address: string;
  description: string;
  status: string;
  sellerId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await fetch("/api/dashboard/admin/shops");
      const data = await res.json();
      if (res.ok) {
        setShops(data.shops || []);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (shopId: string) => {
    setActionLoading(shopId);
    try {
      const res = await fetch(`/api/dashboard/admin/shops/${shopId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });

      if (res.ok) {
        alert("✅ Toko berhasil disetujui!");
        fetchShops();
      } else {
        alert("❌ Gagal menyetujui toko");
      }
    } catch (error) {
      alert("❌ Terjadi kesalahan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (shopId: string) => {
    if (!confirm("Yakin ingin menolak toko ini?")) return;

    setActionLoading(shopId);
    try {
      const res = await fetch(`/api/dashboard/admin/shops/${shopId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "suspended" }),
      });

      if (res.ok) {
        alert("🚫 Toko ditolak");
        fetchShops();
      } else {
        alert("❌ Gagal menolak toko");
      }
    } catch (error) {
      alert("❌ Terjadi kesalahan");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-xl shadow animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const pendingShops = shops.filter((s) => s.status === "pending");
  const activeShops = shops.filter((s) => s.status === "active");
  const suspendedShops = shops.filter((s) => s.status === "suspended");

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🏪 Kelola Toko</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingShops.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{activeShops.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-3xl font-bold text-red-600">{suspendedShops.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Shops */}
        {pendingShops.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⏳ Toko Menunggu Persetujuan</h2>
            <div className="space-y-4">
              {pendingShops.map((shop) => (
                <div key={shop._id} className="bg-white rounded-xl shadow-md border border-yellow-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{shop.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p className="flex items-center gap-2">
                          <MapPin size={14} /> {shop.address}
                        </p>
                        <p className="flex items-center gap-2">
                          <User size={14} /> {shop.sellerId.name} ({shop.sellerId.email})
                        </p>
                        <p className="text-gray-500">{shop.description || "Tidak ada deskripsi"}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        Didaftarkan: {new Date(shop.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="flex gap-3 ml-4">
                      <button
                        onClick={() => handleApprove(shop._id)}
                        disabled={actionLoading === shop._id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading === shop._id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <>
                            <CheckCircle size={16} /> Setujui
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(shop._id)}
                        disabled={actionLoading === shop._id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading === shop._id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <>
                            <XCircle size={16} /> Tolak
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Shops */}
        {activeShops.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Toko Aktif</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeShops.map((shop) => (
                <div key={shop._id} className="bg-white rounded-xl shadow-md border border-green-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{shop.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{shop.sellerId.name}</p>
                  <p className="text-xs text-gray-400">{shop.address}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No pending shops */}
        {pendingShops.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">Tidak ada toko yang menunggu persetujuan</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
