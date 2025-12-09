import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Shop from "@/models/Shop"; // Pastikan model Shop ada
import Product from "@/models/Product"; // Pastikan model Product ada
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { MapPin, Store } from "lucide-react";

// Tipe Props untuk Next.js 15 (params adalah Promise)
type Props = {
  params: Promise<{ storeId: string }>;
};

// Generate Metadata Dinamis (Nama Toko di Tab Browser)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storeId } = await params;
  await connectDB();
  
  try {
    const shop = await Shop.findById(storeId);
    return {
      title: shop ? `${shop.name} - SeaSnacky` : "Toko Tidak Ditemukan - SeaSnacky",
    };
  } catch (error) {
    return { title: "Toko - SeaSnacky" };
  }
}

export default async function StorePage({ params }: Props) {
  const { storeId } = await params;
  await connectDB();

  let shop = null;
  let products = [];

  try {
    // 1. Cari Toko berdasarkan ID
    shop = await Shop.findById(storeId);

    // 2. Cari Produk yang 'shop' nya sama dengan ID Toko ini
    if (shop) {
      products = await Product.find({ shop: storeId }).sort({ createdAt: -1 });
    }
  } catch (error) {
    console.error("Gagal mengambil data toko:", error);
  }

  // Jika Toko Tidak Ditemukan
  if (!shop) {
    return (
      <main className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl inline-block mb-4">
            <Store size={48} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Toko tidak ditemukan</h1>
        <p className="text-gray-500 mt-2 mb-6">Mungkin toko ini sudah tutup atau link yang Anda tuju salah.</p>
        <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
            Kembali Belanja
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      
      {/* Header Toko */}
      <header className="mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar Toko (Inisial) */}
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                {shop.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold">{shop.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-blue-100">
                    <MapPin size={18} />
                    <p>{shop.address || "Lokasi tidak dicantumkan"}</p>
                </div>
                {shop.description && (
                    <p className="mt-4 text-sm text-blue-50 max-w-2xl bg-black/10 p-3 rounded-lg">
                        &quot;{shop.description}&quot;
                    </p>
                )}
            </div>
        </div>
      </header>

      {/* Daftar Produk */}
      <section>
        <div className="flex items-center gap-2 mb-6">
            <Store className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Etalase Produk</h2>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">
                {products.length}
            </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.length > 0 ? (
            products.map((p: any) => (
              <ProductCard 
                key={p._id.toString()} 
                product={{
                    ...p.toObject(),
                    id: p._id.toString(), // Pastikan ID dikirim sebagai string
                    image: p.image || p.images?.[0] || '/placeholder-300.png'
                }} 
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <p className="text-gray-400 font-medium">Toko ini belum memiliki produk.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}