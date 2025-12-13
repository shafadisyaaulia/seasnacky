import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Shop from "@/models/Shop";
import { getAuthUser } from "@/lib/session";

export async function GET() {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "admin")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get total sellers
    const totalSellers = await User.countDocuments({ role: "SELLER" });

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get pending shops
    const pendingShops = await Shop.countDocuments({ status: "pending" });

    // Get total revenue from completed orders
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: { $in: ["paid", "completed"] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        pendingShops,
        totalRevenue,
      }
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
