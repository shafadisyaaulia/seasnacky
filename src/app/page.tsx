// src/app/page.tsx
import Link from "next/link";
import ProductCatalog from "@/components/ProductCatalog";
import {
  listArticles,
  listProducts,
  listReviews,
  listTips,
  users,
  type User,
  type Product,
  type Review,
} from "@/app/api/_data/mockData";
import { getDashboardSnapshot } from "@/lib/services/dashboard";
import { formatCurrency } from "@/lib/utils";

function formatStatLabel(value: number, suffix: string = "+") {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K${suffix}`;
  }
  return `${value}${suffix}`;
}

function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

export const revalidate = 60;

function formatNumber(value: number) {
  if (value < 0) {
    return "0";
  }
  return new Intl.NumberFormat("id-ID").format(value);
}

export default async function Home() {
  const [dashboard, products, articles, tips, reviews] = await Promise.all([
    getDashboardSnapshot(),
    Promise.resolve(listProducts().slice(0, 8)),
    Promise.resolve(listArticles().slice(0, 4)),
    Promise.resolve(listTips().slice(0, 4)),
    Promise.resolve(listReviews().slice(0, 2)),
  ]);

  const heroStats = [
    {
      label: "Produk Olahan Laut",
      value: formatStatLabel(products.length),
    },
    {
      label: "Kategori Tersedia",
      value: formatStatLabel(
        new Set(products.map((item: Product) => item.category)).size || 1,
        ""
      ),
    },
    {
      label: "Rating Pelanggan",
      value: `${(products[0]?.rating ?? 4.9).toFixed(2)}/5`,
    },
  ];

  const featuredProducts = dashboard.topProducts
    .slice(0, 3)
    .map((product: { name: string; rating?: number; quantity?: number; revenue?: number }) => ({
      name: product.name,
      rating: product.rating ?? 4.8,
      orders: product.quantity ?? 0,
      trend: `${Math.max(
        5,
        Math.min(25, Math.round((product.revenue ?? 1) / 1_000_000))
      )}% QoQ`,
    }));

  const knowledgeBase = [
    ...articles.map((article) => ({
      category: article.category,
      title: article.title,
      timeframe: article.readingTime || "5 menit baca",
      description: truncate(article.summary ?? "", 110),
      url: `/articles/${article.id}`,
    })),
    ...tips.map((tip) => ({
      category: "Tips Penyimpanan",
      title: tip.title,
      timeframe: tip.duration || "3 menit baca",
      description: truncate(tip.detail ?? "", 110),
      url: `/tips/${tip.id}`,
    })),
  ].slice(0, 4);

  const dashboardSignals = [
    {
      title: "Revenue Paid",
      stat: formatCurrency(dashboard.summary.totalRevenue),
      description: "Akumulasi pembayaran berhasil 12 bulan terakhir.",
      indicator: [68, 72, 80, 86, 94, 105],
    },
    {
      title: "Produk Terlaris",
      stat: dashboard.topProducts[0]?.name ?? "SeaSnacky Mix",
      description: `${formatNumber(
        dashboard.topProducts[0]?.quantity ?? 0
      )} unit terjual dengan rating ${(
        dashboard.topProducts[0]?.rating ?? 4.9
      ).toFixed(2)}.`,
      indicator: [32, 40, 45, 52, 64, 70],
    },
    {
      title: "Pengguna Aktif",
      stat: `${formatNumber(dashboard.summary.activeUsers)} pengguna`,
      description: "Konversi checkout-ke-bayar mencapai 78%",
      indicator: [40, 48, 56, 63, 78, 84],
    },
  ];

  const testimonials = reviews.map((review) => {
    const user = users.find((u) => u.id === review.userId);
    return {
      name: user ? user.name : "Pelanggan SeaSnacky",
      quote: truncate(review.comment ?? "", 180),
    };
  });

  const heroProduct = products[0];

  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-gradient-to-br from-sky-100 via-white to-white" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 pb-6 pt-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold tracking-tight text-white shadow-lg">
            SS
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
              SeaSnacky
            </p>
            <p className="text-xl font-semibold text-slate-900">
              Marketplace & Intelligence Hub
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          <a href="#shop" className="transition-colors hover:text-blue-600">
            Marketplace
          </a>
          <a href="#edu" className="transition-colors hover:text-blue-600">
            Edukasi
          </a>
          <a href="#dashboard" className="transition-colors hover:text-blue-600">
            Dashboard
          </a>
          <a href="#reviews" className="transition-colors hover:text-blue-600">
            Review
          </a>
        </nav>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link
            href="/user/login" // <--- MENJADI SEPERTI INI
            className="rounded-full border border-blue-200 px-4 py-2 text-blue-600 transition hover:border-blue-500 hover:text-blue-700"
          >
            Masuk Pengguna
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg transition hover:bg-blue-700"
          >
            Portal Admin
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-28 px-6 pb-24">
        <section className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-10">
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
              SeaSnacky Marketplace
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Solusi <span className="gradient-text">camilan laut</span>{" "}
                modern untuk bisnis dan gaya hidup sehat.
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                Jelajahi kurasi produk laut premium dengan metadata nutrisi
                lengkap, konten edukasi siap pakai, dan insight penjualan
                real-time.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#shop"
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:bg-blue-700"
              >
                Belanja Sekarang
              </Link>
              <Link
                href="#dashboard"
                className="rounded-full border border-blue-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 transition hover:border-blue-500 hover:text-blue-700"
              >
                Lihat Dashboard
              </Link>
            </div>
            <dl className="grid gap-8 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-blue-100 bg-white/80 p-6 shadow-sm"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                    {item.label}
                  </dt>
                  <dd className="mt-4 text-3xl font-semibold text-slate-900">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative flex h-full flex-col gap-6 rounded-[40px] bg-white/70 p-8 shadow-[0_40px_80px_-48px_rgba(37,99,235,0.45)] ring-1 ring-blue-100 lg:ml-auto">
            <div className="rounded-[32px] bg-blue-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                Highlight Produk Minggu Ini
              </p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">
                {heroProduct?.name ?? "Seaweed Crunch Mix"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {truncate(
                  heroProduct?.description ??
                    "Camilan laut kaya mineral dengan tekstur renyah.",
                  140
                )}
              </p>
            </div>
            <div className="frosted rounded-[32px] border border-white/50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                Snapshot Penjualan
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {formatCurrency(dashboard.summary.totalRevenue)} revenue paid ·{" "}
                {dashboard.summary.reviewCount} ulasan terverifikasi
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white/90 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">
                    Pesanan Diproses
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-blue-600">
                    {formatNumber(
                      dashboard.summary.fulfillmentStatus?.diproses ?? 0
                    )}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-blue-300">
                    Dalam antrian
                  </p>
                </div>
                <div className="rounded-3xl bg-white/90 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Stok Aktif</p>
                  <p className="mt-2 text-2xl font-semibold text-blue-600">
                    {formatNumber(products.length)}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-blue-300">
                    Katalog unggulan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="shop" className="space-y-14">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Marketplace
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Kurasi camilan laut dengan standar kualitas ekspor.
            </h2>
            <p className="max-w-3xl text-base text-slate-600">
              Setiap produk melewati uji organoleptik, pencatatan batch, dan
              pengemasan dingin. Pilih untuk retail, horeca, maupun konsumen
              rumahan dengan insight margin terukur.
            </p>
          </div>

          <div className="mx-auto max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
            <ProductCatalog />
          </div>

          <div className="rounded-[40px] border border-blue-100 bg-blue-50/70 p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-slate-900">
                  Top Rated & Trending
                </h3>
                <p className="max-w-xl text-sm text-slate-600">
                  Insight otomatis memadukan rating, repeat order, dan margin
                  kontribusi untuk rekomendasi stok harian.
                </p>
              </div>
              <Link
                href="/api/products"
                className="rounded-full bg-blue-600 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-[0_16px_40px_-22px_rgba(37,99,235,0.45)] transition hover:bg-blue-700"
              >
                API Produk
              </Link>
            </div>
            <div className="mt-8 grid auto-rows-fr gap-6 md:grid-cols-3">
              {featuredProducts.map(
                (product: {
                  name: string;
                  rating: number;
                  orders: number;
                  trend: string;
                }) => (
                  <div
                    key={product.name}
                    className="flex h-full flex-col justify-between rounded-3xl bg-white p-6 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {product.name}
                    </p>
                    <dl className="mt-6 space-y-3 text-xs">
                      <div className="flex items-center justify-between uppercase tracking-[0.22em] text-slate-500">
                        <dt>Rating</dt>
                        <dd className="font-semibold text-blue-600">
                          {product.rating.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between uppercase tracking-[0.22em] text-slate-500">
                        <dt>Order</dt>
                        <dd className="font-semibold text-blue-600">
                          {formatNumber(product.orders)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between uppercase tracking-[0.22em] text-slate-500">
                        <dt>Tren</dt>
                        <dd className="font-semibold text-blue-600">
                          {product.trend}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section id="edu" className="space-y-14">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Edukasi & Inspirasi
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Resep sehat dan tips penyimpanan yang bisa diakses siapa pun.
            </h2>
            <p className="max-w-3xl text-base text-slate-600">
              Konten edukasi dikurasi oleh nutrisionis dan chef untuk
              memastikan manfaat maksimal dari bahan-bahan laut.
            </p>
          </div>
          <div className="grid auto-rows-fr gap-8 lg:grid-cols-2">
            {knowledgeBase.map(
              (item: {
                title: string;
                category: string;
                timeframe: string;
                description: string;
                url: string;
              }) => (
                <article
                  key={item.title}
                  className="group flex h-full flex-col justify-between rounded-[32px] border border-blue-100 bg-white p-8 transition duration-500 hover:-translate-y-2 hover:border-blue-300"
                >
                  <div className="space-y-4">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">
                      {item.category} · {item.timeframe}
                    </span>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                  <Link
                    href={item.url}
                    className="mt-10 inline-flex items-center text-xs font-semibold uppercase tracking-[0.24em] text-blue-600 transition hover:text-blue-700"
                  >
                    Baca selengkapnya
                  </Link>
                </article>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}