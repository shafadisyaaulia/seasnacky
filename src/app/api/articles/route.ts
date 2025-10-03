import { NextResponse } from "next/server";
import { listArticles } from "../_data/mockData";

export async function GET() {
  const data = listArticles();
  return NextResponse.json({ data });
}