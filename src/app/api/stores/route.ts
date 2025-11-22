import { NextRequest, NextResponse } from "next/server";

// Single route file for /api/stores
// Supports:
// GET /api/stores                -> list all stores (from mockData)
// GET /api/stores?productId=xxx  -> return store for a product (mock mapping)
// POST /api/stores               -> create a new store (in-memory mock only)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const productId = searchParams.get("productId");
    const mock = await import("@/app/api/_data/mockData");

    if (productId) {
      const store = mock.getStoreByProductId(productId);
      if (!store) return NextResponse.json({ message: "Store not found" }, { status: 404 });
      return NextResponse.json({ data: store });
    }

    // return all stores
    // @ts-ignore access internal exported stores if present
    const stores = (mock as any).stores ?? [];
    return NextResponse.json({ data: stores, meta: { total: stores.length } });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const name = (payload.name || "").toString();
    const city = (payload.city || "").toString();
    if (!name) return NextResponse.json({ error: "Missing store name" }, { status: 400 });
    const session = await import("@/lib/session");
    const verified = await session.getAuthUser();
    if (!verified) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const mock = await import("@/app/api/_data/mockData");
    const id = `st-${Math.random().toString(36).slice(2, 8)}`;
    const ownerId = (verified as any).sub;
    const newStore: any = { id, name, city, ownerId };
    // push into the in-memory stores array if it exists
    // @ts-ignore
    (mock as any).stores = (mock as any).stores || [];
    // @ts-ignore
    (mock as any).stores.push(newStore);

    // link store to user record
    // @ts-ignore
    const user = (mock as any).users?.find((u: any) => u.id === ownerId);
    if (user) {
      user.storeId = id;
    }

    return NextResponse.json({ data: newStore }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
