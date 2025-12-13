import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Shop from "@/models/Shop";
import { getAuthUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user || (user.role !== "SELLER" && user.role !== "seller")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get period from query params
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";

    // Find seller's shop
    const shop = await Shop.findOne({ sellerId: user.sub });
    if (!shop) {
      return NextResponse.json(
        { message: "Toko tidak ditemukan" },
        { status: 404 }
      );
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    if (period === "month") {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === "quarter") {
      startDate.setMonth(now.getMonth() - 3);
    } else if (period === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    // Get seller's products
    const sellerProducts = await Product.find({ sellerId: user.sub }).select("_id");
    const productIds = sellerProducts.map(p => p._id);

    // Get orders for seller's products
    const orders = await Order.find({
      "items.productId": { $in: productIds },
      createdAt: { $gte: startDate },
      status: { $in: ["pending", "processing", "completed"] }
    }).populate("items.productId", "name");

    // Calculate total revenue
    let totalRevenue = 0;
    const recentOrders: any[] = [];

    orders.forEach(order => {
      order.items.forEach((item: any) => {
        if (productIds.some(id => id.toString() === item.productId._id.toString())) {
          const itemTotal = item.price * item.quantity;
          totalRevenue += itemTotal;
          
          recentOrders.push({
            id: order._id.toString(),
            productName: item.productId.name,
            amount: itemTotal,
            date: new Date(order.createdAt).toLocaleDateString("id-ID"),
            status: order.status
          });
        }
      });
    });

    // Sort recent orders by date
    recentOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      totalRevenue,
      recentOrders: recentOrders.slice(0, 20), // Limit to 20 most recent
      monthlyRevenue: [] // TODO: Implement monthly breakdown
    });

  } catch (error) {
    console.error("Error fetching revenue:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
