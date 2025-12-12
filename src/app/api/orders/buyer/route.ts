import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get authenticated user
    const user = await getAuthUser();
    if (!user || !user.sub) {
      return NextResponse.json({ 
        error: "Unauthorized - Login required" 
      }, { status: 401 });
    }

    const userId = user.sub;
    const buyerName = user.name;
    
    // Find orders by buyer name (since we don't have buyerId field)
    // You might want to add a buyerId field to Order model for better querying
    const orders = await Order.find({ 
      buyerName: buyerName 
    })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      data: orders,
      meta: {
        total: orders.length,
      },
    });
  } catch (error: any) {
    console.error("Error fetching buyer orders:", error);
    return NextResponse.json({ 
      error: "Failed to fetch orders",
      message: error.message 
    }, { status: 500 });
  }
}
