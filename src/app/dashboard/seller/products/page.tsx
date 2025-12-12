// File: src/app/dashboard/seller/products/page.tsx

import { redirect } from 'next/navigation';
import Link from 'next/link';
// [Wajib] Import headers untuk mengatasi masalah pembacaan cookie sesi
import { headers } from 'next/headers'; 

import { Plus, Package, Tag, DollarSign, Calendar } from 'lucide-react';
import ProductActionRow from '@/components/seller/ProductActionRow'; 

// --- DEFINISI INTERFACE DATA PRODUK ---
interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
    createdAt: string;
}

// URL base diambil dari .env.local yang Anda berikan
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// --- FUNGSI AMBIL USER ID (OTORISASI) ---
async function getSellerData(): Promise<{ userId: string; username: string; shopName: string } | null> {
    
    const requestHeaders = await headers(); 
    
    // [PERBAIKAN] Langsung ambil nilai header
    const cookieHeader = requestHeaders.get('cookie'); 
    
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
        cache: 'no-store',
        headers: {
            cookie: cookieHeader || '', 
        },
    });
    

    if (!res.ok) {
        console.error("Gagal mengambil data user sesi (API Error).");
        return null;
    }

    const data = await res.json();
    const user = data.user;

    // Cek otorisasi: harus login, harus role 'seller', dan harus punya 'hasShop'
    if (!user || user.role !== 'seller' || !user.hasShop) {
        console.log(`User ID: ${user?.id} gagal akses produk. Role: ${user?.role}, hasShop: ${user?.hasShop}`);
        return null;
    }
    
    return { 
        userId: user.id, 
        username: user.username, 
        shopName: user.shopName || "Toko Anda" 
    };
}

// --- FUNGSI AMBIL DAFTAR PRODUK SELLER ---
async function getSellerProducts(sellerId: string): Promise<Product[]> {
    const res = await fetch(`${BASE_URL}/api/products?sellerId=${sellerId}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        console.error("Gagal mengambil produk seller:", res.statusText);
        return []; 
    }
    
    return res.json();
}

// --- KOMPONEN UTAMA ---
export default async function SellerProductsPage() {
    const sellerData = await getSellerData();

    // SERVER-SIDE PROTECTION: 
    if (!sellerData) {
        // Redirect ke Ikhtisar Seller Dashboard (jika otorisasi di page ini gagal)
        redirect('/dashboard/seller'); 
    }

    // Ambil daftar produk
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
                            {/* Memanggil Komponen Client untuk setiap baris produk */}
                            {products.map((product) => (
                                <ProductActionRow 
                                    key={product.id} 
                                    product={product} 
                                    BASE_URL={BASE_URL} 
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}