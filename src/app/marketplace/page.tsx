import MarketplaceView from "../../components/MarketplaceView";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Marketplace - SeaSnacky",
  description: "Daftar produk olahan laut SeaSnacky",
};

export default function MarketplacePage() {
  return (
    <main className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Marketplace</h1>
      <CartProvider>
        <MarketplaceView />
      </CartProvider>
    </main>
  );
}
