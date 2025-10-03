import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AuthTokenPayload } from "./auth";
import { createAuthToken, verifyAuthToken } from "./auth";
import { users } from "@/app/api/_data/mockData"; // Impor mock data

const COOKIE_NAME = "seasnacky_session";
const ONE_DAY = 60 * 60 * 24;

export async function createSessionResponse<T>(
  payload: AuthTokenPayload,
  body: T,
  options?: { remember?: boolean; status?: number }
) {
  const token = await createAuthToken(
    payload,
    options?.remember ? "30d" : "7d"
  );
  const response = NextResponse.json(body, { status: options?.status ?? 200 });
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: options?.remember ? ONE_DAY * 30 : ONE_DAY * 7,
    path: "/",
  });
  return response;
}

export function clearSession() {
  const response = NextResponse.json(
    { message: "Logout berhasil." },
    { status: 200 }
  );
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    expires: new Date(0),
    path: "/",
  });
  return response;
}

export async function getSessionCookie() {
  const cookieStore = cookies();
  return (await cookieStore).get(COOKIE_NAME)?.value ?? null;
}

export async function getAuthUser() {
  const token = await getSessionCookie();
  if (!token) return null;

  try {
    const verified = await verifyAuthToken(token);
    // Verifikasi user dari mock data
    const user = users.find((u) => u.id === verified.sub);
    return user ? verified : null;
  } catch {
    return null;
  }
}