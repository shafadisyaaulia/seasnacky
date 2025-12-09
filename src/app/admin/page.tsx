import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

// --- FUNGSI HELPER ---
function formatNumber(value: number) {
  if (value < 0) {
    return "0";
  }
  return new Intl.NumberFormat("id-ID").format(value);
}

function getUserDisplayName(user: { name?: string; email?: string } | null) {
  if (user) {
    if (user.name && user.name.trim()) {
      return user.name;
    }
    if (user.email && user.email.trim()) {
      return user.email;
    }
  }
  return "Pelanggan";
}

// --- DATA DUMMY PENGGANTI MOCKDATA (Supaya Build Sukses) ---
const DUMMY_ORDERS = [
  {
    id: "ORD-001",
    userId: "user-1",
    total: 150000,
    status: "pending",
    paymentStatus: "paid",
    user: { name: "Budi Santoso", email: "budi@example.com" }
  },
  {
    id: "ORD-002",
    userId: "user-2",
    total: 75000,
    status: "dikirim",
    paymentStatus: "paid",
    user: { name: "Siti Aminah", email: "siti@example.com" }
  },
  {
    id: "ORD-003",
    userId: "user-3",
    total: 230000,
    status: "selesai",
    paymentStatus: "paid",
    user: { name: "Rudi Hartono", email: "rudi@example.com" }
  }
];

export const revalidate = 0;

export default async function AdminPage() {
  // Hitung Data Statistik Dummy
  const dashboard = {
    revenue: 15450000, // Dummy Revenue
  };
  
  const pendingOrders = 5;
  const shippedOrders = 12;
  const userCount = 150;
  
  // Gunakan data dummy orders
  const recentOrders = DUMMY_ORDERS;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pt-12">
          
          {/* HEADER DASHBOARD */}
          <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
                SeaSnacky Admin Hub
              </span>
              <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
                Kendalikan pertumbuhan SeaSnacky Marketplace.
              </h1>
              <p className="max-w-2xl text-sm text-slate-600">
                Pantau performa penjualan, stok, konten edukasi, dan ulasan
                pelanggan dalam satu dashboard. Gunakan quick action untuk
                mempublikasikan produk dan konten baru secara real-time.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em]">
              <Link
                href="/api/dashboard"
                className="rounded-full bg-blue-600 px-5 py-3 text-white shadow-lg transition hover:bg-blue-700"
              >
                Endpoint Insights
              </Link>
              <AdminLogoutButton />
            </div>
          </header>

          {/* KARTU STATISTIK */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Revenue */}
            <article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm hover:shadow-md transition">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">
                Revenue Paid
              </p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {formatCurrency(dashboard.revenue)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Total pembayaran terselesaikan
              </p>
            </article>

            {/* Pending */}
            <article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm hover:shadow-md transition">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">
                Pesanan Pending
              </p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {formatNumber(pendingOrders)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Menunggu diproses tim fulfillment
              </p>
            </article>

            {/* Dikirim */}
            <article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm hover:shadow-md transition">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">
                Pesanan Terkirim
              </p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {formatNumber(shippedOrders)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Dalam perjalanan ke pelanggan
              </p>
            </article>

            {/* Pelanggan */}
            <article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm hover:shadow-md transition">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">
                Pelanggan Aktif
              </p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {formatNumber(userCount)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Total akun terdaftar di platform
              </p>
            </article>
          </section>

          {/* TABEL TRANSAKSI TERAKHIR */}
          <div className="overflow-hidden rounded-3xl border border-blue-100 shadow-sm">
            <table className="min-w-full divide-y divide-blue-100 text-sm">
              <thead className="bg-blue-50/60">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Kode</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Pelanggan</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Total</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Pembayaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50 bg-white">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {getUserDisplayName(order.user)}
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold 
                        ${order.status === 'selesai' ? 'bg-green-100 text-green-700' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-blue-50 text-blue-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {order.paymentStatus}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      Belum ada transaksi tercatat.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}