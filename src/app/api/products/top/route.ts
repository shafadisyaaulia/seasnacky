import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    // Ambil 5 produk (nanti bisa di-sort by sales kalau sudah ada data order)
    const products = await Product.find().limit(5);
    return NextResponse.json({ data: products });
  } catch (error) {
    return NextResponse.json({ data: [] });
  }
}