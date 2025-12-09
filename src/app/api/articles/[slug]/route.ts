import { NextResponse } from "next/server";

const articles = [
  {
    id: 1,
    title: "Cara Memilih Ikan Segar",
    slug: "cara-memilih-ikan-segar",
    content: "Ini adalah konten lengkap tentang cara memilih ikan...",
    date: "2024-01-10",
  },
  {
    id: 2,
    title: "Manfaat Omega-3",
    slug: "manfaat-omega-3",
    content: "Penjelasan lengkap manfaat omega-3...",
    date: "2024-01-12",
  },
];

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Await params karena di Next.js 15 params itu Promise
  const { slug } = await params; 
  
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data: article });
}