import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Log from "@/models/Log";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // Auth check - only admin
    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level"); // info, warning, error, all
    const limit = parseInt(searchParams.get("limit") || "100");

    await connectDB();

    // Build query
    const query: any = {};
    if (level && level !== "all") {
      query.level = level;
    }

    // Fetch logs
    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: logs,
      count: logs.length,
    });
  } catch (error: any) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create log manually (for testing)
export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { level, message, source } = body;

    if (!level || !message) {
      return NextResponse.json(
        { error: "Level and message are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const log = await Log.create({
      level,
      message,
      source: source || "manual",
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: log,
    });
  } catch (error: any) {
    console.error("Error creating log:", error);
    return NextResponse.json(
      { error: "Failed to create log", details: error.message },
      { status: 500 }
    );
  }
}
