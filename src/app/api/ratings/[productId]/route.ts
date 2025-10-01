import { NextRequest, NextResponse } from "next/server";
// import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
// import ProductModel from "@/lib/models/Product";
import ReviewModel from "@/lib/models/Review";

import { Types, FilterQuery } from "mongoose";
import ProductModel, { type Product } from "@/lib/models/Product";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ productId: string }> },
) {
  const { productId } = await context.params;
  await connectToDatabase();

  // Gunakan FilterQuery<Product> agar _id dan slug valid
  const candidates: FilterQuery<Product>[] = [{ slug: productId }];
  if (Types.ObjectId.isValid(productId)) {
    candidates.unshift({ _id: productId });
  }

  const product = await ProductModel.findOne({ $or: candidates }).lean();
  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }

  const reviewAggregate = await ReviewModel.aggregate([
    { $match: { product: product._id } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const aggregate = reviewAggregate[0];

  return NextResponse.json({
    productId: product._id,
    averageRating: aggregate
      ? Number(aggregate.averageRating.toFixed(2))
      : product.averageRating,
    reviewCount: aggregate ? aggregate.reviewCount : product.reviewCount,
  });
}
