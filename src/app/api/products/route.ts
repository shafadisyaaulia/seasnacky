// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/app/api/_data/mockData";

function useMongo() {
  return !!process.env.MONGODB_URI;
}

function usePrisma() {
  return !!process.env.DATABASE_URL;
}

function useMock() {
  // Force mock in development or when explicitly requested
  return process.env.NODE_ENV === "development" || process.env.FORCE_MOCK === "1";
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  // If development or FORCE_MOCK=1, prefer mock data to avoid external DB calls
  if (useMock()) {
    const products = listProducts({ search, category });
    return NextResponse.json({
      data: products,
      meta: {
        total: products.length,
        filters: { search, category },
      },
    });
  }

  // Try MongoDB first, then Prisma, else fallback to mock.
  // IMPORTANT: import DB clients lazily to avoid module-load errors
  // when Prisma/Mongo aren't configured/generated in development.
  if (useMongo()) {
    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();
      if (db) {
        const q: any = {};
        if (search) q.$text = { $search: search };
        if (category) q.category = category;
        const dbProducts = await db.collection("products").find(q).limit(100).toArray();
        return NextResponse.json({ data: dbProducts, meta: { total: dbProducts.length, filters: { search, category } } });
      }
    } catch (err) {
      // swallow DB import/connect errors and fall through to next option
      console.warn("MongoDB unavailable:", (err as Error).message);
    }
  }

  if (usePrisma()) {
    try {
      const prismaModule = await import("@/lib/prisma");
      const prismaClient = prismaModule?.default ?? prismaModule;
      const where: any = {};
      if (search) where.OR = [{ name: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }];
      if (category) where.category = category;
      const dbProducts = await prismaClient.product.findMany({ where, take: 100 });
      return NextResponse.json({ data: dbProducts, meta: { total: dbProducts.length, filters: { search, category } } });
    } catch (err) {
      // Prisma not available or client generation failed — log and fall back
      console.warn("Prisma unavailable:", (err as Error).message);
    }
  }

  // Final fallback to mock if no DB available
  const products = listProducts({ search, category });
  return NextResponse.json({
    data: products,
    meta: {
      total: products.length,
      filters: { search, category },
    },
  });
}