// API untuk refresh session user (update JWT dengan data terbaru dari database)
import { NextResponse } from "next/server";
import { getAuthUser, createSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // 1. Cek session saat ini
    const currentSession = await getAuthUser();
    
    if (!currentSession || !currentSession.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Ambil data user terbaru dari database
    await connectDB();
    const user = await User.findById(currentSession.sub).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Buat session baru dengan data terbaru
    const newPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      hasShop: user.hasShop,
      name: user.name,
    };

    await createSession(newPayload);

    // 4. Return user data yang ter-update
    return NextResponse.json({
      success: true,
      message: "Session refreshed",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        hasShop: user.hasShop,
        shopId: user.shopId,
      },
    });

  } catch (error: any) {
    console.error("Refresh session error:", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
