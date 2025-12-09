import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    // Ambil 4 produk sembarang sebagai rekomendasi
    const products = await Product.find().limit(4);
    return NextResponse.json({ data: products });
  } catch (error) {
    return NextResponse.json({ data: [] }); // Return kosong jika error
  }
}