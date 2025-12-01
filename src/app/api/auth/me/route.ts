import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session"; // Pastikan path ini benar

export const dynamic = "force-dynamic"; // PENTING: Agar tidak dicache (selalu cek real-time)

export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      // Jika tidak ada user login, kembalikan null (bukan error)
      return NextResponse.json({ user: null });
    }

    // Kembalikan data user yang aman (tanpa password)
    return NextResponse.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasShop: user.hasShop 
      }
    });
  } catch (error) {
    console.error("API Auth Me Error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}