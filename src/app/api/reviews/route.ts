import { NextRequest, NextResponse } from "next/server";
import { createReview, listReviews } from "../_data/mockData";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId") ?? undefined;
  const reviews = listReviews(productId);
  return NextResponse.json({ data: reviews });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const newReview = createReview(payload);

  if (!newReview) {
    return NextResponse.json(
      { message: "Gagal membuat ulasan." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      message: "Ulasan berhasil dibuat.",
      data: newReview,
    },
    { status: 201 }
  );
}