// File: src/app/dashboard/page.tsx
// Pastikan ini ada di baris pertama
"use client"; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Store } from 'lucide-react';

// PASTIKAN INI ADALAH DEFAULT EXPORT
export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            const fetchedUser = data?.user;

            if (!fetchedUser || !fetchedUser.id) {
                router.replace("/login");
                return;
            }

            setUser(fetchedUser);
            setIsLoading(false);

            if (fetchedUser.role === 'seller') {
                router.replace("/dashboard/seller");
            }
        };
        fetchUser();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600 mr-2" /> Memuat Dashboard...
            </div>
        );
    }
    
    const isPendingSeller = user?.hasShop && user.role === 'buyer';

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Akun Saya</h1>
            
            {isPendingSeller ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-6 shadow-md rounded-lg">
                    <div className="flex items-center">
                        <Store className="w-6 h-6 mr-3" />
                        <div>
                            <p className="font-semibold text-lg">Pengajuan Toko Anda Sedang Diproses</p>
                            <p className="mt-1 text-sm">
                                Akun Anda akan di-upgrade ke Seller setelah Admin menyetujui data toko Anda. Mohon tunggu notifikasi berikutnya.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4">Aktivitas Pembelian</h2>
                    <p className="text-gray-600">Anda belum memiliki pesanan aktif. Mulai belanja sekarang!</p>
                </div>
            )}
            
            <div className="mt-8 text-center">
                <button 
                    onClick={() => router.push('/products')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                    Kembali ke Katalog Produk
                </button>
            </div>
        </div>
    );
}