import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import OrderModel from "@/lib/models/Order";
import { getAuthUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const requestedUserId = request.nextUrl.searchParams.get("userId") ?? undefined;

  if (requestedUserId && auth.role !== "admin" && auth.sub !== requestedUserId) {
    return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  }

  await connectToDatabase();

  const filter = requestedUserId
    ? { user: requestedUserId }
    : auth.role === "admin"
      ? {}
      : { user: auth.sub };

  const orders = await OrderModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const statusSummary = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    data: orders,
    meta: {
      total: orders.length,
      statusSummary,
    },
  });
}
