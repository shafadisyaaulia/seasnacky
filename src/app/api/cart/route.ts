import { NextRequest, NextResponse } from "next/server";
import { appendCartItem } from "../_data/mockData";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { userId, productId, quantity } = payload;
  const result = appendCartItem(userId, productId, quantity);

  if (!result) {
    return NextResponse.json(
      { message: "Gagal menambahkan ke keranjang." },
      { status: 400 }
    );
  }

  return NextResponse.json(result);
}