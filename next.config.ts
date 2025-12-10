import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wajib untuk Docker agar output ringan
  // Wajib untuk Docker agar output ringan
  output: "standalone",

  // Matikan eslint/typescript checking saat build biar cepat
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Konfigurasi Webpack: "Lupakan snappy!"
  webpack: (config, { isServer }) => {
    // Pastikan fallback object ada
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }

    // Paksa snappy jadi false (kosong)
    config.resolve.fallback.snappy = false;
    
    // Tambahan: kadang winston butuh ini juga
    config.resolve.fallback.fs = false;
    config.resolve.fallback.net = false;
    config.resolve.fallback.tls = false;

    // Supaya winston-loki gak rewel soal snappy
    config.module.rules.push({
      test: /snappy/,
      use: 'null-loader',
    });

  // Matikan eslint/typescript checking saat build biar cepat
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Konfigurasi Webpack: "Lupakan snappy!"
  webpack: (config, { isServer }) => {
    // Pastikan fallback object ada
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }

    // Paksa snappy jadi false (kosong)
    config.resolve.fallback.snappy = false;
    
    // Tambahan: kadang winston butuh ini juga
    config.resolve.fallback.fs = false;
    config.resolve.fallback.net = false;
    config.resolve.fallback.tls = false;

    // Supaya winston-loki gak rewel soal snappy
    config.module.rules.push({
      test: /snappy/,
      use: 'null-loader',
    });

    return config;
  },

  // Izinkan gambar dari mana saja
  // Izinkan gambar dari mana saja
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;