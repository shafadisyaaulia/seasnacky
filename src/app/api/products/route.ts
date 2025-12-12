// File: src/app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User"; // Diperlukan untuk otorisasi di POST

// Paksa agar API ini selalu fresh (tidak di-cache statis)
export const dynamic = "force-dynamic";

// --- 1. GET: Ambil Produk (Termasuk Filter Search, Category, dan Seller) ---
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const id = searchParams.get("id");
    const sellerId = searchParams.get("sellerId"); // <--- FILTER KRITIS UNTUK DASHBOARD SELLER

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

    // Filter berdasarkan Seller ID (Jika diminta oleh Dashboard Seller)
    if (sellerId) {
        query.sellerId = sellerId;
    }
    
    // Filter berdasarkan Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, 
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Filter berdasarkan Kategori
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

// --- 2. POST: Tambah Produk Baru (DENGAN OTORISASI SELLER) ---
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const sellerId = body.userId; // Mengambil userId dari payload frontend
    
    // 1. Validasi Otorisasi Awal
    if (!sellerId) {
      return NextResponse.json({ error: "Otorisasi gagal: ID user tidak ditemukan" }, { status: 401 });
    }

    const seller = await User.findById(sellerId).select('role shopId'); 
    
    // Pengecekan Kritis: Harus ada user, role harus 'seller', dan harus punya shopId
    if (!seller || seller.role !== 'seller' || !seller.shopId) {
      return NextResponse.json({ error: "Akses ditolak: Anda bukan seller yang terotorisasi atau toko belum disetujui" }, { status: 403 });
    }
    
    // 2. Validasi Data Produk
    if (!body.name || !body.price || !body.description || !body.image || !body.stock) {
      return NextResponse.json({ error: "Semua field (Nama, Harga, Deskripsi, Gambar, Stok) wajib diisi" }, { status: 400 });
    }

    // 3. Pembuatan Produk
    const newProduct = await Product.create({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      category: body.category || "mentah",
      stock: Number(body.stock), // Menggunakan stock dari body
      image: body.image, 
      images: [body.image],
      // Menghubungkan produk ke Toko dan Seller yang sudah divalidasi
      shop: seller.shopId, 
      sellerId: sellerId, 
    });

    return NextResponse.json(newProduct, { status: 201 });

  } catch (error: any) {
    console.error("Error Create Product:", error);
    if (error.name === 'ValidationError') {
       return NextResponse.json({ error: "Data produk tidak valid sesuai skema database" }, { status: 422 });
    }
    return NextResponse.json({ error: "Gagal menyimpan produk. Error internal server." }, { status: 500 });
  }
}

// --- 3. DELETE: Hapus Produk (Untuk Seller) ---
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    
    // ⚠️ PERINGATAN: TAMBAH OTORISASI DI SINI!
    // Sebelum menghapus, Anda HARUS memastikan seller yang login adalah pemilik produk.
    // Kode di bawah ini masih menghapus produk tanpa otorisasi.
    
    if (!id) {
      return NextResponse.json({ error: "ID Produk diperlukan" }, { status: 400 });
    }

    // Perlu dicek apakah produk milik seller yang sedang login sebelum dihapus

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error: any) {
    console.error("Error Delete Product:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}