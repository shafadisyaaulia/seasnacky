import SellerSidebar from "@/components/layout/SellerSidebar";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Fixed di kiri) */}
      <SellerSidebar />

      {/* PERBAIKAN UTAMA ADA DI SINI:
         'ml-64' = Memberi margin kiri sebesar lebar sidebar (agar tidak ketimpa)
         'w-full' = Memastikan konten mengambil sisa lebar layar
         'pt-2' = Memberi sedikit jarak atas (opsional)
      */}
      <main className="flex-1 ml-64 p-8 w-full transition-all duration-300">
        {children}
      </main>
    </div>
  );
}