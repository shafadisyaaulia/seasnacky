import Link from "next/link";
import ProductCatalog from "@/components/ProductCatalog";
import { ArrowRight, Star, BookOpen, Lightbulb, Users } from "lucide-react";
// import logger from "@/lib/logger"; // 👈 1. IMPORT LOGGER (PENTING!)

// --- DATA DUMMY SEMENTARA ---
const testimonials = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Pengusaha Katering",
    content: "Seasnacky sangat membantu bisnis saya mendapatkan ikan segar langsung dari nelayan. Kualitas terbaik!",
    rating: 5,
  },
  {
    id: 2,
    name: "Siti Aminah",
    role: "Ibu Rumah Tangga",
    content: "Anak-anak suka sekali olahan udangnya. Pengiriman cepat dan kemasan rapi. Recommended!",
    rating: 5,
  },
  {
    id: 3,
    name: "Rudi Hartono",
    role: "Pemilik Restoran Seafood",
    content: "Platform yang transparan. Saya bisa tahu asal usul ikan yang saya beli. Sangat membantu nelayan lokal.",
    rating: 4,
  },
];

const articles = [
  {
    id: 1,
    title: "Cara Memilih Ikan Segar di Pasar",
    excerpt: "Tips mudah membedakan ikan segar dan ikan lama agar masakan Anda lebih nikmat.",
    date: "10 Jan 2024",
    category: "Tips Belanja",
  },
  {
    id: 2,
    title: "Manfaat Omega-3 Bagi Kecerdasan Anak",
    excerpt: "Mengapa ikan laut sangat penting untuk pertumbuhan otak si kecil? Simak penjelasannya.",
    date: "12 Jan 2024",
    category: "Kesehatan",
  },
  {
    id: 3,
    title: "Resep Udang Saus Padang Ala Restoran",
    excerpt: "Bikin sendiri udang saus padang yang pedas nampol di rumah. Mudah dan hemat!",
    date: "15 Jan 2024",
    category: "Resep",
  },
];

export default function Home() {
  // 👇 2. KIRIM LOG OTOMATIS SAAT HALAMAN DIBUKA
  console.log("Seseorang membuka Halaman Home SeaSnacky");
  //   page: "Home", 
  //   role: "Guest/User",
  //   timestamp: new Date().toISOString()
  // });

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 text-white py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-cyan-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-100 text-sm font-semibold mb-6 backdrop-blur-sm">
            🌊 Marketplace Hasil Laut No. 1
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 drop-shadow-sm">
            Segarnya Lautan, <br />
            <span className="text-cyan-400">Langsung ke Dapur Anda</span>
          </h1>
          <p className="mt-4 text-lg leading-8 text-blue-100 max-w-2xl">
            Hubungkan diri Anda langsung dengan nelayan lokal. Dapatkan hasil laut kualitas ekspor dengan harga terbaik, sambil mendukung ekonomi pesisir.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/products"
              className="rounded-full bg-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 transition-all transform hover:scale-105"
            >
              Mulai Belanja
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-white hover:text-cyan-300 transition flex items-center gap-1">
              Tentang Kami <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* STATISTIK SINGKAT */}
      <section className="py-10 bg-blue-50 border-b border-blue-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                    <h3 className="text-3xl font-bold text-blue-900">1.2k+</h3>
                    <p className="text-sm text-blue-600">Nelayan Bermitra</p>
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-blue-900">500+</h3>
                    <p className="text-sm text-blue-600">Jenis Produk</p>
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-blue-900">10k+</h3>
                    <p className="text-sm text-blue-600">Pelanggan Puas</p>
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-blue-900">24h</h3>
                    <p className="text-sm text-blue-600">Pengiriman Cepat</p>
                </div>
            </div>
        </div>
      </section>

      {/* PRODUK TERBARU (KATALOG) */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Tangkapan Terbaru
                </h2>
                <p className="mt-2 text-gray-600">Produk segar yang baru saja mendarat.</p>
            </div>
            <Link href="/products" className="text-blue-600 font-semibold hover:text-blue-800 hidden md:block">
                Lihat Semua &rarr;
            </Link>
          </div>
          
          {/* Ini Komponen yang connect ke MongoDB */}
          <ProductCatalog />
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/products" className="text-blue-600 font-semibold hover:text-blue-800">
                Lihat Semua Produk &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* EDUKASI & ARTIKEL */}
      <section id="edu" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Pojok Edukasi</h2>
                <p className="mt-2 text-gray-600">Wawasan seputar dunia laut dan kuliner.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <div key={article.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
                        <div className="h-48 bg-gray-200 relative">
                             <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                <BookOpen size={40} />
                             </div>
                        </div>
                        <div className="p-6">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{article.category}</span>
                            <h3 className="mt-3 text-xl font-bold text-gray-900 line-clamp-2">{article.title}</h3>
                            <p className="mt-2 text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
                            <div className="mt-4 text-xs text-gray-400">{article.date}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Kata Mereka</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testi) => (
                    <div key={testi.id} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <div className="flex gap-1 text-yellow-400 mb-4">
                            {[...Array(testi.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-gray-700 italic mb-6">"{testi.content}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                {testi.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{testi.name}</h4>
                                <p className="text-xs text-gray-500">{testi.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA JOIN SELLER */}
      <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
            <Lightbulb className="mx-auto mb-4 text-yellow-400" size={48} />
            
            <h2 className="text-3xl font-bold mb-4">Anda Nelayan atau Punya Produk Olahan Laut?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
                Bergabunglah dengan ribuan mitra kami lainnya. Buka toko gratis, jangkau pembeli lebih luas, dan tingkatkan pendapatan Anda sekarang.
            </p>
            <Link href="/open-shop" className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition inline-flex items-center gap-2">
                <Users size={20} />
                Buka Toko Gratis
            </Link>
         </div>
      </section>
    </main>
  );
}