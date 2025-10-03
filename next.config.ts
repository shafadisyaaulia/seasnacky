import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tambahkan blok typescript ini
  typescript: {
    // Abaikan error build TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;