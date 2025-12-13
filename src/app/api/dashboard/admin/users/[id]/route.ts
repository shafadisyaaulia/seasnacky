import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/lib/session";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "admin")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { role } = await req.json();

    // Validasi role
    const validRoles = ["BUYER", "SELLER", "ADMIN"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: "Role tidak valid" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: updatedUser });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "admin")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Cegah admin menghapus dirinya sendiri
    if (user.sub === id) {
      return NextResponse.json(
        { message: "Tidak dapat menghapus akun sendiri" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "User berhasil dihapus" });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
