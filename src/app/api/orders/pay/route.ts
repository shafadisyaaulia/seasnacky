import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { orderId } = payload;

    if (!orderId) {
      return NextResponse.json({ message: "orderId harus diberikan" }, { status: 400 });
    }

    // Simulasi Pembayaran Sukses
    const updatedOrder = {
        id: orderId,
        paymentStatus: "paid",
        status: "diproses",
        updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedOrder, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}