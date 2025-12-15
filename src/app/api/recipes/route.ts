import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import Product from "@/models/Product";
import logger from "@/lib/logger"; 

// Paksa Dynamic biar selalu fresh
export const dynamic = "force-dynamic";

// GET: Ambil Resep (bisa filter by authorId untuk seller dashboard)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if filtering by authorId (untuk dashboard seller)
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');
    
    const query = authorId ? { authorId } : {};
    const recipes = await Recipe.find(query).populate("relatedProducts").sort({ createdAt: -1 });
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
    
    // Pastikan ada authorId
    if (!body.authorId) {
      return NextResponse.json({ error: "Author ID required" }, { status: 400 });
    }
    
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
      relatedProducts: body.relatedProductId ? [body.relatedProductId] : [],
      authorId: body.authorId // Simpan author
    });

    logger.info(`Resep baru dibuat: ${newRecipe.title}`, {
      source: "API Recipes Create",
      recipeId: newRecipe._id.toString(),
      authorId: body.authorId,
      title: newRecipe.title,
    });

    return NextResponse.json(newRecipe, { status: 201 });

  } catch (error: any) {
    console.error("Gagal simpan resep:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}