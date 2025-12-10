import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  webpack: (config, { isServer }) => {
    // 1. Alias: Belokkan 'snappy' ke file palsu kita
    // HANYA TERAPKAN DI SERVER (saat build)
    if (isServer) {
        config.resolve.alias = {
            ...config.resolve.alias,
            snappy: path.resolve(__dirname, "src/mocks/snappy.js"),
        };
    }
    
    // 2. Fallback: Jaga-jaga kalau alias gagal
    config.resolve.fallback = {
      ...config.resolve.fallback,
      snappy: false,
    };
    
    // Hapus null-loader jika sebelumnya diinstall, fokus ke alias
    config.module.rules = config.module.rules.filter(rule => 
        rule.test && rule.test.toString() !== '/snappy/'
    );

    return config;
  },

  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;