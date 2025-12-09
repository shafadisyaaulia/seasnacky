import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Shop from "@/models/Shop"; // Model Toko Mongoose
import User from "@/models/User"; // Model User Mongoose (untuk update role)

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser();

    // Cek Login
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user._id; // ID dari session/database
    const { name, city, address, description } = await request.json();

    // 1. Cek apakah user sudah punya toko (Pakai Mongoose findOne)
    // Asumsi di Schema Shop field relasinya bernama 'owner'
    const existingStore = await Shop.findOne({ owner: userId });
    
    if (existingStore) {
      return NextResponse.json({ message: "Anda sudah memiliki toko." }, { status: 400 });
    }

    // 2. Update role user menjadi SELLER (Pakai Mongoose findByIdAndUpdate)
    await User.findByIdAndUpdate(userId, { role: "seller" });

    // 3. Buat data toko baru (Pakai Mongoose create)
    const newShop = await Shop.create({
        name,
        city,
        address,
        description,
        owner: userId, // Relasi ke User
        image: "", // Default kosong atau placeholder
        rating: 0
    });

    return NextResponse.json({ message: "Toko berhasil dibuat.", data: newShop }, { status: 201 });

  } catch (err: any) {
    console.error("Error Open Shop:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}