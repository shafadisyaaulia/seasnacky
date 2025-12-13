import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { ArrowLeft, ShoppingCart, Star, Store } from "lucide-react";
import ProductDetailClient from "./ProductDetailClient";
import WishlistButton from "@/components/ui/WishlistButton";

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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  
  let product = null;
  try {
    product = await Product.findById(id).lean();
  } catch (e) {
    console.error("Invalid Product ID");
  }

  if (!product) {
    return notFound();
  }

  // Fetch reviews stats
  const reviews = await Review.find({ productId: id }).lean();
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tombol Kembali */}
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Kembali ke Produk</span>
        </Link>

        {/* Content Grid */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-10">
            
            {/* Gambar Produk */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Thumbnail jika ada multiple images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image src={img} alt={`${product.name} ${idx + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Produk */}
            <div className="flex flex-col">
              {/* Badge Kategori */}
              <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 mb-4 capitalize">
                {product.category || "Produk"}
              </span>

              {/* Nama Produk & Wishlist */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <WishlistButton productId={id} productName={product.name} size="lg" />
              </div>

              {/* Rating & Review */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-700">
                    {averageRating > 0 ? averageRating.toFixed(1) : "Belum ada"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({totalReviews} ulasan)
                </span>
              </div>

              {/* Harga */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Harga</p>
                <p className="text-4xl font-bold text-blue-600">
                  {formatCurrency(product.price)}
                </p>
              </div>

              {/* Deskripsi */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi Produk</h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "Produk berkualitas tinggi dari SeaSnacky."}
                </p>
              </div>

              {/* Informasi Toko */}
              {product.shopId && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Store className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dijual oleh</p>
                      <p className="font-semibold text-gray-900">SeaSnacky Official</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="mt-auto space-y-3">
                <Link
                  href={`/products`}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart size={20} />
                  Tambah ke Keranjang
                </Link>
                
                <button className="w-full border-2 border-blue-600 text-blue-600 px-6 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all">
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Tambahan */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Produk Original</h3>
              <p className="text-sm text-gray-500">Jaminan 100% original</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Gratis Ongkir</h3>
              <p className="text-sm text-gray-500">Untuk pembelian tertentu</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Pengiriman Cepat</h3>
              <p className="text-sm text-gray-500">1-3 hari sampai</p>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <ProductDetailClient productId={id} productName={product.name} />
      </div>
    </main>
  );
}
