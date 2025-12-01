import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Shop from "@/models/Shop";

// Paksa agar tidak ada cache
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    
    let query: any = {};
    if (category) query.category = category;

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // CCTV 1: Cek apakah API dipanggil
  console.log("🔥 API POST /api/products DIPANGGIL!");

  try {
    await connectDB();
    console.log("✅ Database Connected");

    const body = await request.json();
    // CCTV 2: Lihat data yang dikirim dari Frontend
    console.log("📦 Data yang diterima:", body);

    const { name, price, category, description, image, userId } = body;

    // 1. Cari Toko
    const shop = await Shop.findOne({ owner: userId });
    
    // CCTV 3: Apakah toko ketemu?
    if (!shop) {
      console.error("❌ Toko tidak ditemukan untuk User ID:", userId);
      return NextResponse.json({ error: "Kamu belum punya toko!" }, { status: 400 });
    }
    console.log("🏪 Toko ditemukan:", shop.name, "(ID:", shop._id, ")");

    // 2. Buat Produk
    const newProduct = await Product.create({
      shop: shop._id,
      name,
      price,
      category,
      description,
      images: [image], 
    });

    // CCTV 4: Berhasil simpan?
    console.log("🎉 SUKSES SIMPAN KE MONGO:", newProduct);

    return NextResponse.json(newProduct, { status: 201 });

  } catch (error: any) {
    // CCTV 5: Kalau error, errornya apa?
    console.error("☠️ ERROR BEHIND THE SCENE:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}