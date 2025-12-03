import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "../../_data/mockData";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log("Fetching order with ID:", id);
  const order = getOrderById(id);
  console.log("Found order:", order);

  if (!order) {
    return NextResponse.json(
      { message: "Pesanan tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: order });
}