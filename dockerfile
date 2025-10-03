# 1. Gunakan base image Node.js yang direkomendasikan untuk Next.js
FROM node:18-alpine AS base

# 2. Atur direktori kerja di dalam kontainer
WORKDIR /app

# 3. Salin file package.json dan package-lock.json
COPY package*.json ./

# 4. Instal dependensi
RUN npm install

# 5. Salin sisa file proyek
COPY . .

# 6. Build aplikasi Next.js
RUN npm run build

# 7. Buat image production yang lebih kecil
FROM node:18-alpine AS production

WORKDIR /app

# Salin hasil build dari tahap sebelumnya
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/public ./public

# 8. Tentukan perintah untuk menjalankan aplikasi
CMD ["npm", "start"]

