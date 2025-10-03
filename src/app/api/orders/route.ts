import { NextRequest, NextResponse } from "next/server";
import { listOrders } from "../_data/mockData";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") ?? undefined;
  const orders = listOrders(userId);

  return NextResponse.json({
    data: orders,
    meta: {
      total: orders.length,
    },
  });
}