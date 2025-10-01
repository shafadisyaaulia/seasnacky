import Link from "next/link";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { connectToDatabase } from "@/lib/db";
import {
  ArticleModel,
  OrderModel,
  ProductModel,
  ReviewModel,
  TipModel,
  UserModel,
} from "@/lib/models";
import { getDashboardSnapshot } from "@/lib/services/dashboard";
import { formatCurrency } from "@/lib/utils";

// PERBAIKAN: Menambahkan pemeriksaan untuk nilai negatif untuk mencegah RangeError
function formatNumber(value: number) {
  if (value < 0) {
    return "0";
  }
  return new Intl.NumberFormat("id-ID").format(value);
}

function toObjectIdString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && "toString" in value) {
    try {
      const result = (value as { toString: () => string }).toString();
      return result;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function getUserDisplayName(user: unknown) {
  if (user && typeof user === "object") {
    const record = user as Record<string, unknown>;
    const name = record["name"];
    if (typeof name === "string" && name.trim()) {
      return name;
    }
    const email = record["email"];
    if (typeof email === "string" && email.trim()) {
      return email;
    }
  }
  return "Pelanggan";
}

function getReviewProductName(product: unknown) {
  if (product && typeof product === "object") {
    const record = product as Record<string, unknown>;
    const name = record["name"];
    if (typeof name === "string" && name.trim()) {
      return name;
    }
  }
  return "Produk";
}

function buildKey(prefix: string, value: unknown, fallback: string) {
  const objectId = toObjectIdString(value);
  if (objectId) {
    return `${prefix}-${objectId}`;
  }
  const safeFallback =
    typeof fallback === "string" && fallback.trim()
      ? fallback.replace(/\s+/g, "-").toLowerCase()
      : "item";
  return `${prefix}-${safeFallback}`;
}
function getPrimaryStatus(statusSummary: Record<string, number>, key: string) {
  return statusSummary[key] ?? 0;
}

export const revalidate = 0;

export default async function AdminPage() {
  await connectToDatabase();

  const [dashboard, recentOrders, lowInventory, recentReviews, latestArticles, latestTips, userCount] =
    await Promise.all([
      getDashboardSnapshot(),
      OrderModel.find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("user", "name email")
        .lean(),
      ProductModel.find({ isPublished: true })
        .sort({ stock: 1 })
        .limit(6)
        .lean(),
      ReviewModel.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("product", "name slug")
        .populate("user", "name")
        .lean(),
      ArticleModel.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      TipModel.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      UserModel.countDocuments({}),
    ]);

  const categories = Array.from(new Set(lowInventory.map((item) => item.category))).sort();
  const defaultFolder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "seasnacky";

  const fulfillmentSummary = dashboard.summary.fulfillmentStatus ?? {};
  const pendingOrders = getPrimaryStatus(fulfillmentSummary, "pending");
  const shippedOrders = getPrimaryStatus(fulfillmentSummary, "dikirim");
  const completedOrders = getPrimaryStatus(fulfillmentSummary, "selesai");

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
                Pantau performa penjualan, stok, konten edukasi, dan ulasan pelanggan dalam satu dashboard. Gunakan quick action untuk mempublikasikan produk dan konten baru secara real-time.
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">Revenue Paid</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {formatCurrency(dashboard.summary.totalRevenue)}
              </p>
              <p className="mt-2 text-xs text-slate-500">Total pembayaran terselesaikan</p>
            </article>
            <article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">Pesanan Pending</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(pendingOrders)}</p>
              <p className="mt-2 text-xs text-slate-500">Menunggu diproses oleh tim fulfillment</p>
            </article>
            <article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">Pesanan Terkirim</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(shippedOrders)}</p>
              <p className="mt-2 text-xs text-slate-500">Dalam perjalanan ke pelanggan</p>
            </article>
            <article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">Pelanggan Aktif</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(userCount)}</p>
              <p className="mt-2 text-xs text-slate-500">Total akun terdaftar di platform</p>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-[32px] border border-blue-100 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">Ringkasan Fulfillment</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Status Pesanan</h2>
                </div>
                <div className="flex gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden /> Pending
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-400" aria-hidden /> Dikirim
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden /> Selesai
                  </span>
                </div>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  { label: "Pending", value: pendingOrders, tone: "bg-blue-600" },
                  { label: "Dikirim", value: shippedOrders, tone: "bg-sky-400" },
                  { label: "Selesai", value: completedOrders, tone: "bg-emerald-400" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-blue-100 bg-blue-50/40 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                      {item.label}
                    </p>
                    <p className="mt-4 text-2xl font-semibold text-slate-900">{formatNumber(item.value)}</p>
                    <div className="mt-4 h-2 rounded-full bg-blue-100">
                      <div className={`h-2 rounded-full ${item.tone}`} style={{ width: `${Math.min(item.value, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 overflow-hidden rounded-3xl border border-blue-100">
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
                      <tr key={toObjectIdString(order._id) ?? order.code}>
                        <td className="px-4 py-3 font-semibold text-slate-900">{order.code}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {getUserDisplayName(order.user)}
                        </td>
                        <td className="px-4 py-3 text-slate-900">{formatCurrency(order.grandTotal)}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{order.paymentStatus}</td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                          Belum ada transaksi tercatat.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[32px] border border-blue-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Top Produk</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Revenue</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {dashboard.topProducts.map((product) => (
                    <li
                      key={buildKey("top", product.productId, product.slug ?? product.name ?? "product")}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">Terjual {formatNumber(product.quantity)} unit</p>
                      </div>
                      <p className="text-sm font-semibold text-blue-600">{formatCurrency(product.revenue)}</p>
                    </li>
                  ))}
                  {dashboard.topProducts.length === 0 ? (
                    <li className="text-sm text-slate-500">Belum ada data produk.</li>
                  ) : null}
                </ul>
              </div>
              <div className="rounded-[32px] border border-blue-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Rating Tertinggi</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Feedback</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {dashboard.ratingLeaders.map((product) => (
                    <li key={product.slug} className="text-sm">
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">
                        Rating {product.averageRating.toFixed(2)} · {formatNumber(product.reviewCount)} review
                      </p>
                    </li>
                  ))}
                  {dashboard.ratingLeaders.length === 0 ? (
                    <li className="text-sm text-slate-500">Belum ada penilaian pelanggan.</li>
                  ) : null}
                </ul>
              </div>
            </div>
          </section>

          <AdminQuickActions categories={categories} defaultFolder={defaultFolder} />

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[32px] border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Stok Perlu Perhatian</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Inventori</span>
              </div>
              <ul className="mt-6 space-y-4 text-sm">
                {lowInventory.map((product) => (
                  <li
                    key={buildKey("inventory", product._id, product.slug ?? product.name ?? "item")}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">Kategori: {product.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-blue-600">{formatNumber(product.stock)} unit</p>
                  </li>
                ))}
                {lowInventory.length === 0 ? (
                  <li className="text-sm text-slate-500">Stok aman untuk semua produk.</li>
                ) : null}
              </ul>
            </div>
            <div className="rounded-[32px] border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Ulasan Terbaru</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Voice of Customer</span>
              </div>
              <ul className="mt-6 space-y-5 text-sm">
                {recentReviews.map((review) => (
                  <li
                    key={buildKey(
                      "review",
                      review._id,
                      `${getReviewProductName(review.product)}-${review.rating}`,
                    )}
                  >
                    <p className="font-semibold text-slate-900">{getReviewProductName(review.product)}</p>
                    <p className="text-xs text-slate-500">
                      Rating {review.rating} · {getUserDisplayName(review.user)}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">&ldquo;{review.comment}&rdquo;</p>
                  </li>
                ))}
                {recentReviews.length === 0 ? (
                  <li className="text-sm text-slate-500">Belum ada ulasan baru.</li>
                ) : null}
              </ul>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[32px] border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Artikel Terbaru</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Konten</span>
              </div>
              <ul className="mt-6 space-y-4 text-sm">
                {latestArticles.map((article) => (
                  <li key={buildKey("article", article._id, article.slug ?? article.title ?? "article")}>
                    <p className="font-semibold text-slate-900">{article.title}</p>
                    <p className="text-xs text-slate-500">
                      {article.category} · {article.readingTime || "-"}
                    </p>
                  </li>
                ))}
                {latestArticles.length === 0 ? (
                  <li className="text-sm text-slate-500">Belum ada artikel.</li>
                ) : null}
              </ul>
            </div>
            <div className="rounded-[32px] border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Tips Penyimpanan</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Edukasi</span>
              </div>
              <ul className="mt-6 space-y-4 text-sm">
                {latestTips.map((tip) => (
                  <li key={buildKey("tip", tip._id, tip.slug ?? tip.title ?? "tip")}>
                    <p className="font-semibold text-slate-900">{tip.title}</p>
                    <p className="text-xs text-slate-500">{tip.duration || "-"}</p>
                  </li>
                ))}
                {latestTips.length === 0 ? (
                  <li className="text-sm text-slate-500">Belum ada tips penyimpanan.</li>
                ) : null}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 