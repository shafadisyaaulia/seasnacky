# 1. Base image
FROM node:20-alpine AS base

# 2. Install dependencies (hanya jika package.json berubah)
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Build source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Matikan telemetri Next.js biar gak menuhin log
ENV NEXT_TELEMETRY_DISABLED 1

# 👇 TAMBAHKAN DUMMY ENV DI SINI (Biar build lolos)
# Nilai ini cuma dipakai saat build, nanti ditimpa sama .env asli
ENV MONGODB_URI="mongodb://dummy-for-build"
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dummy-cloud"

# Build project
RUN npm run build

# 4. Production image (Hanya ambil hasil jadi yang kecil)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Buat user system biar aman (bukan root)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder (gambar, aset, dll)
COPY --from=builder /app/public ./public

# COPY HASIL STANDALONE (Kunci biar ringan!)
# Folder .next/standalone ini otomatis dibuat karena setting next.config.ts kamu tadi
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# Jalankan langsung pakai node (bukan npm start)
CMD ["node", "server.js"]