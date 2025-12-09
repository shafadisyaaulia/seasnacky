// 👇 Baris sakti ini menyuruh Next.js: "Jangan build halaman ini sekarang, nanti aja pas dibuka user"
export const dynamic = "force-dynamic"; 

export default function AdminDashboardPage() {
  return (
    <div className="p-10 text-center">
      <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-gray-500">
          Mode Aman: Halaman ini di-set ke dynamic rendering.
        </p>
      </div>
    </div>
  );
}