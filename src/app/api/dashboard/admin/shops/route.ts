import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
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

    const shops = await Shop.find()
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ shops });

  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
