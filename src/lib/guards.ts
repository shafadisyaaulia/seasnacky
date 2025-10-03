import { NextResponse } from "next/server";
import { getAuthUser } from "./session";

export async function requireAuth(options?: { adminOnly?: boolean }) {
  const user = await getAuthUser();
  if (!user) {
    return {
      response: NextResponse.json(
        { message: "Sesi tidak valid." },
        { status: 401 }
      ),
      user: null,
    } as const;
  }

  if (options?.adminOnly) {
    return {
      response: NextResponse.json(
        { message: "Akses hanya untuk admin." },
        { status: 403 }
      ),
      user: null,
    } as const;
  }

  return { user } as const;
}