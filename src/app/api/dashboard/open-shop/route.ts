import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthUser();
    if (!session?.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = session.sub;
    const { name, city, address, description } = await request.json();

    // Cek apakah user sudah punya toko
    const existingStore = await prisma.store.findUnique({ where: { userId } });
    if (existingStore) {
      return NextResponse.json({ message: "Anda sudah memiliki toko." }, { status: 400 });
    }

    // Update role user menjadi SELLER
    await prisma.user.update({
      where: { id: userId },
      data: { role: "SELLER" },
    });

    // Buat data toko baru dan relasikan ke user
    const store = await prisma.store.create({
      data: {
        name,
        city,
        address,
        description,
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json({ message: "Toko berhasil dibuat.", data: store }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
