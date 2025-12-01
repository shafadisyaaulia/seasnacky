import { clearSession } from "@/lib/session";

export async function POST() {
  return clearSession();
}