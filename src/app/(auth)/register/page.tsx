// File: seasnacky/src/app/(auth)/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from 'react-hot-toast'; // Import Toast untuk notifikasi UX yang lebih baik
import { Loader2 } from "lucide-react"; // Import Loader2 untuk spinner (Pastikan lucide-react terinstall)

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    
    // Gunakan state 'error' hanya untuk error di form (tetapi error API akan ditampilkan via toast)
    const [error, setError] = useState(""); 

    useEffect(() => {
        // Cek jika sudah login, redirect ke homepage
        // Catatan: Jika ini adalah page otentikasi, fetch ini sebaiknya dilakukan di server/middleware otorisasi untuk keamanan
        fetch("/api/auth/me").then(res => res.json()).then(data => {
            if (data.user) {
                router.replace("/");
            }
        });
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(""); // Clear error state

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                // Ganti alert/throw menjadi notifikasi toast error
                toast.error(data.error || "Gagal mendaftar. Coba lagi.");
                return; // Langsung keluar dari try block
            }

            // Ganti alert sukses menjadi notifikasi toast sukses
            toast.success("✅ Registrasi Berhasil! Silakan Login.");
            
            // Redirect ke halaman login setelah notif muncul
            setTimeout(() => {
                router.push("/login");
            }, 2000); // Tunggu 2 detik untuk membaca toast

        } catch (err: any) {
             // Jika ada error yang tidak terduga di client-side
            console.error("Client side error during registration:", err);
            toast.error("Terjadi kesalahan jaringan.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Daftar Seasnacky</h1>
                    <p className="text-sm text-gray-500 mt-2">Buat akun untuk mulai belanja & jualan</p>
                </div>

                {/* Error Box Bawaan Dihapus, digantikan oleh Toast */}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="Nama Anda"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="nama@email.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="******"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" /> Memproses...
                            </>
                        ) : (
                            "Daftar Sekarang"
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="text-teal-600 font-semibold hover:underline">
                        Login disini
                    </Link>
                </p>
            </div>
        </div>
    );
}