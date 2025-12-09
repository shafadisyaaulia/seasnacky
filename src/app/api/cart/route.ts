import { NextRequest, NextResponse } from "next/server";

// GET: Ambil isi keranjang (Dummy: Kosong dulu)
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    data: [], // Array kosong agar frontend tidak error
    meta: { total: 0 }
  });
}

// POST: Tambah ke keranjang (Dummy: Selalu sukses)
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { userId, productId, quantity } = payload;

    // Simulasi sukses tambah ke keranjang
    return NextResponse.json({ 
      message: "Berhasil ditambahkan ke keranjang (Mode Dummy)",
      item: { userId, productId, quantity }
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menambahkan ke keranjang." },
      { status: 400 }
    );
  }
}