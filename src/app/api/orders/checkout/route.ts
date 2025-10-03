import { NextRequest, NextResponse } from "next/server";
import { simulateCheckout } from "../../_data/mockData";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { userId, items } = payload;
  const result = simulateCheckout(userId, items);

  if (!result) {
    return NextResponse.json(
      { message: "Gagal melakukan checkout." },
      { status: 400 }
    );
  }

  return NextResponse.json(result, { status: 201 });
}