import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ArticleModel from "@/lib/models/Article";
import { upsertArticleSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/guards";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const category = request.nextUrl.searchParams.get("category") ?? undefined;
  const search = request.nextUrl.searchParams.get("search") ?? undefined;

  const filter: Record<string, unknown> = { isPublished: true };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const articles = await ArticleModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ data: articles });
}

export async function POST(request: NextRequest) {
  const guard = await requireAuth({ adminOnly: true });
  if (!guard.user) {
    return guard.response;
  }

  const payload = await request.json().catch(() => undefined);
  if (!payload) {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const parseResult = upsertArticleSchema.safeParse(payload);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: "Data artikel tidak valid.", errors: parseResult.error.flatten() },
      { status: 422 },
    );
  }

  await connectToDatabase();

  const data = parseResult.data;
  const slug = data.slug || slugify(data.title);

  const existing = await ArticleModel.findOne({ slug });
  if (existing) {
    return NextResponse.json({ message: "Slug artikel sudah digunakan." }, { status: 409 });
  }

  const article = await ArticleModel.create({ ...data, slug });

  return NextResponse.json(
    {
      message: "Artikel berhasil dibuat.",
      data: {
        id: article.id,
        title: article.title,
        slug: article.slug,
      },
    },
    { status: 201 },
  );
}
