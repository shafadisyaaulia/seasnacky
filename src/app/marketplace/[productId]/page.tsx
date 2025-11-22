import { getProductById } from "@/app/api/_data/mockData";
import ProductDetailClient from "@/components/ProductDetailClient";
import Image from "next/image";
import type { Review } from "@/app/api/_data/mockData";

export async function generateStaticParams() {
  // keep empty for now; pages will be rendered on-demand
  return [];
}

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const { productId } = params;
  const product = getProductById(productId);

  if (!product) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-semibold">Produk tidak ditemukan</h1>
        <p className="mt-3 text-slate-600">Produk dengan id/slug &quot;{productId}&quot; tidak ditemukan.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden relative img-zoom">
            <Image src={product.image ?? "/placeholder-600.png"} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <div className="mt-3 text-slate-700">{product.description}</div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-sky-700">Rp {product.price.toLocaleString("id-ID")}</div>
            <div className="text-sm text-slate-500 mt-1">{product.unit}</div>
            <div className="mt-4">
              <ProductDetailClient productId={product.id} />
            </div>
            <div className="mt-4 text-xs text-slate-500">Stok: {product.stock}</div>
          </div>
        </aside>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Ulasan</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {product.reviews.map((r: Review) => (
              <li key={r.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.userId}</div>
                  <div className="text-sm text-amber-400">{r.rating} ★</div>
                </div>
                <div className="mt-2 text-slate-700">{r.comment}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-slate-500">Belum ada ulasan untuk produk ini.</p>
        )}
      </section>
    </main>
  );
}
