import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "../../../_data/mockData";
import { loginSchema } from "@/lib/validators";
import { createSessionResponse } from "@/lib/session";

// Daftar email yang dianggap sebagai admin
const ADMIN_EMAILS = ["admin@seasnacky.id"];

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Email atau password tidak valid." },
      { status: 422 }
    );
  }

  const { email, password } = parsed.data;
  const user = authenticateUser(email, password);

  // 1. Periksa kredensial
  // 2. Periksa apakah email ada di dalam daftar admin
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json(
      { message: "Akses ditolak. Kredensial tidak valid atau bukan admin." },
      { status: 403 } // 403 Forbidden
    );
  }

  // Jika berhasil, buat sesi dengan token yang memiliki role 'admin'
  // Role ini hanya ada di dalam token sesi, tidak di data utama
  return await createSessionResponse(
    { sub: user.id, email: user.email, role: "admin" },
    {
      message: "Login admin berhasil.",
      data: { id: user.id, name: user.name, email: user.email },
    }
  );
}