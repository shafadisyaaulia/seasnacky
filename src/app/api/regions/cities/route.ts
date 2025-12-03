import { NextRequest, NextResponse } from "next/server";

const cities: Record<string, Array<{id: string, name: string}>> = {
  "11": [
    { id: "1101", name: "Banda Aceh" },
    { id: "1102", name: "Sabang" },
    { id: "1103", name: "Aceh Besar" },
    { id: "1104", name: "Aceh Barat" },
    { id: "1105", name: "Aceh Selatan" },
    { id: "1106", name: "Aceh Timur" },
    { id: "1107", name: "Aceh Utara" },
  ],
  "12": [
    { id: "1201", name: "Medan" },
    { id: "1202", name: "Binjai" },
    { id: "1203", name: "Pematang Siantar" },
    { id: "1204", name: "Tebing Tinggi" },
    { id: "1205", name: "Deli Serdang" },
  ],
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
  "33": [
    { id: "3301", name: "Semarang" },
    { id: "3302", name: "Surakarta" },
    { id: "3303", name: "Magelang" },
    { id: "3304", name: "Salatiga" },
    { id: "3305", name: "Tegal" },
  ],
  "35": [
    { id: "3501", name: "Surabaya" },
    { id: "3502", name: "Malang" },
    { id: "3503", name: "Kediri" },
    { id: "3504", name: "Blitar" },
    { id: "3505", name: "Mojokerto" },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get("provinceId");
  const result = provinceId && cities[provinceId] ? cities[provinceId] : [];
  return NextResponse.json({ data: result });
}
