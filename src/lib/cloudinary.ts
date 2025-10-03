// import { v2 as cloudinary } from "cloudinary";

// let configured = false;

// function ensureConfig() {
//   if (configured) return;

//   if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//     throw new Error("Cloudinary environment variables are not set.");
//   }

//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     secure: true,
//   });
//   configured = true;
// }

// export function getCloudinary() {
//   ensureConfig();
//   return cloudinary;
// }

// export function createUploadSignature({
//   folder,
//   publicId,
//   timestamp = Math.round(Date.now() / 1000),
// }: {
//   folder: string;
//   publicId?: string;
//   timestamp?: number;
// }) {
//   ensureConfig();

//   const params: Record<string, string | number> = {
//     folder,
//     timestamp,
//   };

//   if (publicId) {
//     params.public_id = publicId;
//   }

//   const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);

//   return {
//     apiKey: process.env.CLOUDINARY_API_KEY!,
//     cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
//     folder,
//     timestamp,
//     signature,
//     publicId,
//   };
// }

// export function buildSecureUrl(publicId: string, transformations = "f_auto,q_auto") {
//   ensureConfig();
//   return cloudinary.url(publicId, {
//     secure: true,
//     transformation: transformations,
//   });
// }

