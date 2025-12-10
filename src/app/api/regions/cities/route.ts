import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Region from "@/models/Region";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get("provinceId");

    if (!provinceId) {
      return NextResponse.json({ data: [] });
    }

    const province = await Region.findOne({ id: provinceId });

    if (!province) {
      return NextResponse.json({ data: [] });
    }

    // Return cities dengan ongkir
    const cities = province.cities.map((city: any) => ({
      id: city.id,
      name: city.name,
      shippingCost: city.shippingCost || province.baseShippingCost
    }));

    return NextResponse.json({ data: cities });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json({ data: [] });
  }
}
