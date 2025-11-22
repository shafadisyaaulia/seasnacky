// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "../../_data/mockData";
import { registerSchema } from "@/lib/validators";
import { createSessionResponse } from "@/lib/session"; // <-- 1. Impor fungsi ini

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = registerSchema.safeParse(payload);

  if (!parsed.success) {
    // In development return detailed validation info to help debugging
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { message: "Data registrasi tidak valid.", errors: parsed.error.flatten() },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { message: "Data registrasi tidak valid." },
      { status: 422 }
    );
  }

  const newUser = registerUser(parsed.data);

  if (!newUser) {
    return NextResponse.json(
      { message: "Email sudah terdaftar." },
      { status: 409 }
    );
  }

  // 2. Ganti blok return yang lama dengan ini
  // Langsung buat sesi untuk pengguna baru
  return await createSessionResponse(
    { sub: newUser.id, email: newUser.email, role: "user" },
    {
      message: "Registrasi berhasil.",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
      },
    },
    { status: 201 }
  );
}