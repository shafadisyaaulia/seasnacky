import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import UserModel from "@/lib/models/User";
import { getAuthUser } from "@/lib/session";
import type { HydratedDocument } from "mongoose";
import type { Order } from "@/lib/models/Order"; // pastikan ada model Order

// Definisikan tipe untuk hasil query termasuk orders
interface UserWithOrders {
  name: string;
  email: string;
  address: string;
  loyaltyPoints: number;
  role: "user" | "admin";
  createdAt: Date;
  orders: HydratedDocument<Order>[]; // lebih spesifik daripada any[]
}

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const authUser = await getAuthUser();
  const queryUserId = request.nextUrl.searchParams.get("userId");
  const targetUserId = queryUserId ?? authUser?.sub;

  if (!targetUserId) {
    return NextResponse.json(
      { message: "Tidak ada sesi pengguna aktif." },
      { status: 401 }
    );
  }

  if (authUser && authUser.role !== "admin" && authUser.sub !== targetUserId) {
    return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  }

  // Ambil user dari DB dan beri type assertion agar TypeScript tahu orders ada
  const user = (await UserModel.findById(targetUserId)
    .select("name email address loyaltyPoints orders role createdAt")
    .populate("orders") // pastikan orders dipopulate
    .lean()) as UserWithOrders | null;

  if (!user) {
    return NextResponse.json({ message: "Pengguna tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: targetUserId,
      name: user.name,
      email: user.email,
      address: user.address,
      loyaltyPoints: user.loyaltyPoints,
      role: user.role,
      createdAt: user.createdAt,
      orders: user.orders ?? [], // fallback kalau orders kosong
    },
  });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json().catch(() => undefined);
  if (!payload) {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const { userId, name, address } = payload as {
    userId?: string;
    name?: string;
    address?: string;
  };

  const targetUserId = userId ?? authUser.sub;

  if (authUser.role !== "admin" && authUser.sub !== targetUserId) {
    return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  }

  await connectToDatabase();

  const updated = await UserModel.findByIdAndUpdate(
    targetUserId,
    {
      ...(name ? { name } : {}),
      ...(address ? { address } : {}),
    },
    { new: true, runValidators: true }
  );

  if (!updated) {
    return NextResponse.json({ message: "Pengguna tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Profil berhasil diperbarui.",
    data: {
      id: updated._id,
      name: updated.name,
      address: updated.address,
      loyaltyPoints: updated.loyaltyPoints,
    },
  });
}
