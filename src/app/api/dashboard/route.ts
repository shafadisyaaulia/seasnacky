import { NextResponse } from "next/server";
import { getDashboardSummary } from "../_data/mockData";

export async function GET() {
  const data = getDashboardSummary();
  return NextResponse.json(data);
}