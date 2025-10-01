import { NextRequest, NextResponse } from "next/server";
// import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import ProductModel, { Product } from "@/lib/models/Product";
import ReviewModel from "@/lib/models/Review";
import { upsertProductSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/guards";
import { slugify } from "@/lib/utils";

import { Types, FilterQuery } from "mongoose";

function productQuery(identifier: string) {
  // Tentukan tipe array sebagai FilterQuery<Product>
  const candidates: FilterQuery<Product>[] = [{ slug: identifier }];

  if (Types.ObjectId.isValid(identifier)) {
    candidates.unshift({ _id: identifier }); // ✅ sekarang type aman
  }

  return ProductModel.findOne({ $or: candidates });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  await connectToDatabase();

  const product = await productQuery(id).lean();

  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }

  const [related, reviews] = await Promise.all([
    ProductModel.find({
      category: product.category,
      _id: { $ne: product._id },
      isPublished: true,
    })
      .limit(6)
      .lean(),
    ReviewModel.find({ product: product._id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
  ]);

  const averageRating = reviews.length
    ? Number(
        (
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        ).toFixed(2),
      )
    : product.averageRating;

  return NextResponse.json({
    data: {
      ...product,
      averageRating,
      reviewCount: reviews.length || product.reviewCount,
    },
    related,
    reviews,
  });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth({ adminOnly: true });
  if (!guard.user) {
    return guard.response;
  }

  const payload = await request.json().catch(() => undefined);
  if (!payload) {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const parsed = upsertProductSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data produk tidak valid.", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const updates = parsed.data;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ message: "Tidak ada perubahan yang dikirim." }, { status: 422 });
  }

  await connectToDatabase();
  const { id } = await context.params;
  const product = await productQuery(id);

  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }

  if (updates.name && !updates.slug) {
    updates.slug = slugify(updates.name);
  }

  const slug = updates.slug ?? product.slug;
  if (slug !== product.slug) {
    const existing = await ProductModel.findOne({ slug, _id: { $ne: product._id } });
    if (existing) {
      return NextResponse.json({ message: "Slug produk sudah digunakan." }, { status: 409 });
    }
  }

  Object.assign(product, { ...updates, slug });
  await product.save();

  return NextResponse.json({
    message: "Produk berhasil diperbarui.",
    data: {
      id: product.id,
      name: product.name,
      slug: product.slug,
    },
  });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth({ adminOnly: true });
  if (!guard.user) {
    return guard.response;
  }

  await connectToDatabase();
  const { id } = await context.params;
  const product = await productQuery(id);

  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }

  product.isPublished = false;
  await product.save();

  return NextResponse.json({ message: "Produk dinonaktifkan." });
}