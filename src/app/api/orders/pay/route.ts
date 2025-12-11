import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    console.log("=== Payment API Called ===");
    await connectDB();
    
    const payload = await request.json();
    const { orderId, paymentMethod, status } = payload;
    console.log("Payment payload:", { orderId, paymentMethod, status });

    if (!orderId) {
      console.error("No orderId provided");
      return NextResponse.json({ message: "orderId harus diberikan" }, { status: 400 });
    }

    // Find order and update status
    console.log("Finding order with ID:", orderId);
    const order = await Order.findById(orderId);
    console.log("Order found:", order ? "Yes" : "No");
    
    if (!order) {
      return NextResponse.json(
        { message: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update order with payment info
    order.status = status || "paid";
    order.paymentMethod = paymentMethod || "qris";
    order.paymentDate = new Date();
    order.updatedAt = new Date();
    
    await order.save();

    console.log("Order payment updated:", orderId, "Status:", order.status);

    return NextResponse.json({ 
      message: "Pembayaran berhasil diproses",
      order: {
        id: order._id.toString(),
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: "paid",
        updatedAt: order.updatedAt.toISOString()
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error POST /api/orders/pay:", error);
    return NextResponse.json({ message: "Terjadi kesalahan sistem: " + error.message }, { status: 500 });
  }
}