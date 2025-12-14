// File: src/app/page.tsx
"use client"; // Diubah menjadi Client Component

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Star, BookOpen, Lightbulb, Users, Store, Loader2, Clock, ChefHat, Eye, Calendar } from "lucide-react";
import ProductCatalog from "@/components/ProductCatalog";
import SpotlightCard from "@/components/SpotlightCard";
import toast from 'react-hot-toast'; // Import Toast

interface Recipe {
  _id: string;
  title: string;
  slug: string;
  image: string;
  difficulty: string;
  cookingTime: number;
  servings: number;
}

interface Tip {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  category: string;
  authorName: string;
  views: number;
  createdAt: string;
}

// --- DATA DUMMY SEMENTARA (Tidak berubah) ---
const testimonials = [ /* ... */ ];
const articles = [ /* ... */ ];

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [tips, setTips] = useState<Tip[]>([]);
    const [recipesLoading, setRecipesLoading] = useState(true);
    const [tipsLoading, setTipsLoading] = useState(true);

    // 1. Logic Fetch User di Client-side
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                
                // console.log untuk logging
                console.log("Seseorang membuka Halaman Home SeaSnacky. User:", data.user ? data.user.name : "Guest");
                
                setUser(data.user);
            } catch (error) {
                console.error("Failed to fetch user status:", error);
            } finally {
                setIsLoadingUser(false);
            }
        };
        fetchUser();
    }, []);

    // Fetch Recipes
    useEffect(() => {
        const fetchRecipes = async () => {
            setRecipesLoading(true);
            try {
                const res = await fetch("/api/recipes");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setRecipes(data.slice(0, 4)); // Get 4 recipes
                }
            } catch (error) {
                console.error("Gagal ambil resep", error);
            } finally {
                setRecipesLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    // Fetch Tips
    useEffect(() => {
        const fetchTips = async () => {
            setTipsLoading(true);
            try {
                const res = await fetch("/api/tips");
                const data = await res.json();
                if (data.tips && Array.isArray(data.tips)) {
                    setTips(data.tips.slice(0, 4)); // Get 4 tips
                }
            } catch (error) {
                console.error("Gagal ambil tips", error);
            } finally {
                setTipsLoading(false);
            }
        };
        fetchTips();
    }, []);
    
    // Tentukan status user
    const isLoggedIn = !!user?.id;
    const isPendingSeller = user?.hasShop && user.role === 'buyer';
    const isSeller = user?.role === 'seller';


    return (
        <main className="min-h-screen bg-white">
            
            {/* 🛑 Notifikasi Status PENDING Seller (HANYA MUNCUL DI ATAS) */}
            {isPendingSeller && (
                <div className="bg-yellow-100 text-yellow-800 p-3 text-center text-sm font-semibold sticky top-0 z-40 border-b border-yellow-200 shadow-sm">
                    <Store className="inline w-4 h-4 mr-2 align-text-bottom" />
                    Pengajuan Toko Anda berstatus **PENDING**. Cek status terbaru di <Link href="/dashboard" className="underline hover:text-yellow-900">Dashboard</Link>.
                </div>
            )}
            
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

            {/* STATISTIK SINGKAT (Tidak berubah) */}
            <section className="py-10 bg-blue-50 border-b border-blue-100">
                {/* ... konten statistik ... */}
            </section>

            {/* PRODUK TERBARU (KATALOG) (Tidak berubah) */}
            <section className="py-20">
                {/* ... konten katalog ... */}
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
                    <ProductCatalog />
                    <div className="mt-8 text-center md:hidden">
                        <Link href="/products" className="text-blue-600 font-semibold hover:text-blue-800">
                            Lihat Semua Produk &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* KATALOG RESEP */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                🍳 Katalog Resep
                            </h2>
                            <p className="mt-2 text-gray-600">Inspirasi masakan laut yang lezat dan mudah</p>
                        </div>
                        <Link href="/recipes" className="text-blue-600 font-semibold hover:text-blue-800 hidden md:flex items-center gap-1">
                            Lihat Semua <ArrowRight size={18} />
                        </Link>
                    </div>

                    {recipesLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                        </div>
                    ) : recipes.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                            <p className="text-gray-500">Belum ada resep tersedia</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recipes.map((recipe) => (
                                <SpotlightCard
                                    key={recipe._id}
                                    className="!p-0 !bg-white !border-gray-200 hover:!border-blue-400 transition-all"
                                    spotlightColor="rgba(59, 130, 246, 0.15)"
                                >
                                    <Link 
                                        href={`/recipes/${recipe.slug}`}
                                        className="block group"
                                    >
                                        <div className="relative h-48 overflow-hidden rounded-t-3xl">
                                            <img 
                                                src={recipe.image} 
                                                alt={recipe.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                                                {recipe.difficulty}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {recipe.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={16} />
                                                    <span>{recipe.cookingTime} min</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <ChefHat size={16} />
                                                    <span>{recipe.servings} porsi</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </SpotlightCard>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 text-center md:hidden">
                        <Link href="/recipes" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-1">
                            Lihat Semua Resep <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* TIPS & ARTIKEL */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                💡 Tips & Artikel
                            </h2>
                            <p className="mt-2 text-gray-600">Panduan dan informasi seputar seafood</p>
                        </div>
                        <Link href="/tips" className="text-blue-600 font-semibold hover:text-blue-800 hidden md:flex items-center gap-1">
                            Lihat Semua <ArrowRight size={18} />
                        </Link>
                    </div>

                    {tipsLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                        </div>
                    ) : tips.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                            <p className="text-gray-500">Belum ada tips tersedia</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tips.map((tip) => (
                                <SpotlightCard
                                    key={tip._id}
                                    className="!p-0 !bg-white !border-gray-200 hover:!border-blue-400 transition-all"
                                    spotlightColor="rgba(59, 130, 246, 0.15)"
                                >
                                    <Link 
                                        href={`/tips/${tip.slug}`}
                                        className="flex group h-full"
                                    >
                                        {tip.image && (
                                            <div className="relative w-40 flex-shrink-0 overflow-hidden rounded-l-3xl">
                                                <img 
                                                    src={tip.image} 
                                                    alt={tip.title} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="p-5 flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                    {tip.category}
                                                </span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Eye size={12} />
                                                    <span>{tip.views}</span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {tip.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                                {tip.excerpt}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar size={12} />
                                                <span>{new Date(tip.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </SpotlightCard>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 text-center md:hidden">
                        <Link href="/tips" className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-1">
                            Lihat Semua Tips <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* EDUKASI & ARTIKEL (Tidak berubah) */}
            <section id="edu" className="py-20 bg-gray-50">
                {/* ... konten edukasi ... */}
            </section>

            {/* TESTIMONI (Tidak berubah) */}
            <section className="py-20 bg-white">
                {/* ... konten testimoni ... */}
            </section>

            {/* CTA JOIN SELLER (Disesuaikan berdasarkan status user) */}
            <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
                    <Lightbulb className="mx-auto mb-4 text-yellow-400" size={48} />
                    
                    {isSeller ? (
                         // 🚀 Jika sudah jadi seller
                        <>
                            <h2 className="text-3xl font-bold mb-4">Anda Adalah Mitra Seasnacky!</h2>
                            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
                                Kunjungi dashboard Anda untuk mengelola produk dan pesanan.
                            </p>
                            <Link href="/dashboard/seller" className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition inline-flex items-center gap-2">
                                <Users size={20} />
                                Kelola Toko
                            </Link>
                        </>
                    ) : isPendingSeller ? (
                        // ⏳ Jika status pending
                        <>
                            <h2 className="text-3xl font-bold mb-4">Pengajuan Toko Sedang Kami Proses!</h2>
                            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
                                Kami akan segera memberitahu Anda. Sementara itu, kelola akun atau cek status pengajuan.
                            </p>
                            <Link href="/dashboard" className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition inline-flex items-center gap-2">
                                <Store size={20} />
                                Cek Status Pengajuan
                            </Link>
                        </>
                    ) : (
                        // 🛒 Jika Buyer/Guest dan belum punya toko (CTA lama)
                        <>
                            <h2 className="text-3xl font-bold mb-4">Anda Nelayan atau Punya Produk Olahan Laut?</h2>
                            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
                                Bergabunglah dengan ribuan mitra kami lainnya. Buka toko gratis, jangkau pembeli lebih luas, dan tingkatkan pendapatan Anda sekarang.
                            </p>
                            <Link href="/open-shop" className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition inline-flex items-center gap-2">
                                <Users size={20} />
                                Buka Toko Gratis
                            </Link>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}