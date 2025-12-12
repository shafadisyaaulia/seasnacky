// File: src/app/open-shop/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, Loader2 } from "lucide-react"; 
import toast from 'react-hot-toast'; // Pastikan library ini sudah terinstal

export default function OpenShopPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isCheckingUser, setIsCheckingUser] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // State Form Toko
    const [formData, setFormData] = useState({
        name: "", 
        description: "",
        address: "",
    });

    // 1. OTOMATIS AMBIL ID USER & CEK STATUS TOKO
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me"); 
                const data = await res.json();
                const user = data?.user;

                // Debugging Logs
                console.log("API Auth/Me Status:", res.status);
                console.log("API Auth/Me User Data:", user);
                
                // --- Cek 1: Status Login ---
                if (!user?.id) {
                    // Jika user tidak login, redirect ke halaman login
                    toast.error("Anda harus login untuk membuka toko.");
                    router.push("/login?redirect=/open-shop");
                    return;
                }
                
                // --- Cek 2: Status Toko ---
                if (user.hasShop) {
                    if (user.role === 'seller') {
                        // Sudah disetujui, langsung ke dashboard Seller
                        router.push("/dashboard/seller");
                    } else {
                        // Terdaftar (hasShop=true) tapi role masih buyer = PENDING
                        toast('ℹ️ Toko Anda sudah diajukan dan sedang menunggu persetujuan Admin.', { duration: 5000 });
                        router.push("/dashboard"); // Redirect ke dashboard buyer/utama
                    }
                    return;
                }
                
                // User login, belum pernah daftar toko
                setUserId(user.id);

            } catch (err) {
                console.error("Gagal ambil user ID:", err);
                toast.error("Terjadi masalah saat memuat data akun. Silakan coba lagi.");
                router.push("/");
            } finally {
                setIsCheckingUser(false);
            }
        };
        fetchUser();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        
        if (!userId) {
             return toast.error("Data user belum dimuat. Coba refresh halaman.");
        }
        if (!formData.name || !formData.address) {
             return toast.error("Nama Toko dan Alamat wajib diisi.");
        }

        setIsLoading(true);

        try {
            const payload = { ...formData, userId: userId };

            // Panggil API upgrade-and-create
            const res = await fetch("/api/shop/upgrade-and-create", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                // Notifikasi GAGAL
                toast.error(data.error || "Gagal mengajukan toko. Silakan coba lagi.");
                throw new Error(data.error || "Gagal mengajukan toko");
            }

            // Notifikasi SUKSES
            toast.success("📝 Pengajuan Toko Berhasil! Menunggu persetujuan Admin.");
            
            // Redirect ke Dashboard Buyer/Utama (karena role belum berubah)
            setTimeout(() => {
                window.location.href = "/dashboard"; 
            }, 2500); // Tunggu 2.5 detik

        } catch (error: any) {
            console.error("Submit Toko Error:", error);
            // Menampilkan error di form box jika ada (opsional)
            if (error.message) { 
                 setErrorMessage(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // --- JSX RENDER ---

    if (isCheckingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    <Loader2 className="animate-spin" /> Memuat data akun...
                </div>
            </div>
        );
    }
    
    // Jika userId null setelah checking, seharusnya sudah di-redirect di useEffect.
    if (!userId) return null; 


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
                
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                        <Store size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Ajukan Pendaftaran Toko</h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Akun Anda akan di-upgrade menjadi Seller setelah toko disetujui Admin.
                    </p>
                </div>
                
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4 border p-4 rounded-lg bg-blue-50/50">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                           <Store size={18}/> Detail Toko yang Diajukan
                        </h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko <span className="text-red-500">*</span></label>
                            <input name="name" required placeholder="Contoh: Kerupuk Tenggiri Maknyus" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} value={formData.name} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat (Opsional)</label>
                            <textarea name="description" placeholder="Jual apa aja nih?" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" rows={3} onChange={handleChange} value={formData.description} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap (Wajib) <span className="text-red-500">*</span></label>
                            <textarea name="address" required placeholder="Jalan Ikan Hiu No. 12, Kecamatan..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" rows={2} onChange={handleChange} value={formData.address} />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading || isCheckingUser}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Mengajukan...
                            </>
                        ) : (
                            "Ajukan Pendaftaran Toko 📝"
                        )}
                    </button>
                    
                </form>

            </div>
        </div>
    );
}