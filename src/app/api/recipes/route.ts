import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import Product from "@/models/Product"; 

// Paksa Dynamic biar selalu fresh
export const dynamic = "force-dynamic";

// GET: Ambil Semua Resep
export async function GET() {
  try {
    await connectDB();
    const recipes = await Recipe.find().populate("relatedProducts").sort({ createdAt: -1 });
    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil resep" }, { status: 500 });
  }
}

// POST: Tambah Resep Baru (Seller)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Generate Slug sederhana dari Title (Contoh: "Udang Saus" -> "udang-saus-123")
    const slug = body.title.toLowerCase().replace(/ /g, "-") + "-" + Date.now().toString().slice(-4);

    const newRecipe = await Recipe.create({
      title: body.title,
      slug: slug,
      description: body.description,
      image: body.image,
      difficulty: body.difficulty,
      time: body.time,
      ingredients: body.ingredients,   // Sudah array dari frontend
      instructions: body.instructions, // Sudah array dari frontend
      relatedProducts: body.relatedProductId ? [body.relatedProductId] : []
    });

    return NextResponse.json(newRecipe, { status: 201 });

  } catch (error: any) {
    console.error("Gagal simpan resep:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}