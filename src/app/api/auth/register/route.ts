import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import UserModel from "@/lib/models/User";
import { createSessionResponse } from "@/lib/session";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => undefined);
  if (!payload) {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const parseResult = registerSchema.safeParse(payload);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: "Data registrasi tidak valid.", errors: parseResult.error.flatten() },
      { status: 422 },
    );
  }

  const { name, email, password, address } = parseResult.data;

  await connectToDatabase();

  const existingUser = await UserModel.findOne({ email }).lean();
  if (existingUser) {
    return NextResponse.json({ message: "Email sudah terdaftar." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await UserModel.create({
    name,
    email,
    passwordHash,
    address,
  });

  return createSessionResponse(
    { sub: user.id, email: user.email, role: user.role },
    {
      message: "Registrasi berhasil.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    },
    { status: 201 },
  );
}
