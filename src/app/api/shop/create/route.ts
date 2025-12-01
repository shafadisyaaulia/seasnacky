import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // Pastikan import ini benar
import User from "@/models/User";
import Shop from "@/models/Shop";
import Log from "@/models/Log";
import { z } from "zod";

// Schema Validasi
const ShopSchema = z.object({
  name: z.string().min(3, "Nama toko minimal 3 karakter"),
  description: z.string().optional(),
  address: z.string().min(5, "Alamat harus lengkap"),
  userId: z.string(), 
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Validasi
    const parsedData = ShopSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors[0].message }, { status: 400 });
    }

    const { name, description, address, userId } = parsedData.data;

    // Cek User
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    
    if (user.hasShop) return NextResponse.json({ error: "Anda sudah punya toko!" }, { status: 400 });

    // Buat Toko
    const newShop = await Shop.create({
      owner: userId,
      name,
      description,
      address,
    });

    // Update User
    user.hasShop = true;
    user.role = "seller";
    await user.save();

    // Log (Wajib UAS)
    await Log.create({
      level: "info",
      message: `User ${user.name} membuka toko: ${name}`,
      source: "API Shop Create"
    });

    return NextResponse.json({ success: true, shop: newShop });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}