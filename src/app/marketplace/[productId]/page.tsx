import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";

// Fungsi untuk format Rupiah
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  // 1. Ambil ID dari URL (Next.js 15 butuh await)
  const { productId } = await params;

  // 2. Konek Database & Cari Produk
  await connectDB();
  
  // Cari produk berdasarkan ID
  // Kita bungkus try-catch jaga-jaga kalau ID-nya formatnya salah (bukan ObjectID)
  let product = null;
  try {
      product = await Product.findById(productId);
  } catch (e) {
      console.error("Invalid Product ID");
  }

  // 3. Jika tidak ketemu, tampilkan 404
  if (!product) {
    return notFound();
  }

  // 4. Render Halaman Detail
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tombol Kembali */}
        <Link
          href="/marketplace"
          className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Marketplace
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* BAGIAN GAMBAR */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
             {/* Gunakan gambar dari DB atau placeholder */}
             <Image
                src={product.images && product.images[0] || "/placeholder-product.png"}
                alt={product.name}
                fill
                className="object-cover object-center"
                priority
              />
          </div>

          {/* BAGIAN INFO PRODUK */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
            
            <div className="mt-3 flex items-center">
              <div className="flex text-yellow-400">
                 {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} />
                 ))}
              </div>
              <p className="ml-3 text-sm text-gray-500">4.8 (Belum ada ulasan)</p>
            </div>

            <div className="mt-6">
              <h2 className="sr-only">Deskripsi</h2>
              <p className="text-base text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mt-8 flex items-end gap-4">
                <p className="text-3xl font-bold tracking-tight text-blue-600">
                    {formatCurrency(product.price)}
                </p>
                {product.unit && (
                    <span className="text-gray-500 mb-1">/ {product.unit}</span>
                )}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
                <p className="text-sm text-gray-500 mb-4">
                    Kategori: <span className="font-semibold text-gray-900">{product.category || "Umum"}</span>
                    {product.stock && (
                        <span className="ml-4">Stok: <span className="font-semibold text-gray-900">{product.stock}</span></span>
                    )}
                </p>

                <div className="flex gap-4">
                    <button className="flex-1 flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition shadow-lg shadow-blue-200">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Tambah ke Keranjang
                    </button>
                    {/* Bisa tambah tombol chat penjual disini */}
                </div>
            </div>
            
            <div className="mt-6 rounded-lg bg-blue-50 p-4 border border-blue-100">
                <p className="text-sm text-blue-800 text-center">
                    🛡️ <strong>Jaminan Segar:</strong> Produk dikirim langsung dari nelayan/mitra terpercaya.
                </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}