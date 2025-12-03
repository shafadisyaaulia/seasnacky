import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product"; 
import { getAuthUser } from "@/lib/session"; 

export const dynamic = "force-dynamic";

// GET: Ambil Pesanan
export async function GET() {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.log("🔍 Mengecek pesanan untuk Seller ID:", user._id);

    const orders = await Order.find({ sellerId: user._id })
      .populate({
        path: "items.productName", // Jika structure lama string, ini diabaikan
        strictPopulate: false
      })
      .sort({ createdAt: -1 });

    console.log(`✅ Ditemukan ${orders.length} pesanan.`);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error GET:", error);
    return NextResponse.json({ error: "Gagal ambil order" }, { status: 500 });
  }
}

// POST: Simulasi Pesanan Baru (PENTING!)
export async function POST() {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.log("🚀 Membuat Simulasi Order untuk Seller:", user.name);

    // Ambil 1 produk milik seller ini untuk dijadikan item dummy
    // Supaya datanya valid
    const product = await Product.findOne({ shop: { $exists: true } }); 
    const productName = product ? product.name : "Produk Contoh";
    const productPrice = product ? product.price : 50000;

    const newOrder = await Order.create({
      sellerId: user._id, // <--- INI KUNCINYA (Harus ID kamu)
      buyerName: "Budi Santoso (Simulasi)",
      items: [
        {
          productName: productName,
          quantity: 2,
          price: productPrice
        }
      ],
      totalAmount: productPrice * 2,
      status: "pending",
      createdAt: new Date()
    });

    console.log("🎉 Order Baru Terbuat:", newOrder._id);

    return NextResponse.json(newOrder);

  } catch (error) {
    console.error("Error POST:", error);
    return NextResponse.json({ error: "Gagal simulasi" }, { status: 500 });
  }
}