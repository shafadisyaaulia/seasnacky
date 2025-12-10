import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Region from "@/models/Region";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    
    const provinces = await Region.find({}, { id: 1, name: 1, _id: 0 }).sort({ name: 1 });
    
    return NextResponse.json({ data: provinces });
  } catch (error) {
    console.error("Error fetching provinces:", error);
    
    // Fallback data jika MongoDB error
    const fallbackProvinces = [
      { id: "11", name: "Aceh" },
      { id: "31", name: "DKI Jakarta" },
      { id: "32", name: "Jawa Barat" },
      { id: "33", name: "Jawa Tengah" },
      { id: "34", name: "DI Yogyakarta" },
      { id: "35", name: "Jawa Timur" },
    ];
    
    return NextResponse.json({ data: fallbackProvinces });
  }
}
