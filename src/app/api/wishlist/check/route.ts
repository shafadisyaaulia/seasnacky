import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import { getAuthUser } from "@/lib/session";

// GET - Check if product is in wishlist
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ inWishlist: false });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID diperlukan" },
        { status: 400 }
      );
    }

    const item = await Wishlist.findOne({
      userId: user.sub,
      productId,
    });

    return NextResponse.json({ inWishlist: !!item });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return NextResponse.json({ inWishlist: false });
  }
}
