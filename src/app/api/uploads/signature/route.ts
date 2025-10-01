import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/guards";
import { createUploadSignature } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const guard = await requireAuth({ adminOnly: true });
  if (!guard.user) {
    return guard.response;
  }

  const payload = await request.json().catch(() => undefined);
  const folder = payload?.folder ?? process.env.CLOUDINARY_UPLOAD_FOLDER ?? "seasnacky";
  const publicId = payload?.publicId;

  const signature = createUploadSignature({
    folder,
    publicId,
  });

  return NextResponse.json({
    message: "Signature generated.",
    data: signature,
  });
}
