import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Shop from "@/models/Shop";
import { getAuthUser } from "@/lib/session";

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
    );

    if (!shop) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Shop status updated successfully",
      shop,
    });

  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
