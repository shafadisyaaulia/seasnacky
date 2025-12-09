import { NextResponse } from "next/server";

const tips = [
  {
    id: 1,
    title: "Cara Menyimpan Ikan Agar Tetap Segar",
    slug: "cara-menyimpan-ikan",
    content: "Cuci bersih ikan, buang isi perut, simpan di wadah tertutup...",
    date: "2024-02-01",
    author: "Admin",
  },
  {
    id: 2,
    title: "Ciri-ciri Udang Segar",
    slug: "ciri-udang-segar",
    content: "Kulit keras, bau segar, warna bening...",
    date: "2024-02-05",
    author: "Admin",
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Next.js 15 wajib await params
  
  const tip = tips.find((t) => t.slug === slug);

  if (!tip) {
    return NextResponse.json({ error: "Tips tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data: tip });
}