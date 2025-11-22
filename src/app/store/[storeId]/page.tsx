import { listProducts, getStoreById, getStoreByProductId } from "@/app/api/_data/mockData";
import ProductCard from "@/components/ProductCard";

type Params = { params: { storeId: string } };

export async function generateMetadata({ params }: Params) {
  const store = getStoreById(params.storeId as string);
  return {
    title: store ? `${store.name} - SeaSnacky` : "Toko - SeaSnacky",
  };
}

export default function StorePage({ params }: Params) {
  const store = getStoreById(params.storeId);
  const products = listProducts().filter((p) => getStoreByProductId(p.id).id === params.storeId);

  if (!store) {
    return (
      <main className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold">Toko tidak ditemukan</h1>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{store.name}</h1>
        <p className="text-sm text-slate-600">{store.city}</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4">Produk Toko</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={{...p, image: p.image ?? '/placeholder-300.png'}} />
          ))}
          {products.length === 0 ? <p className="text-sm text-slate-500">Belum ada produk di toko ini.</p> : null}
        </div>
      </section>
    </main>
  );
}
