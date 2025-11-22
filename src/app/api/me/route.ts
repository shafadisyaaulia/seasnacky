import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session";

export async function GET() {
  try {
    const verified = await getAuthUser();
    if (!verified) return NextResponse.json({ data: null });
    const mock = await import("@/app/api/_data/mockData");
    // verified.sub holds user id
    const user = (mock as any).users?.find((u: any) => u.id === verified.sub) ?? null;
    if (!user) return NextResponse.json({ data: null });
    const { password, ...safe } = user;
    return NextResponse.json({ data: safe });
  } catch (err) {
    return NextResponse.json({ data: null });
  }
}
