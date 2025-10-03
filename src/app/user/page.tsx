import Link from "next/link";
// import { redirect } from "next/navigation";
// import { getAuthUser } from "@/lib/session";
// import { getUserById } from "@/app/api/_data/mockData";

// Data statis yang bisa Anda ubah nanti
const orderTimeline = [
  { id: "INV-9821", status: "Diproses", product: "Bundle Bakso Ikan Horeca", eta: "Estimasi tiba 1 Okt" },
  { id: "INV-9774", status: "Dikirim", product: "Keripik Rumput Laut Signature", eta: "Dalam pengiriman" },
  { id: "INV-9710", status: "Selesai", product: "Abon Tuna Mediterranean", eta: "Tiba 22 Sep" },
];
const suggestions = [
  { title: "Stok untuk Meal Prep Mingguan", description: "Pilih paket high-protein favorit Anda untuk bekal keluarga.", action: "Lihat Rekomendasi", href: "/api/products/recommendation" },
  { title: "Tambah Produk Frozen", description: "Nikmati diskon 15% untuk pesanan kedua produk beku.", action: "Klaim Voucher", href: "/api/orders/voucher" },
];
const educationShortlist = [
  { title: "Meal Prep Healthy Bento", category: "Resep", duration: "7 menit baca" },
  { title: "Panduan Simpan Frozen Food", category: "Tips", duration: "Video 3 menit" },
  { title: "Kombinasi Snack Seimbang", category: "Artikel", duration: "5 menit baca" },
];

export default async function UserDashboardPage() {
  // const authUser = await getAuthUser();

  // // Jika tidak ada sesi login, arahkan ke halaman login.
  // if (!authUser) {
  //   redirect("/user/login");
  // }

  // // Jika ada sesi, cari detail pengguna di data
  // const user = getUserById(authUser.sub);

  // // Jika sesi ada tapi data user (karena restart server) tidak ditemukan, arahkan juga ke login
  // if (!user) {
  //   redirect("/user");
  // }

    // Buat data pengguna palsu untuk keperluan demo
  const user = {
    id: "usr-demo",
    name: "Pengguna Demo",
    email: "demo@seasnacky.id",
    address: "Jalan Demo No. 123",
    loyaltyPoints: 1500,
    orders: ["INV-DEMO-1", "INV-DEMO-2"],
  };
  
  const profileHighlights = [
    { label: "Total Pesanan", value: user.orders.length.toString(), detail: "12 bulan terakhir" },
    { label: "Voucher Aktif", value: "4", detail: "Siap digunakan" },
    { label: "Poin Loyalti", value: user.loyaltyPoints.toLocaleString("id-ID"), detail: "Kadaluarsa 31 Des" },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-6 pt-12">
        <header className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-400">
            Dashboard Pengguna
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            Selamat datang kembali, {user.name.split(" ")[0]}.
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Kelola profil, pantau pesanan aktif, dan temukan inspirasi sehat yang dipersonalisasi khusus untuk Anda.
          </p>
        </header>
        {/* ... sisa kode JSX sama seperti sebelumnya ... */}
        <section className="grid gap-4 sm:grid-cols-3">
          {profileHighlights.map((item) => (
            <article
              key={item.label}
              className="rounded-[28px] border border-rose-100 bg-white p-6 shadow-[0_24px_60px_-52px_rgba(255,79,159,0.7)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-400">
                {item.label}
              </p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">{item.detail}</p>
            </article>
          ))}
        </section>
        <section className="rounded-[32px] border border-rose-100 bg-white p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-400">
                Status Pesanan
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">Tracking Real-time</h2>
            </div>
            <Link
              href="/api/orders"
              className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500"
            >
              Riwayat Pesanan
            </Link>
          </div>
          <div className="mt-8 space-y-4">
            {orderTimeline.map((order) => (
              <article key={order.id} className="rounded-[24px] border border-rose-100 bg-rose-50/60 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-rose-400">{order.id}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{order.product}</p>
                  </div>
                  <div className="text-right text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                    {order.status}
                  </div>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">{order.eta}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-[32px] border border-rose-100 bg-white p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-400">
                  Rekomendasi Personalisasi
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">Optimalkan stok camilan Anda</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.title}
                  className="rounded-[24px] border border-rose-100 bg-rose-50/60 p-6"
                >
                  <p className="text-sm font-semibold text-slate-900">{suggestion.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{suggestion.description}</p>
                  <Link
                    href={suggestion.href}
                    className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.35em] text-rose-500"
                  >
                    {suggestion.action}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-rose-100 bg-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-400">
                  Edukasi Cepat
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">Konten terbaru</h2>
              </div>
              <Link
                href="/api/articles"
                className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500"
              >
                API Artikel
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {educationShortlist.map((item) => (
                <div key={item.title} className="rounded-[20px] border border-rose-100 bg-rose-50/60 p-5">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-rose-400">
                    {item.category} · {item.duration}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="rounded-[32px] border border-rose-100 bg-gradient-to-r from-rose-500 via-rose-400 to-rose-600 p-8 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
                Kelola Profil
              </p>
              <h2 className="text-3xl font-semibold">Perbarui data pengiriman dan preferensi rasa.</h2>
              <p className="max-w-xl text-sm text-white/85">
                Simpan beberapa alamat, atur jadwal langganan, dan dapatkan rekomendasi rasa sesuai preferensi keluarga.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.35em]">
              <Link
                href="/api/profile"
                className="rounded-full bg-white px-6 py-3 text-rose-600 shadow-lg shadow-rose-200 transition hover:bg-rose-50"
              >
                Edit Profil
              </Link>
              <Link
                href="/api/logout"
                className="rounded-full border border-white px-6 py-3 text-center text-white transition hover:bg-white/10"
              >
                Logout Aman
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}