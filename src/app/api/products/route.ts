import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import { upsertProductSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/guards";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10) || 1;
  const limit = Math.min(
    Number.parseInt(searchParams.get("limit") ?? "20", 10) || 20,
    50,
  );
  const sortParam = searchParams.get("sort") ?? "-createdAt";

  await connectToDatabase();

  const filter: Record<string, unknown> = { isPublished: true };

  if (category) {
    filter.category = { $regex: new RegExp(category, "i") };
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const query = ProductModel.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);

  if (sortParam) {
    query.sort(sortParam.split(",").join(" "));
  }

  const [products, total] = await Promise.all([
    query.lean(),
    ProductModel.countDocuments(filter),
  ]);

  return NextResponse.json({
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      filters: { search, category },
    },
  });
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

  const parseResult = upsertProductSchema.safeParse(payload);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: "Data produk tidak valid.", errors: parseResult.error.flatten() },
      { status: 422 },
    );
  }

  await connectToDatabase();

  const data = parseResult.data;
  const slug = data.slug || slugify(data.name);

  const existing = await ProductModel.findOne({ slug });
  if (existing) {
    return NextResponse.json({ message: "Slug produk sudah digunakan." }, { status: 409 });
  }

  const product = await ProductModel.create({
    ...data,
    slug,
  });

  return NextResponse.json(
    {
      message: "Produk berhasil dibuat.",
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
      },
    },
    { status: 201 },
  );
}
