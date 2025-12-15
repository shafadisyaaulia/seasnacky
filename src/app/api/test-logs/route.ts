// Test endpoint untuk membuat log
import { NextResponse } from "next/server";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Create test logs
    logger.info(`Test log INFO - Dibuat pada ${timestamp}`, {
      source: "Test Endpoint",
    });

    logger.warn(`Test log WARNING - Dibuat pada ${timestamp}`, {
      source: "Test Endpoint",
    });

    logger.error(`Test log ERROR - Dibuat pada ${timestamp}`, {
      source: "Test Endpoint",
    });

    return NextResponse.json({
      success: true,
      message: "Test logs created successfully",
      timestamp: timestamp,
      hint: "Refresh halaman /dashboard/admin/logs untuk melihat log baru"
    });
  } catch (error: any) {
    console.error("Test log error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
