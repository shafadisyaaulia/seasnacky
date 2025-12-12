// seasnacky/src/app/dashboard/seller/page.tsx
import { DollarSign, Package, ShoppingCart } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Toko</h1>
      
      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Pendapatan</p>
              <h3 className="text-2xl font-bold mt-1">Rp 0</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Produk Aktif</p>
              <h3 className="text-2xl font-bold mt-1">0</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Package size={20} />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Pesanan Baru</p>
              <h3 className="text-2xl font-bold mt-1">0</h3>
            </div>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <ShoppingCart size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Cepat */}
      <div className="bg-blue-600 text-white rounded-xl p-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Mulai Jualan Sekarang!</h2>
          <p className="text-blue-100 mt-1">Upload produk olahan laut pertamamu.</p>
        </div>
        <a 
          href="/dashboard/seller/products/new" 
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          + Tambah Produk
        </a>
      </div>
    </div>
  );
}