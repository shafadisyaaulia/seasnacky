# SeaSnacky — Marketplace (Next.js)

Project ready for local development and Vercel deployment.

Quick start (local):

1. Install dependencies
```powershell
Set-Location -Path "C:\INFORMATIKA\SEMESTER 5\POPL\FIX-PROJEKUAS\seasnacky"
npm install
```

2. Run dev server (port 3000):
```powershell
npm run dev
# open http://localhost:3000/marketplace
```

Build for production (locally):
```powershell
npm run build
npm run start
```

API (mock) routes available under `/src/app/api/*` (used by frontend):
- `GET /api/products` — list products
- `GET /api/products/[id]` — product detail
- `POST /api/cart` — append cart item (mock)
- `GET /api/stores?productId=...` — store/seller info for a product

Deployment to Vercel
- Push this repository to GitHub.
- Import project in Vercel (https://vercel.com/new) and select this repo.
- Vercel will auto-detect Next.js and run `npm run build`.

Production notes
- Currently backend is mocked in `src/app/api/_data/mockData.ts`. Replace these mocks with real database calls (Prisma, Supabase, or external API) before production.
- Consider using HTTP-only cookies or a proper auth solution for production (NextAuth, JWT with refresh tokens).
- Review ESLint warnings and replace `<img>` with `next/image` for optimal image performance.

If you want, I can:
- Replace mock endpoints with a simple Express or Prisma backed API and show steps to configure a production DB.
- Add `tailwind.config.js` to centralize theme colors.
## SeaSnacky

Anggota Kelompok:
- Shafa Disya Aulia (2308107010002)
- Akrimah Usri (2308107010009)

Link Repository Docker Hub:
https://hub.docker.com/repository/docker/akrimahusri/seasnacky/general

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

