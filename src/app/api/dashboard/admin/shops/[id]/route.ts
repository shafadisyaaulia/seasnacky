import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Shop from "@/models/Shop";
import User from "@/models/User";
import { getAuthUser } from "@/lib/session";
import logger from "@/lib/logger";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "admin")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!["active", "pending", "suspended"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    const shop = await Shop.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('sellerId', 'name email');

    if (!shop) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    // Prepare notification data
    const notificationData: any = {
      message: "Shop status updated successfully",
      shop,
    };

    // Add notification flags based on status change
    if (status === "active") {
      // Update user role to seller when approved and ensure shopId is set
      await User.findByIdAndUpdate(shop.sellerId, {
        role: "seller",
        hasShop: true,
        shopId: shop._id  // Ensure shopId is set
      });
      
      logger.info(`Admin menyetujui toko: ${shop.name}`, {
        source: "API Admin Shop Approve",
        shopId: shop._id.toString(),
        shopName: shop.name,
        sellerId: shop.sellerId?.toString(),
      });
      
      notificationData.notifyShopApproved = true;
      notificationData.shopName = shop.name;
      notificationData.sellerId = shop.sellerId;
    } else if (status === "suspended") {
      // Revert user role to buyer and clear shop info when rejected
      await User.findByIdAndUpdate(shop.sellerId, {
        role: "buyer",
        hasShop: false,
        shopId: null
      });
      
      logger.warn(`Admin menolak toko: ${shop.name}`, {
        source: "API Admin Shop Reject",
        shopId: shop._id.toString(),
        shopName: shop.name,
        sellerId: shop.sellerId?.toString(),
      });
      
      notificationData.notifyShopRejected = true;
      notificationData.shopName = shop.name;
      notificationData.sellerId = shop.sellerId;
    }

    return NextResponse.json(notificationData);

  } catch (error: any) {
    console.error("Error updating shop:", error);
    logger.error(`Error updating shop status: ${error.message}`, {
      source: "API Admin Shop Update",
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
