import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import TipModel from "@/lib/models/Tip";
import { upsertTipSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/guards";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const search = request.nextUrl.searchParams.get("search") ?? undefined;

  const filter: Record<string, unknown> = { isPublished: true };
  if (search) {
    filter.$text = { $search: search };
  }

  const tips = await TipModel.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: tips });
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

  const parseResult = upsertTipSchema.safeParse(payload);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: "Data tips tidak valid.", errors: parseResult.error.flatten() },
      { status: 422 },
    );
  }

  await connectToDatabase();
  const data = parseResult.data;
  const slug = data.slug || slugify(data.title);

  const existing = await TipModel.findOne({ slug });
  if (existing) {
    return NextResponse.json({ message: "Slug tips sudah digunakan." }, { status: 409 });
  }

  const tip = await TipModel.create({ ...data, slug });

  return NextResponse.json(
    {
      message: "Tips penyimpanan berhasil dibuat.",
      data: { id: tip.id, title: tip.title, slug: tip.slug },
    },
    { status: 201 },
  );
}
