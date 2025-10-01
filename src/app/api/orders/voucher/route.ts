import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    data: {
      voucherCode: "FROZEN15",
      description: "Diskon 15% untuk pembelian kedua produk beku.",
      minimumPurchase: 150000,
      validUntil: "2025-10-30",
    },
  });
}
