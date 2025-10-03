import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUserProfile } from "../_data/mockData";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "User ID tidak ditemukan." },
      { status: 400 }
    );
  }

  const user = getUserById(userId);

  if (!user) {
    return NextResponse.json(
      { message: "Pengguna tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: user });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  const { userId, ...data } = payload;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID tidak ditemukan." },
      { status: 400 }
    );
  }

  const updatedUser = updateUserProfile(userId, data);

  if (!updatedUser) {
    return NextResponse.json(
      { message: "Gagal memperbarui profil." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Profil berhasil diperbarui.",
    data: updatedUser,
  });
}