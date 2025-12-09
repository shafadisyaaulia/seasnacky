import { NextResponse } from "next/server";

export async function GET() {
  // Data Dummy Statistik (Pengganti mockData)
  const data = {
    revenue: 15450000,
    activeUsers: 150,
    totalOrders: 45,
    pendingOrders: 5,
    productsCount: 88,
    recentActivity: []
  };

  return NextResponse.json(data);
}