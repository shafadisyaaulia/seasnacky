export default function AdminOnboardingPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-400">
          Onboarding Merchant
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl">
          Bergabung sebagai mitra Marine Snack Marketplace.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Lengkapi informasi bisnis Anda, unggah portofolio produk, dan tim kami akan mengkurasi katalog dalam waktu 48 jam.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <article key={step.title} className="rounded-[28px] border border-rose-100 bg-rose-50/60 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-400">
                {step.tag}
              </p>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    tag: "Langkah 01",
    title: "Profil Legal & Dokumen",
    description: "Unggah NIB, sertifikat halal, dan hasil uji laboratorium untuk setiap produk.",
  },
  {
    tag: "Langkah 02",
    title: "Kurasi Produk",
    description: "Tim kami menilai kualitas, kapasitas produksi, dan kesiapan supply chain Anda.",
  },
  {
    tag: "Langkah 03",
    title: "Integrasi Dashboard",
    description: "Akses dashboard untuk monitoring penjualan, stok, dan promosi dalam satu platform.",
  },
  {
    tag: "Langkah 04",
    title: "Go Live & Kampanye",
    description: "Aktifkan katalog, jadwalkan kampanye pemasaran, dan terima pesanan perdana Anda.",
  },
];