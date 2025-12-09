import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Ambil parameter userId dari URL kalau ada
  const userId = request.nextUrl.searchParams.get("userId") ?? undefined;

  // Data Order Dummy (Agar halaman pesanan tidak crash)
  const dummyOrders: any[] = []; 

  return NextResponse.json({
    data: dummyOrders,
    meta: {
      total: dummyOrders.length,
    },
  });
}

// Tambahkan handler POST biar lengkap (jika user checkout)
export async function POST(request: NextRequest) {
    return NextResponse.json({ 
        message: "Order berhasil dibuat (Dummy)",
        orderId: "ORD-DUMMY-123"
    }, { status: 201 });
}