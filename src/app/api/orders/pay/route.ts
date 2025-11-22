import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "../../_data/mockData";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { orderId } = payload;
  if (!orderId) {
    return NextResponse.json({ message: "orderId harus diberikan" }, { status: 400 });
  }

  const order = getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ message: "Order tidak ditemukan" }, { status: 404 });
  }

  order.paymentStatus = "paid";
  order.status = "diproses";

  return NextResponse.json(order, { status: 200 });
}
