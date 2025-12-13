import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tip from "@/models/Tip";
import { getAuthUser } from "@/lib/session";

// GET - Fetch all tips (public)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query: any = { published: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const tips = await Tip.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      tips,
      total: tips.length,
    });
  } catch (error) {
    console.error("Error fetching tips:", error);
    return NextResponse.json(
      { message: "Gagal mengambil tips" },
      { status: 500 }
    );
  }
}

// POST - Create new tip (admin/seller only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    // Only admin or seller can create tips
    if (user.role !== "ADMIN" && user.role !== "SELLER") {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, excerpt, content, image, category } = body;

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { message: "Title, excerpt, content, dan category wajib diisi" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingTip = await Tip.findOne({ slug });
    if (existingTip) {
      return NextResponse.json(
        { message: "Judul sudah digunakan, gunakan judul lain" },
        { status: 400 }
      );
    }

    const newTip = await Tip.create({
      title,
      slug,
      excerpt,
      content,
      image: image || null,
      category,
      author: user.sub,
      authorName: user.name,
      published: true,
    });

    return NextResponse.json(
      { message: "Tip berhasil dibuat", tip: newTip },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tip:", error);
    return NextResponse.json(
      { message: "Gagal membuat tip" },
      { status: 500 }
    );
  }
}