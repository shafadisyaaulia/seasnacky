// src/app/admin/page.tsx
import Link from "next/link";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import {
  listProducts,
  listOrders,
  listReviews,
  listArticles,
  listTips,
  getDashboardSummary,
  users,
} from "@/app/api/_data/mockData";
import { formatCurrency } from "@/lib/utils";

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

export const revalidate = 0;

export default async function AdminPage() {
  const dashboard = getDashboardSummary();
  const recentOrdersData = listOrders().slice(0, 6);
  const recentOrders = recentOrdersData.map((order) => {
    const user = users.find((u) => u.id === order.userId);
    return {
      ...order,
      user: user ? { name: user.name, email: user.email } : null,
    };
  });

  const lowInventory = listProducts()
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);
  const recentReviews = listReviews().slice(0, 5);
  const latestArticles = listArticles().slice(0, 5);
  const latestTips = listTips().slice(0, 5);
  const userCount = users.length;

  const categories = Array.from(
    new Set(lowInventory.map((item) => item.category))
  ).sort();
  const defaultFolder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "seasnacky";

  const fulfillmentSummary = {
    pending: listOrders().filter((o) => o.status === "pending").length,
    dikirim: listOrders().filter((o) => o.status === "dikirim").length,
    selesai: listOrders().filter((o) => o.status === "selesai").length,
  };
  const pendingOrders = fulfillmentSummary.pending;
  const shippedOrders = fulfillmentSummary.dikirim;
  const completedOrders = fulfillmentSummary.selesai;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pt-12">
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
              <Link
                href="/"
                className="rounded-full border border-blue-200 px-5 py-3 text-blue-600 transition hover:border-blue-500 hover:text-blue-700"
              >
                Lihat Landing
              </Link>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm">
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
            <article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">
                Pesanan Pending
              </p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {formatNumber(pendingOrders)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Menunggu diproses oleh tim fulfillment
              </p>
            </article>
            <article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm">
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
            <article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm">
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
          <div className="overflow-hidden rounded-3xl border border-blue-100">
            <table className="min-w-full divide-y divide-blue-100 text-sm">
              <thead className="bg-blue-50/60">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Kode
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Pelanggan
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Pembayaran
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50 bg-white">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
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
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
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