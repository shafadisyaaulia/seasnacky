import { NextResponse } from "next/server";

// Data Dummy Lokal (Pengganti mockData)
const tips = [
  {
    id: 1,
    title: "Cara Menyimpan Ikan Agar Tetap Segar",
    slug: "cara-menyimpan-ikan",
    excerpt: "Tips jitu agar ikan tahan lama di kulkas...",
    content: "Cuci bersih ikan, buang isi perut, simpan di wadah tertutup...",
    date: "2024-02-01",
    author: "Admin",
  },
  {
    id: 2,
    title: "Ciri-ciri Udang Segar",
    slug: "ciri-udang-segar",
    excerpt: "Jangan sampai salah beli, ini tandanya...",
    content: "Kulit keras, bau segar, warna bening...",
    date: "2024-02-05",
    author: "Admin",
  },
];

export async function GET() {
  return NextResponse.json({ data: tips });
}