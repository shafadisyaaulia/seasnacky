// File: seasnacky/src/app/(auth)/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            {/* Blurred Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-200">
                <div className="absolute inset-0" style={{ 
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%231e40af" fill-opacity="0.08"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                }}></div>
            </div>

            {/* Centered Card */}
            <div className="relative z-10 w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row">
                    {/* Left Section - Form */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-12">
                        {/* Logo/Brand */}
                        <div className="mb-8">
                            <Link href="/" className="inline-flex items-center gap-3">
                                <Image 
                                    src="/seasnacky-logo.png" 
                                    alt="SeaSnacky Logo" 
                                    width={50} 
                                    height={50}
                                    className="object-contain"
                                />
                                <span className="text-2xl font-bold text-sky-600">SeaSnacky</span>
                            </Link>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Akun Baru</h1>
                            <p className="text-gray-600">Bergabung dengan marketplace hasil laut terpercaya</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Masukkan nama lengkap"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="nama@email.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-2"
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

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Sudah punya akun?{" "}
                                <Link href="/login" className="text-blue-700 font-bold hover:underline">
                                    Login disini
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center">
                                Dengan mendaftar, Anda menyetujui{" "}
                                <a href="#" className="text-blue-700 hover:underline">Syarat & Ketentuan</a>
                                {" "}dan{" "}
                                <a href="#" className="text-blue-700 hover:underline">Kebijakan Privasi</a>
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Image */}
                    <div className="hidden lg:block lg:w-1/2 relative">
                        <Image 
                            src="/register-illustration.jpg" 
                            alt="SeaSnacky Seller" 
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}