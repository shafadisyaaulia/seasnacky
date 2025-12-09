import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wajib untuk Docker agar file output kecil dan ringan
  output: "standalone",

  // Konfigurasi Webpack: "Kalau butuh snappy, anggap aja gak ada (false)"
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      snappy: false, 
    };
    return config;
  },

  // Izinkan gambar dari mana saja (Cloudinary dll)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  
  // Matikan eslint saat build biar lebih cepat (karena kita sudah cek manual)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;