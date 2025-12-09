import { NextResponse } from "next/server";

export async function GET() {
  // Return array kosong biar frontend tidak crash
  return NextResponse.json({ 
    data: [],
    meta: { total: 0 }
  });
}

export async function POST() {
  return NextResponse.json({ message: "Review berhasil dikirim (Dummy)" });
}