import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import ReviewModel from "@/lib/models/Review";
import OrderModel from "@/lib/models/Order";
import { createReviewSchema } from "@/lib/validators";
import { getAuthUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const productParam = request.nextUrl.searchParams.get("productId");
  const userParam = request.nextUrl.searchParams.get("userId");

  const filter: Record<string, unknown> = {};

  if (productParam) {
    if (Types.ObjectId.isValid(productParam)) {
      filter.product = productParam;
    } else {
      const product = await ProductModel.findOne({ slug: productParam }).select("_id");
      if (!product) {
        return NextResponse.json({ data: [], filters: { productId: productParam, userId: userParam } });
      }
      filter.product = product._id;
    }
  }

  if (userParam) {
    filter.user = userParam;
  }

  const reviews = await ReviewModel.find(filter)
    .populate("user", "name role")
    .populate("product", "name slug")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return NextResponse.json({
    data: reviews,
    filters: { productId: productParam ?? null, userId: userParam ?? null },
  });
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => undefined);
  if (!payload) {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const parseResult = createReviewSchema.safeParse(payload);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: "Data ulasan tidak valid.", errors: parseResult.error.flatten() },
      { status: 422 },
    );
  }

  const { productId, orderId, rating, comment } = parseResult.data;

  await connectToDatabase();

  const product = await ProductModel.findOne(
    Types.ObjectId.isValid(productId)
      ? { _id: productId }
      : { slug: productId },
  );

  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }

  const existingReview = await ReviewModel.findOne({
    product: product._id,
    user: authUser.sub,
  });

  if (existingReview) {
    return NextResponse.json({ message: "Anda sudah memberikan ulasan untuk produk ini." }, { status: 409 });
  }

  const orderFilter: Record<string, unknown> = {
    user: authUser.sub,
    "items.product": product._id,
  };

  if (orderId) {
    orderFilter._id = orderId;
  }

  const order = await OrderModel.findOne(orderFilter).lean();
  if (!order) {
    return NextResponse.json(
      { message: "Ulasan hanya dapat dibuat setelah melakukan pembelian." },
      { status: 403 },
    );
  }

  const review = await ReviewModel.create({
    product: product._id,
    user: authUser.sub,
    order: order._id,
    rating,
    comment,
    isVerifiedPurchase: true,
  });

  const stats = await ReviewModel.aggregate([
    { $match: { product: product._id } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats[0]) {
    await ProductModel.findByIdAndUpdate(product._id, {
      averageRating: Number(stats[0].averageRating.toFixed(2)),
      reviewCount: stats[0].reviewCount,
    });
  }

  return NextResponse.json(
    {
      message: "Review tersimpan.",
      data: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      },
    },
    { status: 201 },
  );
}
