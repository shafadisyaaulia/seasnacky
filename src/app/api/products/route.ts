import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Shop from "@/models/Shop"; // Kita butuh Shop model

// GET: Ambil semua produk
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

// POST: Tambah Produk Baru
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, price, category, description, image, userId } = body;

    // 1. Cari Toko milik User ini
    const shop = await Shop.findOne({ owner: userId });
    if (!shop) {
      return NextResponse.json({ error: "Kamu belum punya toko!" }, { status: 400 });
    }

    // 2. Buat Produk
    const newProduct = await Product.create({
      shop: shop._id, // Link ke Toko
      name,
      price,
      category,
      description,
      images: [image], // Simpan sebagai array
    });

    return NextResponse.json(newProduct, { status: 201 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}