// File: src/app/api/log-access/route.ts
// API untuk logging unauthorized access dari client-side

import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, role, attemptedPath, reason } = body;

    logger.warning(`Unauthorized access attempt: ${reason}`, {
      source: "access-control",
      userId,
      email,
      role,
      attemptedPath,
      reason
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error logging access attempt:", error);
    return NextResponse.json({ error: "Failed to log" }, { status: 500 });
  }
}
