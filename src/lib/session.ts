import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AuthTokenPayload } from "./auth";
import { createAuthToken, verifyAuthToken } from "./auth";

const COOKIE_NAME = "seasnacky_session";
const ONE_DAY = 60 * 60 * 24;

export async function createSessionResponse<T>(
  payload: AuthTokenPayload,
  body: T,
  options?: { remember?: boolean; status?: number },
) {
  const token = await createAuthToken(payload, options?.remember ? "30d" : "7d");
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
  const response = NextResponse.json({ message: "Logout berhasil." }, { status: 200 });
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    expires: new Date(0),
    path: "/",
  });
  return response;
}

// ❌ sebelumnya sinkron
// export function getSessionCookie() {
//   return cookies().get(COOKIE_NAME)?.value ?? null;
// }

// ✅ versi async
export async function getSessionCookie() {
  const cookieStore = cookies();
  return (await cookieStore).get(COOKIE_NAME)?.value ?? null;
}

// ❌ sebelumnya memanggil getSessionCookie() sinkron
// export async function getAuthUser() {
//   const token = getSessionCookie();
//   if (!token) return null;
//   try {
//     return await verifyAuthToken(token);
//   } catch {
//     return null;
//   }
// }

// ✅ versi fix
export async function getAuthUser() {
  const token = await getSessionCookie();
  if (!token) return null;

  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}
