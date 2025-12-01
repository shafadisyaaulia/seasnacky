import SellerSidebar from "@/components/layout/SellerSidebar";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Fixed di kiri) */}
      <SellerSidebar />

      {/* Konten Utama (Di sebelah kanan) */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}