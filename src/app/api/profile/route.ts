import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAuthUser();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.sub).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// Dummy PUT untuk update profile (biar build lolos dulu)
export async function PUT() {
    return NextResponse.json({ message: "Update berhasil (Dummy)" });
}