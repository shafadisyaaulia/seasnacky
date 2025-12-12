"use client";

import Link from 'next/link';
import { Edit, Trash2, DollarSign, Package, Tag, Calendar } from 'lucide-react';
import toast from 'react-hot-toast'; 
import { useRouter } from 'next/navigation';

// Interface (Wajib sama dengan interface Product di page.tsx)
interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    image: string;
    createdAt: string;
}

// Komponen Baris Aksi
export default function ProductActionRow({ product, BASE_URL }: { product: Product, BASE_URL: string }) {
    const router = useRouter();
    
    // Fungsi untuk menghapus produk (Memanggil API DELETE)
    const handleDelete = async () => {
        if (!confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"? Aksi ini tidak dapat dibatalkan.`)) {
            return;
        }

        const loadingToastId = toast.loading(`Menghapus ${product.name}...`);
        
        try {
            // Panggil API DELETE /api/products/[id] 
            const res = await fetch(`/api/products/${product.id}`, { 
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Gagal menghapus produk. Cek API Anda.");
            }

            toast.success("✅ Produk berhasil dihapus!", { id: loadingToastId });
            
            // Refresh halaman atau cache router setelah berhasil
            router.refresh(); 

        } catch (error: any) {
            toast.error(error.message || "Terjadi kesalahan saat penghapusan.", { id: loadingToastId });
        }
    };
    
    const formattedPrice = `Rp${product.price.toLocaleString('id-ID')}`;
    const formattedDate = new Date(product.createdAt).toLocaleDateString('id-ID');

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            {/* Kolom Produk */}
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
            {/* Kolom Harga */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                <DollarSign size={14} className="inline mr-1 text-green-600" />
                {formattedPrice}
            </td>
            {/* Kolom Stok */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Package size={14} className="inline mr-1 text-yellow-600" />
                {product.stock} Unit
            </td>
            {/* Kolom Kategori */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Tag size={14} className="inline mr-1 text-purple-600" />
                {product.category}
            </td>
            {/* Kolom Tanggal Dibuat */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Calendar size={14} className="inline mr-1 text-blue-600" />
                {formattedDate}
            </td>
            {/* Kolom Aksi (Client-side interactivity) */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link 
                    href={`/dashboard/seller/products/edit/${product.id}`} 
                    className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                >
                    <Edit size={16} className="mr-1" /> Edit
                </Link>
                <button
                    onClick={handleDelete} // <-- Action Hapus
                    className="text-red-600 hover:text-red-900 inline-flex items-center"
                >
                    <Trash2 size={16} className="mr-1" /> Hapus
                </button>
            </td>
        </tr>
    );
}