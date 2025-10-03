import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "../../_data/mockData";

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const order = getOrderById(id);

  if (!order) {
    return NextResponse.json(
      { message: "Pesanan tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: order });
}