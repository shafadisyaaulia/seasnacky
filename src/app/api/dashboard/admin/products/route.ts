import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
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

    const products = await Product.find()
      .populate("shop", "name")
      .populate("sellerId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ products });

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
