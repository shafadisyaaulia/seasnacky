import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

export async function POST() {
  return clearSession();
}

export function GET() {
  return NextResponse.json({ message: "Gunakan metode POST untuk logout." }, { status: 405 });
}
