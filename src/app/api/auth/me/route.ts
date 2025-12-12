// File: seasnacky/src/app/api/auth/me/route.ts

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session"; 
// getAuthUser() di session.ts Anda sudah benar: membaca cookie, memverifikasi, dan mencari DB.

export const dynamic = "force-dynamic"; 

export async function GET() {
    try {
        const userPayload = await getAuthUser(); // Ini mengembalikan Payload + Data DB

        // Cek jika payload kosong atau tidak memiliki ID (sub)
        if (!userPayload || !userPayload.sub) { 
            // Tambahan log di server untuk debugging
            console.log("Auth/Me: Session invalid or not found."); 
            return NextResponse.json({ user: null });
        }

        // Karena getAuthUser di session.ts Anda sudah mencari ke DB 
        // dan mengembalikan data yang lengkap (name, role, hasShop, sub),
        // kita hanya perlu merapikan formatnya untuk frontend.

        return NextResponse.json({ 
            user: {
                // KRITIS: Mengganti 'sub' (dari payload) menjadi 'id' (yang diharapkan frontend)
                id: userPayload.sub, 
                name: userPayload.name, 
                email: userPayload.email,
                role: userPayload.role,
                hasShop: userPayload.hasShop || false, 
                // Catatan: Jika Anda menyimpan shopId di user model, pastikan Anda menambahkannya juga
                // shopId: userPayload.shopId || null
            }
        });
    } catch (error) {
        console.error("API Auth Me Error:", error);
        // Penting: Walaupun error server, tetap kembalikan user: null agar frontend tidak crash.
        return NextResponse.json({ user: null }, { status: 500 }); 
    }
}