import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ArticleModel from "@/lib/models/Article";
import { upsertArticleSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/guards";
import { slugify } from "@/lib/utils";

function articleQuery(identifier: string) {
  return ArticleModel.findOne({ slug: identifier });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  await connectToDatabase();
  const { slug } = await context.params;
  const article = await articleQuery(slug).lean();

  if (!article || (!article.isPublished && process.env.NODE_ENV === "production")) {
    return NextResponse.json({ message: "Artikel tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ data: article });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const guard = await requireAuth({ adminOnly: true });
  if (!guard.user) {
    return guard.response;
  }

  const payload = await request.json().catch(() => undefined);
  if (!payload) {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const parsed = upsertArticleSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data artikel tidak valid.", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ message: "Tidak ada perubahan yang dikirim." }, { status: 422 });
  }

  await connectToDatabase();
  const { slug } = await context.params;
  const article = await articleQuery(slug);

  if (!article) {
    return NextResponse.json({ message: "Artikel tidak ditemukan." }, { status: 404 });
  }

  const updates = parsed.data;
  if (updates.title && !updates.slug) {
    updates.slug = slugify(updates.title);
  }

  const targetSlug = updates.slug ?? article.slug;
  if (targetSlug !== article.slug) {
    const existing = await ArticleModel.findOne({ slug: targetSlug, _id: { $ne: article._id } });
    if (existing) {
      return NextResponse.json({ message: "Slug artikel sudah digunakan." }, { status: 409 });
    }
  }

  Object.assign(article, { ...updates, slug: targetSlug });
  await article.save();

  return NextResponse.json({
    message: "Artikel diperbarui.",
    data: { id: article.id, slug: article.slug, title: article.title },
  });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const guard = await requireAuth({ adminOnly: true });
  if (!guard.user) {
    return guard.response;
  }

  await connectToDatabase();
  const { slug } = await context.params;
  const article = await articleQuery(slug);

  if (!article) {
    return NextResponse.json({ message: "Artikel tidak ditemukan." }, { status: 404 });
  }

  article.isPublished = false;
  await article.save();

  return NextResponse.json({ message: "Artikel dinonaktifkan." });
}