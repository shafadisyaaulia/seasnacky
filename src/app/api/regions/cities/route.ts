import { NextRequest, NextResponse } from "next/server";

const cities = {
  "31": [
    { id: "3171", name: "Jakarta Selatan" },
    { id: "3172", name: "Jakarta Timur" },
    { id: "3173", name: "Jakarta Pusat" },
    { id: "3174", name: "Jakarta Barat" },
    { id: "3175", name: "Jakarta Utara" },
  ],
  "32": [
    { id: "3201", name: "Bandung" },
    { id: "3202", name: "Bekasi" },
    { id: "3203", name: "Bogor" },
    { id: "3204", name: "Depok" },
    { id: "3205", name: "Cirebon" },
  ],
  // ... add more as needed
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get("provinceId");
  const result = provinceId && cities[provinceId] ? cities[provinceId] : [];
  return NextResponse.json({ data: result });
}
