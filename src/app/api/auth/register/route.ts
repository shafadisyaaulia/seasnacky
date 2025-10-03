import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "../../_data/mockData";
import { registerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = registerSchema.safeParse(payload);

  if (!parsed.success) {
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

  return NextResponse.json(
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