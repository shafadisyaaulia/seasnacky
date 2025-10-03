import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "../../_data/mockData";

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const product = getProductById(id);

  if (!product) {
    return NextResponse.json(
      { message: "Produk tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: product });
}