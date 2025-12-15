import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { getAuthUser } from "@/lib/session";
import logger from "@/lib/logger";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    // Check authentication
    const user = await getAuthUser();
    if (!user || !user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, image, difficulty, time, ingredients, instructions, relatedProductId } = body;

    console.log("📝 Update Recipe - relatedProductId:", relatedProductId);

    // Check if recipe exists and belongs to user
    const existingRecipe = await Recipe.findById(id);
    if (!existingRecipe) {
      return NextResponse.json({ error: "Resep tidak ditemukan" }, { status: 404 });
    }
    
    if (existingRecipe.authorId.toString() !== user.sub) {
      return NextResponse.json({ error: "Anda tidak memiliki akses untuk mengedit resep ini" }, { status: 403 });
    }

    // Update relatedProducts array
    const updateData: any = {
      title,
      description,
      image,
      difficulty,
      time,
      ingredients,
      instructions,
    };

    // Handle relatedProducts update
    if (relatedProductId) {
      updateData.relatedProducts = [relatedProductId];
    } else {
      updateData.relatedProducts = [];
    }

    console.log("✅ Update Data relatedProducts:", updateData.relatedProducts);

    const recipe = await Recipe.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    logger.info(`Resep diupdate: ${recipe.title}`, {
      source: "API Recipes Update",
      recipeId: id,
      authorId: user.sub,
      title: recipe.title,
    });

    return NextResponse.json({ message: "Resep berhasil diperbarui", recipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json({ error: "Gagal memperbarui resep" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    // Check authentication
    const user = await getAuthUser();
    if (!user || !user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if recipe exists and belongs to user
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json({ error: "Resep tidak ditemukan" }, { status: 404 });
    }
    
    if (recipe.authorId.toString() !== user.sub) {
      return NextResponse.json({ error: "Anda tidak memiliki akses untuk menghapus resep ini" }, { status: 403 });
    }

    await Recipe.findByIdAndDelete(id);

    logger.info(`Resep dihapus: ${recipe.title}`, {
      source: "API Recipes Delete",
      recipeId: id,
      authorId: user.sub,
      title: recipe.title,
    });

    return NextResponse.json({ message: "Resep berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal hapus resep" }, { status: 500 });
  }
}
