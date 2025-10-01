import { NextResponse } from "next/server";
import { getTopProducts } from "../../_data/mockData";

export function GET() {
  const data = getTopProducts();
  return NextResponse.json({ data });
}
