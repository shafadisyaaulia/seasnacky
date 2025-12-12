import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

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
