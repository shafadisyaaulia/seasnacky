export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import UserModel from "@/lib/models/User";
import { loginSchema } from "@/lib/validators";
import { verifyPassword } from "@/lib/auth";
import { createSessionResponse } from "@/lib/session";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => undefined);
  if (!payload) {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const parseResult = loginSchema.safeParse(payload);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: "Email atau password tidak valid.", errors: parseResult.error.flatten() },
      { status: 422 },
    );
  }

  const { email, password } = parseResult.data;

  await connectToDatabase();
  const user = await UserModel.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "Email atau password salah." }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ message: "Email atau password salah." }, { status: 401 });
  }

  user.lastLoginAt = new Date();
  await user.save();

  return createSessionResponse(
    { sub: user.id, email: user.email, role: user.role },
    {
      message: "Login berhasil.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    },
  );
}
