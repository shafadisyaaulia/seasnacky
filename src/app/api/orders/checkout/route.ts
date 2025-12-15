import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";   // Model Order MongoDB
import Product from "@/models/Product"; // Model Product MongoDB
import Shop from "@/models/Shop";     // Model Shop MongoDB
import { getAuthUser } from "@/lib/session"; // Cek User Login
import logger from "@/lib/logger";

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

    // Get items from payload
    let orderItems = [];
    let totalAmount = 0;
    let sellerId;

    if (payload.items && payload.items.length > 0) {
      // Multiple items dari cart
      for (const item of payload.items) {
        const product = await Product.findById(item.productId);
        if (!product) continue;
        
        // Get sellerId dari product pertama
        if (!sellerId) {
          if (product.sellerId) {
            sellerId = product.sellerId;
          } else if (product.shop) {
            const shop = await Shop.findById(product.shop);
            if (shop?.owner) sellerId = shop.owner;
          }
        }
        
        orderItems.push({
          productId: product._id,
          productName: product.name,
          quantity: item.quantity,
          price: product.price
        });
        
        totalAmount += product.price * item.quantity;
      }
    } else if (payload.productId) {
      // Single product dari "Beli Sekarang"
      const product = await Product.findById(payload.productId);
      if (!product) {
        return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
      }
      
      if (product.sellerId) {
        sellerId = product.sellerId;
      } else if (product.shop) {
        const shop = await Shop.findById(product.shop);
        if (shop?.owner) sellerId = shop.owner;
      }
      
      const qty = payload.quantity || 1;
      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: qty,
        price: product.price
      });
      
      totalAmount = product.price * qty;
    }

    if (orderItems.length === 0) {
      logger.error(`Checkout gagal: Keranjang kosong`, {
        source: "api/orders/checkout",
        userId,
        buyerName
      });
      return NextResponse.json({ message: "Tidak ada item untuk checkout" }, { status: 400 });
    }

    // VALIDASI: Cek apakah address lengkap
    if (!payload.shippingAddress || payload.shippingAddress.trim() === "") {
      logger.error(`Checkout gagal: Alamat pengiriman kosong`, {
        source: "api/orders/checkout",
        userId,
        buyerName,
        itemsCount: orderItems.length
      });
      return NextResponse.json({ message: "Alamat pengiriman harus diisi" }, { status: 400 });
    }
    
    // Fallback sellerId jika tidak ada
    if (!sellerId) {
      console.warn("⚠️ Product tidak punya sellerId/shop, menggunakan buyer sebagai seller (demo mode)");
      sellerId = userId;
    }

    // Get shipping cost from payload
    const shippingCost = payload.shippingCost || 0;
    const finalTotal = totalAmount + shippingCost;

    console.log("💰 Order Summary:", {
      subtotal: totalAmount,
      shippingCost: shippingCost,
      finalTotal: finalTotal
    });

    // 4. SIMPAN KE MONGODB (Collection 'orders')
    const newOrder = await Order.create({
      sellerId: sellerId,
      buyerName: buyerName,
      recipientName: buyerName,
      shippingAddress: payload.shippingAddress || "",
      items: orderItems,
      shippingCost: shippingCost,
      totalAmount: finalTotal,
      status: "pending",
      createdAt: new Date()
    });

    console.log("🎉 Order Real Berhasil:", newOrder._id);
    console.log("📦 Saved Order:", {
      id: newOrder._id,
      totalAmount: newOrder.totalAmount,
      shippingCost: newOrder.shippingCost,
      itemsTotal: totalAmount
    });

    logger.info(`Order baru dibuat oleh ${buyerName}`, {
      source: "API Orders Checkout",
      orderId: newOrder._id.toString(),
      totalAmount: finalTotal,
      itemCount: orderItems.length,
    });

    return NextResponse.json({
      id: newOrder._id.toString(),
      orderId: newOrder._id.toString(),
      status: newOrder.status,
      totalAmount: newOrder.totalAmount,
      message: "Order berhasil dibuat"
    }, { status: 201 });

  } catch (error: any) {
    console.error("Checkout DB Error:", error);
    logger.error(`Checkout error: ${error.message}`, {
      source: "API Orders Checkout",
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ message: "Gagal checkout", error: error.message }, { status: 500 });
  }
}