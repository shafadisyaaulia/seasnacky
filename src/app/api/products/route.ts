// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/app/api/_data/mockData";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  const products = listProducts({ search, category });

  return NextResponse.json({
    data: products,
    meta: {
      total: products.length,
      filters: { search, category },
    },
  });
}