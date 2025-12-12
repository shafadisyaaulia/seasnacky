// File: src/app/dashboard/seller/products/page.tsx
// Ini adalah Server Component (default Next.js App Router)

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Package, Tag, DollarSign, Calendar } from 'lucide-react';

// --- DEFINISI INTERFACE DATA PRODUK ---
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  createdAt: string;
}

// URL base diambil dari .env.local yang Anda berikan
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// --- FUNGSI AMBIL USER ID (OTORISASI) ---
async function getSellerData(): Promise<{ userId: string; username: string; shopName: string } | null> {
  // PENTING: Menggunakan BASE_URL untuk fetch API internal
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    cache: 'no-store' // Memastikan data sesi selalu baru
  });

  if (!res.ok) {
    console.error("Gagal mengambil data user sesi.");
    return null;
  }

  const data = await res.json();
  const user = data.user;

  // Cek otorisasi: harus login, harus role 'seller', dan harus punya 'hasShop'
  if (!user || user.role !== 'seller' || !user.hasShop) {
    return null;
  }
  
  return { 
      userId: user.id, 
      username: user.username, 
      shopName: user.shopName || "Toko Anda" // Menggunakan nama toko jika tersedia
  };
}

// --- FUNGSI AMBIL DAFTAR PRODUK SELLER ---
async function getSellerProducts(sellerId: string): Promise<Product[]> {
  // Menggunakan API /api/products dengan parameter sellerId untuk filtering
  const res = await fetch(`${BASE_URL}/api/products?sellerId=${sellerId}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    console.error("Gagal mengambil produk seller:", res.statusText);
    return [];
  }
  
  // API diharapkan mengembalikan array produk
  return res.json();
}

// --- KOMPONEN UTAMA ---
export default async function SellerProductsPage() {
  const sellerData = await getSellerData();

  // Redirect jika otorisasi gagal
  if (!sellerData) {
    redirect('/login?from=/dashboard/seller/products');
  }

  // Ambil daftar produk yang hanya milik seller ini
  const products = await getSellerProducts(sellerData.userId);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk Toko</h1>
          <p className="text-gray-500 mt-1">Selamat datang, <span className="font-medium text-blue-600">{sellerData.shopName}</span>. Kelola semua produk yang Anda jual di sini.</p>
        </div>
        
        {/* Tombol Tambah Produk */}
        <Link 
          href="/dashboard/seller/products/new"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
        >
          <Plus size={20} /> Tambah Produk Baru
        </Link>
      </div>

      {products.length === 0 ? (
        // Tampilan jika produk kosong
        <div className="text-center py-20 border border-dashed rounded-xl bg-gray-50 text-gray-600">
          <Package size={40} className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Anda belum memiliki produk.</h2>
          <p className="mt-2">Silakan klik tombol "Tambah Produk Baru" untuk mulai menjual.</p>
        </div>
      ) : (
        // Tampilan Tabel Produk
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-lg object-cover border" 
                          src={product.image || `${BASE_URL}/default-product.png`} 
                          alt={product.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    <DollarSign size={14} className="inline mr-1 text-green-600" />
                    Rp{product.price.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Package size={14} className="inline mr-1 text-yellow-600" />
                    {product.stock} Unit
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Tag size={14} className="inline mr-1 text-purple-600" />
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Calendar size={14} className="inline mr-1 text-blue-600" />
                    {new Date(product.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/dashboard/seller/products/edit/${product.id}`} 
                      className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Link>
                    {/* Mengganti alert dengan action sesungguhnya akan membutuhkan Client Component */}
                    <button
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}