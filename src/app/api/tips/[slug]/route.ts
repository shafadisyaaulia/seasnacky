import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tip from "@/models/Tip";

// GET - Get single tip by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const tip = await Tip.findOne({ slug, published: true }).lean();

    if (!tip) {
      return NextResponse.json(
        { message: "Tip tidak ditemukan" },
        { status: 404 }
      );
    }

    // Increment views
    await Tip.findByIdAndUpdate(tip._id, { $inc: { views: 1 } });

    return NextResponse.json({ tip });
  } catch (error) {
    console.error("Error fetching tip:", error);
    return NextResponse.json(
      { message: "Gagal mengambil tip" },
      { status: 500 }
    );
  }
}