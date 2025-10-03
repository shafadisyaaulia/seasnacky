import { NextResponse } from "next/server";
import { listTips } from "../_data/mockData";

export async function GET() {
  const data = listTips();
  return NextResponse.json({ data });
}