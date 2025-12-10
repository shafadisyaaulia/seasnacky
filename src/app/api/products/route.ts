import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// Paksa agar API ini selalu fresh (tidak di-cache statis)
export const dynamic = "force-dynamic";

// 1. GET: Ambil Produk (Bisa Filter Search & Category)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const id = searchParams.get("id"); // Support ambil by ID juga

    // Jika ada parameter ID, kembalikan 1 produk saja
    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json({
        ...product.toObject(),
        id: product._id.toString(),
      });
    }

    // Build Query MongoDB
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // 'i' artinya tidak peduli huruf besar/kecil
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (category && category !== "all") {
      query.category = category;
    }

    // Ambil data dari MongoDB
    const products = await Product.find(query).sort({ createdAt: -1 });

    // Transform to include id field
    const result = products.map(p => ({
      ...p.toObject(),
      id: p._id.toString(),
    }));

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error GET Products:", error);
    return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

// 2. POST: Tambah Produk Baru (Untuk Seller)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validasi sederhana
    if (!body.name || !body.price) {
      return NextResponse.json({ error: "Nama dan Harga wajib diisi" }, { status: 400 });
    }

    const newProduct = await Product.create({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      category: body.category || "Umum",
      stock: Number(body.stock) || 1,
      image: body.image || "", // URL Cloudinary
      images: body.image ? [body.image] : [], // Support array images
      shop: body.shop, // ID Toko (Seller)
      sellerId: body.sellerId, // ID User Seller
    });

    return NextResponse.json(newProduct, { status: 201 });

  } catch (error: any) {
    console.error("Error Create Product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. DELETE: Hapus Produk (Untuk Seller)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID Produk diperlukan" }, { status: 400 });
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error: any) {
    console.error("Error Delete Product:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}