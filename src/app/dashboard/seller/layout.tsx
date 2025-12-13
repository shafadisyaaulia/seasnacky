import SellerShopInfo from "@/components/seller/SellerShopInfo";
import SellerNavbar from "@/components/seller/SellerNavbar";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Info Toko - Sebelum Navbar */}
      <SellerShopInfo />
      
      {/* Navbar Horizontal untuk Dashboard Seller */}
      <SellerNavbar />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}