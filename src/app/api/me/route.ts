import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session"; // Helper session/JWT
import connectDB from "@/lib/mongodb"; // Koneksi Database
import User from "@/models/User"; // Model User Mongoose

// Pastikan API ini selalu dinamis (tidak dicache statis)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Cek apakah user punya session login yang valid
    const verified = await getAuthUser();
    
    // Jika tidak ada session atau ID user (sub) tidak ditemukan -> Return null
    if (!verified || !verified.sub) {
      return NextResponse.json({ data: null });
    }

    // 2. Hubungkan ke MongoDB
    await connectDB();

    // 3. Cari User berdasarkan ID yang ada di session
    // .select("-password") membuang field password agar aman
    const user = await User.findById(verified.sub).select("-password");

    // Jika user tidak ditemukan di database (misal sudah dihapus)
    if (!user) {
      return NextResponse.json({ data: null });
    }

    // 4. Return data user yang aman
    return NextResponse.json({
      data: {
        id: user._id.toString(), // Konversi ObjectId ke String
        name: user.name,
        email: user.email,
        role: user.role, // Penting agar Header tahu ini USER atau SELLER
        image: user.image || "", // Avatar jika ada
        hasShop: user.hasShop || false,
        shopId: user.shopId ? user.shopId.toString() : null,
      },
    });

  } catch (err) {
    console.error("Error API /api/me:", err);
    // Jika error server, tetap return null agar frontend tidak crash
    return NextResponse.json({ data: null }, { status: 500 });
  }
}