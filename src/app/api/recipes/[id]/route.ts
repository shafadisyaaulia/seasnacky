import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const body = await request.json();
    const { title, description, image, difficulty, time, ingredients, instructions, relatedProductId } = body;

    const recipe = await Recipe.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image,
        difficulty,
        time,
        ingredients,
        instructions,
        relatedProductId: relatedProductId || null,
      },
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return NextResponse.json({ error: "Resep tidak ditemukan" }, { status: 404 });
    }

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

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return NextResponse.json({ error: "Resep tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resep berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal hapus resep" }, { status: 500 });
  }
}
