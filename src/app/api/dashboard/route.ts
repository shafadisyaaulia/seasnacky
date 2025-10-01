import { NextResponse } from "next/server";
import { getDashboardSnapshot } from "@/lib/services/dashboard";

export async function GET() {
  const data = await getDashboardSnapshot();
  return NextResponse.json(data);
}
