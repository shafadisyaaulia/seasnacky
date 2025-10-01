import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import TipModel from "@/lib/models/Tip";
import { upsertTipSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/guards";
import { slugify } from "@/lib/utils";

function tipQuery(identifier: string) {
  return TipModel.findOne({ slug: identifier });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  await connectToDatabase();
  const { slug } = await context.params;
  const tip = await tipQuery(slug).lean();

  if (!tip || (!tip.isPublished && process.env.NODE_ENV === "production")) {
    return NextResponse.json({ message: "Tips tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ data: tip });
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

  const parsed = upsertTipSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tips tidak valid.", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ message: "Tidak ada perubahan yang dikirim." }, { status: 422 });
  }

  await connectToDatabase();
  const { slug } = await context.params;
  const tip = await tipQuery(slug);

  if (!tip) {
    return NextResponse.json({ message: "Tips tidak ditemukan." }, { status: 404 });
  }

  const updates = parsed.data;
  if (updates.title && !updates.slug) {
    updates.slug = slugify(updates.title);
  }

  const targetSlug = updates.slug ?? tip.slug;
  if (targetSlug !== tip.slug) {
    const existing = await TipModel.findOne({ slug: targetSlug, _id: { $ne: tip._id } });
    if (existing) {
      return NextResponse.json({ message: "Slug tips sudah digunakan." }, { status: 409 });
    }
  }

  Object.assign(tip, { ...updates, slug: targetSlug });
  await tip.save();

  return NextResponse.json({
    message: "Tips diperbarui.",
    data: { id: tip.id, slug: tip.slug, title: tip.title },
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
  const tip = await tipQuery(slug);

  if (!tip) {
    return NextResponse.json({ message: "Tips tidak ditemukan." }, { status: 404 });
  }

  tip.isPublished = false;
  await tip.save();

  return NextResponse.json({ message: "Tips dinonaktifkan." });
}