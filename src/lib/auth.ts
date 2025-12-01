import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import bcrypt from "bcryptjs"; // Pakai ini buat cek password asli

const encoder = new TextEncoder();

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable.");
  }
  return encoder.encode(secret);
}

// UPDATE: Cek password menggunakan bcrypt (bukan string biasa)
export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

// UPDATE: Tambahkan 'hasShop' di payload token biar frontend tau status toko
export interface AuthTokenPayload extends JWTPayload {
  sub: string;
  email: string;
  role: "buyer" | "seller" | "admin"; // Sesuaikan dengan enum di User Model
  hasShop?: boolean;
}

export async function createAuthToken(
  payload: AuthTokenPayload,
  expiresIn: string | number = "7d"
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify<AuthTokenPayload>(token, getSecret());
  return payload;
}

export function parseAuthHeader(header?: string | null) {
  if (!header) return null;
  const [scheme, value] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !value) {
    return null;
  }
  return value;
}