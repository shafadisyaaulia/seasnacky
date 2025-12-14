import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Shop from "@/models/Shop";
import User from "@/models/User";
import { getAuthUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authData = await getAuthUser();
    if (!authData || !authData.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get full user data from database
    const user = await User.findById(authData.sub);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has a shop
    if (!user.shopId) {
      return NextResponse.json({
        hasShop: false,
        shopStatus: null
      });
    }

    // Get shop details
    const shop = await Shop.findById(user.shopId);
    
    if (!shop) {
      return NextResponse.json({
        hasShop: false,
        shopStatus: null
      });
    }

    return NextResponse.json({
      hasShop: true,
      shopStatus: shop.status,
      shopName: shop.name,
      shopId: shop._id,
      userRole: user.role
    });

  } catch (error: any) {
    console.error("Error checking shop status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check shop status" },
      { status: 500 }
    );
  }
}
