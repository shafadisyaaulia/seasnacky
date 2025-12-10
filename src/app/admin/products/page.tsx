'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast'; // Diperlukan untuk notifikasi delete, dll.
// Import tipe data model produk Anda. Sesuaikan path ini jika berbeda.
import { IProduct } from '@/models/Product'; 

// Definisikan tipe data untuk produk di frontend
// Diasumsikan produk memiliki properti shop yang di-populate (misal: hanya nama)
type ShopInfo = { name: string };
type ProductWithShop = IProduct & { shop: ShopInfo }; 

const AdminProductListPage = () => {
  const [products, setProducts] = useState<ProductWithShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data produk dari API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    // Ambil Base URL (Wajib untuk Client Component yang fetch data dari API internal)
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

    try {
      // Endpoint API yang seharusnya mengembalikan daftar semua produk
      const response = await fetch(`${BASE_URL}/api/admin/products`);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || `Gagal mengambil data produk (Status: ${response.status}).`);
        setProducts([]); // Kosongkan produk jika gagal
        return;
      }

      const data: ProductWithShop[] = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError('Terjadi kesalahan koneksi atau jaringan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Hanya berjalan sekali saat mount

  // Fungsi untuk menghapus produk (akan diimplementasikan selanjutnya)
  const handleDelete = async (productId: string, productName: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
      return;
    }
    
    const deleteToastId = toast.loading(`Menghapus ${productName}...`);
    
    // Ambil Base URL
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

    try {
        // Endpoint API untuk DELETE (kita asumsikan menggunakan DELETE /api/admin/products/[id])
        const response = await fetch(`${BASE_URL}/api/admin/products/${productId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menghapus produk.');
        }

        toast.dismiss(deleteToastId);
        toast.success(`Produk "${productName}" berhasil dihapus.`);
        
        // Refresh daftar produk setelah berhasil dihapus
        fetchProducts(); 

    } catch (error: any) {
        toast.dismiss(deleteToastId);
        toast.error(error.message || 'Gagal menghapus produk.');
    }
  };


  if (loading) return <div className="p-8 text-center text-lg text-gray-600">Memuat daftar produk...</div>;
  
  if (error) return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold text-red-600">Error: {error}</h2>
      <p className="text-gray-500 mt-2">Pastikan Anda sudah login sebagai Admin dan API Route `/api/admin/products` sudah berfungsi.</p>
    </div>
  );
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk ({products.length})</h1>
        <Link 
          href="/admin/products/create"
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
        >
          + Tambah Produk Baru
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-x-auto">
        {products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada produk yang ditambahkan.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama & ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                {products[0].shop && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toko</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id.toString()}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Gambar pertama dari array images */}
                    <Image 
                      src={product.images[0] || '/images/placeholder.jpg'} 
                      alt={product.name} 
                      width={50} 
                      height={50} 
                      className="object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500 truncate" title={product._id.toString()}>ID: {product._id.toString().substring(0, 8)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {product.price.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.countInStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {product.category}
                  </td>
                  {product.shop && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.shop.name || 'N/A'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {/* Link Edit (Menggunakan ID produk) */}
                    <Link href={`/admin/products/${product._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </Link>
                    {/* Tombol Delete */}
                    <button 
                        onClick={() => handleDelete(product._id.toString(), product.name)}
                        className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProductListPage;