import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Shop from "@/models/Shop";
import { getAuthUser } from "@/lib/session";

// GET - Get shop info for current seller
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    if (user.role !== "SELLER" && user.role !== "seller") {
      return NextResponse.json(
        { message: "Akses ditolak. Hanya untuk seller." },
        { status: 403 }
      );
    }

    const shop = await Shop.findOne({ sellerId: user.sub }).lean();

    if (!shop) {
      return NextResponse.json(
        { message: "Toko tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ shop });

  } catch (error) {
    console.error("Error fetching shop:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data toko" },
      { status: 500 }
    );
  }
}

// PUT - Update shop info
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    if (user.role !== "SELLER" && user.role !== "seller") {
      return NextResponse.json(
        { message: "Akses ditolak. Hanya untuk seller." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, address, description, bankName, bankAccountNumber, bankAccountName } = body;

    if (!name || !address) {
      return NextResponse.json(
        { message: "Nama toko dan alamat wajib diisi" },
        { status: 400 }
      );
    }

    const shop = await Shop.findOne({ sellerId: user.sub });

    if (!shop) {
      return NextResponse.json(
        { message: "Toko tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update shop info
    shop.name = name;
    shop.address = address;
    shop.description = description || "";
    shop.bankName = bankName || "";
    shop.bankAccountNumber = bankAccountNumber || "";
    shop.bankAccountName = bankAccountName || "";
    await shop.save();

    return NextResponse.json({
      message: "Toko berhasil diperbarui",
      shop,
    });

  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui toko" },
      { status: 500 }
    );
  }
}
