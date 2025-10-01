import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Marine Snack Marketplace API",
    timestamp: new Date().toISOString(),
  });
}
