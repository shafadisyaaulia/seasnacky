import { NextRequest, NextResponse } from "next/server";
import { listArticles } from "../../_data/mockData";

export async function GET(
  _request: NextRequest,
  context: { params: { slug: string } }
) {
  const { slug } = context.params;
  const articles = listArticles();
  const article = articles.find((p) => p.id === slug);

  if (!article) {
    return NextResponse.json(
      { message: "Artikel tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: article });
}