"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Fish, ShoppingBag, BookOpen, TrendingUp, Users, CheckCircle, Sparkles } from "lucide-react";

export default function LandingV2() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-8 py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8 animate-fade-in-down"
            >
              <Sparkles className="text-cyan-300" size={18} />
              <span className="text-white/90 text-sm font-medium">Marketplace Hasil Laut #1 di Indonesia</span>
            </div>

            {/* Main Heading */}
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-tight animate-fade-in-up"
              style={{ 
                transform: `translateY(${scrollY * 0.15}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              Menghubungkan
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-white">
                Nelayan dan Konsumen
              </span>
              <br />
              untuk Hasil Laut Segar
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Akses ribuan produk seafood segar: ikan, cumi, udang, kerang, dan banyak lagi. 
              Platform yang menghubungkan nelayan lokal dengan konsumen untuk ekonomi maritim yang berkelanjutan.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto animate-fade-in-up delay-300">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">5K+</div>
                <div className="text-blue-200 text-sm md:text-base">Produk</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">300+</div>
                <div className="text-blue-200 text-sm md:text-base">Penjual</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">34</div>
                <div className="text-blue-200 text-sm md:text-base">Provinsi</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-400">
              <Link 
                href="/products"
                className="group px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105 flex items-center gap-2"
              >
                Jelajahi Marketplace
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link 
                href="/open-shop"
                className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition-all flex items-center gap-2"
              >
                Buka Toko
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ekosistem maritim berkelanjutan:
          </h2>
          <p className="text-2xl md:text-3xl text-blue-600 font-semibold">
            perdagangan · edukasi · kolaborasi
          </p>
        </div>
      </section>

      {/* Feature 1: Marketplace */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider bg-blue-100 px-4 py-2 rounded-full">
                  Marketplace Seafood
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Marketplace
                <br />
                <span className="text-blue-600">Hasil Laut Segar</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Jelajahi marketplace untuk jual-beli hasil laut segar seperti ikan, udang, cumi, hingga rumput laut. 
                Platform yang menghubungkan nelayan dan konsumen dengan sistem verifikasi kualitas dan transaksi 
                yang transparan untuk mendukung ekonomi maritim berkelanjutan.
              </p>
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Akses marketplace hasil laut SeaSnacky untuk jual beli sekarang
                <ArrowRight size={20} />
              </Link>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-2xl overflow-hidden">
                <img 
                  src="/hasil_laut.jpg" 
                  alt="Marketplace Hasil Laut" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-200 rounded-full blur-2xl opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Recipes & Tips */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image - Left Side */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-2xl overflow-hidden">
                <img 
                  src="/resep.jpg" 
                  alt="Resep Olahan Seafood" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-200 rounded-full blur-2xl opacity-60"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-60"></div>
            </div>

            {/* Text Content - Right Side */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-block">
                <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider bg-cyan-100 px-4 py-2 rounded-full">
                  Panduan Olahan Seafood
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Resep & Tips
                <br />
                <span className="text-cyan-600">Olahan Seafood</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Pelajari cara mengolah hasil laut menjadi hidangan lezat dengan panduan dari chef profesional. 
                Dapatkan resep lengkap, tips praktis, dan tutorial video untuk mengubah seafood segar menjadi 
                sajian istimewa yang sehat dan menguntungkan.
              </p>
              <Link 
                href="/recipes"
                className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 text-white rounded-full font-bold text-lg hover:bg-cyan-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Lihat panduan resep seafood lengkap
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Dampak Positif untuk
              <br />
              Nelayan & Lingkungan
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Setiap transaksi memberikan kontribusi nyata untuk ekonomi nelayan dan keberlanjutan laut
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="text-5xl font-bold mb-2">90%</div>
              <div className="text-blue-200">Hasil Laut Segar</div>
            </div>
            <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="text-5xl font-bold mb-2">2,500+</div>
              <div className="text-blue-200">Ton Ikan Terjual</div>
            </div>
            <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="text-5xl font-bold mb-2">5 Juta</div>
              <div className="text-blue-200">Transaksi Selesai</div>
            </div>
            <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="text-5xl font-bold mb-2">300+</div>
              <div className="text-blue-200">Nelayan Mitra</div>
            </div>
          </div>

          {/* Image */}
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[16/9] rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden shadow-2xl">
              <img 
                src="/nelayan.jpg" 
                alt="Nelayan Indonesia" 
                className="w-full h-full object-cover object-bottom"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Marketplace Kami
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
              Jual & Beli Hasil Laut Segar
            </h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Bergabunglah dengan marketplace terpercaya untuk menjual hasil laut Anda dengan harga terbaik 
              atau temukan seafood berkualitas untuk kebutuhan bisnis Anda. Dapatkan verifikasi kualitas, 
              sistem pembayaran aman, dan pengiriman ke seluruh Indonesia.
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Mulai jual beli hasil laut di marketplace SeaSnacky
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Features Marquee */}
          <div className="relative overflow-hidden mb-12">
            <div className="flex gap-6 animate-scroll-left whitespace-nowrap py-4">
              {[
                "Verifikasi Kualitas Produk",
                "Sistem Pembayaran Aman", 
                "Pengiriman ke Seluruh Indonesia",
                "Customer Support 24/7",
                "Garansi Uang Kembali",
                "Sertifikat Halal Tersedia",
                "Bulk Order Discount",
                "Konsultasi Gratis"
              ].map((feature, i) => (
                <div key={i} className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-full">
                  <CheckCircle className="text-blue-600" size={20} />
                  <span className="text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                "Verifikasi Kualitas Produk",
                "Sistem Pembayaran Aman", 
                "Pengiriman ke Seluruh Indonesia",
                "Customer Support 24/7"
              ].map((feature, i) => (
                <div key={`dup-${i}`} className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-full">
                  <CheckCircle className="text-blue-600" size={20} />
                  <span className="text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Cards Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200">
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    [Produk {i}]
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Nama Produk
                  </h4>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                    Deskripsi singkat produk seafood segar berkualitas tinggi
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">Rp 50.000</span>
                    <span className="text-sm text-gray-500">Stok: 100 kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-blue-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <Fish className="mx-auto mb-6 text-cyan-200" size={64} />
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Siap Bergabung dengan Ekosistem Maritim?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
            Mulai jual hasil tangkapan Anda atau beli seafood segar langsung dari nelayan. 
            Daftar gratis dan mulai transaksi hari ini!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/open-shop"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <Users size={24} />
              Buka Toko Gratis
            </Link>
            <Link 
              href="/products"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all flex items-center gap-2"
            >
              Jelajahi Produk
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: backwards;
        }

        .delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: backwards;
        }

        .delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: backwards;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>
    </main>
  );
}
