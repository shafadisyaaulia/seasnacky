import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";   // Model Order MongoDB
import Product from "@/models/Product"; // Model Product MongoDB
import Shop from "@/models/Shop";     // Model Shop MongoDB
import { getAuthUser } from "@/lib/session"; // Cek User Login

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // 1. Cek Login Pembeli - WAJIB LOGIN
    const user = await getAuthUser();
    if (!user || !user.sub) {
      return NextResponse.json({ 
        message: "Silakan login terlebih dahulu untuk melakukan checkout" 
      }, { status: 401 });
    }

    const payload = await request.json();
    console.log("📦 Checkout Payload:", payload);
    
    const userId = user.sub;
    const buyerName = payload.customerName || user.name || "User";

    // Normalisasi Data:
    // Tombol "Beli Sekarang" di Resep mengirim: { productId, quantity }
    // Cart/Mock lama mungkin mengirim format lain. Kita fokus ke yang Resep dulu.
    let targetProductId = payload.productId;
    let targetQty = payload.quantity || 1;

    // Jika formatnya items array (dari cart), ambil item pertama (MVP)
    if (payload.items && payload.items.length > 0) {
       targetProductId = payload.items[0].productId;
       targetQty = payload.items[0].quantity || 1;
    }

    if (!targetProductId) {
       return NextResponse.json({ message: "Data produk tidak valid" }, { status: 400 });
    }

    // 2. Cari Produk di MongoDB
    const product = await Product.findById(targetProductId);
    if (!product) {
      return NextResponse.json({ message: "Produk tidak ditemukan di Database" }, { status: 404 });
    }

    // 3. Cari Toko Penjual (Seller)
    // Produk harus punya field 'shop' yang berisi ID Toko
    if (!product.shop) {
       return NextResponse.json({ message: "Produk ini tidak memiliki data toko (Data Lama/Rusak)" }, { status: 400 });
    }

    const shop = await Shop.findById(product.shop);
    if (!shop) {
       return NextResponse.json({ message: "Toko penjual tidak ditemukan" }, { status: 404 });
    }

    const sellerId = shop.owner; // ID User Penjual

    // 4. SIMPAN KE MONGODB (Collection 'orders')
    const newOrder = await Order.create({
      sellerId: sellerId,        // Masuk ke dashboard seller ini
      buyerName: buyerName,      // Nama Pembeli
      recipientName: buyerName,
      shippingAddress: payload.shippingAddress || "",
      items: [
        {
          productId: product._id,
          productName: product.name,
          quantity: targetQty,
          price: product.price
        }
      ],
      totalAmount: product.price * targetQty,
      status: "pending",
      createdAt: new Date()
    });

    console.log("🎉 Order Real Berhasil:", newOrder._id);

    return NextResponse.json({
      id: newOrder._id.toString(),
      orderId: newOrder._id.toString(),
      status: newOrder.status,
      totalAmount: newOrder.totalAmount,
      message: "Order berhasil dibuat"
    }, { status: 201 });

  } catch (error: any) {
    console.error("Checkout DB Error:", error);
    return NextResponse.json({ message: "Gagal checkout", error: error.message }, { status: 500 });
  }
}