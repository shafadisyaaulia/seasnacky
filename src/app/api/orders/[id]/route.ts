import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product"; 
import { getAuthUser } from "@/lib/session";

// GET: Ambil Detail Pesanan (Untuk Halaman Detail Buyer/Seller)
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // ✅ Fix Next.js 15 Type
) {
  try {
    await connectDB();
    const { id } = await params; // ✅ WAJIB AWAIT di Next.js 15

    // Validasi format ID MongoDB (24 char)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ error: "ID Order tidak valid" }, { status: 400 });
    }

    const order = await Order.findById(id).populate({
      path: "items.productId",
      model: Product,
      select: "name image price images"
    }).lean(); // ✅ Convert to plain object

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    console.log("📦 Order found:", order); // Debug log

    return NextResponse.json({ data: order });

  } catch (error: any) {
    console.error("❌ Error GET Order:", error.message); // Log error biar kelihatan
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH: Update Status Pesanan & Simpan Resi
export async function PATCH(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await getAuthUser();
    
    if (!user || !user.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { status, trackingNumber } = body; // <--- Ambil Tracking Number

    const validStatuses = ["pending", "paid", "process", "shipped", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    const userId = user.sub;
    const order = await Order.findOne({ _id: id, sellerId: userId });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan atau Anda bukan pemilik toko" }, { status: 404 });
    }

    // Update status
    order.status = status;

    // Jika status dikirim (shipped), simpan nomor resi
    if (status === "shipped" && trackingNumber) {
        order.trackingNumber = trackingNumber;
    }

    order.updatedAt = new Date();
    await order.save();

    return NextResponse.json({ message: "Update berhasil", order });

  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}