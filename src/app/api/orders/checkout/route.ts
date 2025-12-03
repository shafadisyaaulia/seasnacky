import { NextRequest, NextResponse } from "next/server";
import { simulateCheckout, products, orders } from "../../_data/mockData";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { userId, items, shippingAddress, recipientName, recipientPhone } = payload;
    
    // Check if it's a guest user
    const isGuest = userId && userId.startsWith("guest-");
    
    let result;
    if (isGuest) {
      // Create order directly for guest user without checking user existence
      const enrichedItems = items.map((item: any) => {
        const product = products.find((p: any) => p.id === item.productId || p._id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product ? product.price * item.quantity : 0,
        };
      });
      const total = enrichedItems.reduce((sum: number, item: any) => sum + item.price, 0);
      result = {
        id: `INV-${Math.floor(Math.random() * 9000 + 1000)}`,
        userId,
        status: "pending",
        paymentStatus: "pending",
        total,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        items: enrichedItems,
        shippingAddress,
        recipientName,
        recipientPhone,
      };
      // Save to orders array
      orders.push(result);
    } else {
      result = simulateCheckout(userId, items);
    }

    if (!result) {
      return NextResponse.json(
        { message: "Gagal melakukan checkout. User tidak ditemukan." },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}