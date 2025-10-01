import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "../../_data/mockData";

export function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") ?? undefined;
  const data = getRecommendations(userId ?? undefined);
  return NextResponse.json({
    data,
    meta: { userId: userId ?? null },
  });
}
