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

export async function PUT(req: Request) {
  try {
    const session = await getAuthUser();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, address } = body;

    // Validasi
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
    }

    await connectDB();
    
    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      session.sub,
      {
        name: name.trim(),
        phone: phone?.trim() || "",
        address: address?.trim() || "",
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Profile berhasil diperbarui",
      data: updatedUser 
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ 
      error: error.message || "Server Error" 
    }, { status: 500 });
  }
}