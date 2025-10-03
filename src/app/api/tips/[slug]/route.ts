import { NextRequest, NextResponse } from "next/server";
import { listTips } from "../../_data/mockData";

export async function GET(
  _request: NextRequest,
  context: { params: { slug: string } }
) {
  const { slug } = context.params;
  const tips = listTips();
  const tip = tips.find((p) => p.id === slug);

  if (!tip) {
    return NextResponse.json(
      { message: "Tips tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: tip });
}