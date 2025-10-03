import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "../../_data/mockData";
import { loginSchema } from "@/lib/validators";

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

  if (!user) {
    return NextResponse.json(
      { message: "Email atau password salah." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Login berhasil.",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
    },
  });
}