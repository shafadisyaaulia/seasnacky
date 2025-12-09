import { NextResponse } from "next/server";

// Data Dummy Lokal (Pengganti mockData)
const articles = [
  {
    id: 1,
    title: "Cara Memilih Ikan Segar",
    slug: "cara-memilih-ikan-segar",
    content: "Tips memilih ikan segar di pasar...",
    date: "2024-01-10",
  },
  {
    id: 2,
    title: "Manfaat Omega-3",
    slug: "manfaat-omega-3",
    content: "Omega-3 sangat baik untuk kesehatan otak...",
    date: "2024-01-12",
  },
];

export async function GET() {
  return NextResponse.json({ data: articles });
}