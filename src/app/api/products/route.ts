// File: src/app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import { cookies } from "next/headers"; 
import jwt from 'jsonwebtoken'; 
import slugify from 'slugify'; 

// Paksa agar API ini selalu fresh (tidak di-cache statis)
export const dynamic = "force-dynamic";

// Ambil Secret Key dari environment variable.
const JWT_SECRET_KEY = process.env.JWT_SECRET || "seasnacky_jwt"; 

// --- INTERFACE UNTUK PAYLOAD JWT ---
// Diambil dari implementasi login Anda, ID user disimpan sebagai 'sub'.
interface JwtPayload {
    id?: string;
    userId?: string; 
    _id?: string;
    sub?: string; // <--- INI KRITIS (Sesuai dengan API Login Anda)
}

// --- FUNGSI PEMBANTU: Mendapatkan User ID dari Cookie Sesi (ASYNC) ---
async function getUserIdFromSession(): Promise<string | null> {
    
    // [PERBAIKAN SINTAKS] Mengatasi error pemanggilan cookies()
    const sessionCookie = cookies().get('seasnacky_session'); 
    
    if (!sessionCookie) {
        console.error("DEBUG: Session Cookie 'seasnacky_session' TIDAK DITEMUKAN.");
        return null;
    }
    
    try {
        const decoded = jwt.verify(
            sessionCookie.value, 
            JWT_SECRET_KEY
        ) as JwtPayload; 

        // [KRITIS] Cari ID pada field 'sub' terlebih dahulu
        const finalId = decoded.sub || decoded.id || decoded.userId || decoded._id; 

        if (!finalId) {
             console.error("DEBUG: JWT payload ditemukan, tetapi tidak memiliki field ID yang valid.");
             return null;
        }

        console.log("DEBUG: Verifikasi JWT SUKSES. User ID:", finalId);
        return finalId as string;

    } catch (error) {
        console.error("DEBUG: JWT Verification GAGAL. Penyebab:", (error as Error).message);
        return null;
    }
}


// --- 1. GET: Ambil Produk (Termasuk Filter) ---
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = request.nextUrl;
        const search = searchParams.get("search");
        const category = searchParams.get("category");
        const id = searchParams.get("id");
        const sellerId = searchParams.get("sellerId"); 

        if (id) {
            const product = await Product.findById(id);
            if (!product) {
                return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
            }
            return NextResponse.json({
                ...product.toObject(),
                id: product._id.toString(),
            });
        }

        const query: any = {};

        if (sellerId) {
            query.sellerId = sellerId;
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } }, 
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (category && category !== "all") {
            query.category = category;
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        const result = products.map(p => ({
            ...p.toObject(),
            id: p._id.toString(),
        }));

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Error GET Products:", error);
        return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
    }
}


// --- 2. POST: Tambah Produk Baru (DENGAN OTORISASI SELLER AMAN) ---
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        // 1. [OTORISASI] Ambil Seller ID dari Cookie Sesi
        const sellerId = await getUserIdFromSession(); 
        
        if (!sellerId) {
            // Akan mengembalikan 401 jika JWT tidak valid atau ID tidak ditemukan (termasuk kasus 'sub' tidak terbaca)
            return NextResponse.json({ error: "Otorisasi gagal: Anda harus login" }, { status: 401 });
        }

        const seller = await User.findById(sellerId).select('role shopId'); 
        
        console.log('[DEBUG] Seller data:', {
            sellerId,
            seller: seller ? {
                id: seller._id,
                role: seller.role,
                shopId: seller.shopId
            } : null
        });
        
        if (!seller) {
            return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
        }
        
        if (seller.role !== 'seller') {
            return NextResponse.json({ error: `Akses ditolak: Role Anda adalah ${seller.role}, bukan seller` }, { status: 403 });
        }
        
        if (!seller.shopId) {
            return NextResponse.json({ error: "Akses ditolak: Toko belum disetujui atau shopId tidak ditemukan. Hubungi admin." }, { status: 403 });
        }
        
        // 2. Validasi Data Produk
        if (!body.name || !body.price || !body.description || !body.image || !body.stock) {
            return NextResponse.json({ error: "Semua field wajib diisi: Nama, Harga, Deskripsi, Gambar, dan Stok" }, { status: 400 });
        }

        // 3. [SKEMA] Buat slug dari nama produk
        const baseSlug = slugify(body.name, { lower: true, strict: true });
        
        const slugExists = await Product.findOne({ slug: baseSlug });
        const finalSlug = slugExists ? `${baseSlug}-${Date.now()}` : baseSlug;

        // 4. Pembuatan Produk (Mencocokkan field ke Model)
        const newProduct = await Product.create({
            name: body.name,
            description: body.description,
            price: Number(body.price),
            unit: body.unit || "kg", // Add unit field with default
            category: body.category || "mentah",
            
            // [SKEMA FIX] Model menggunakan countInStock
            countInStock: Number(body.stock), 
            
            // [SKEMA FIX] Model menggunakan images (Array)
            images: [body.image], 
            
            slug: finalSlug, 
            
            // [OTORISASI] Menggunakan ID yang diverifikasi dari sesi
            sellerId: sellerId, 
            shop: seller.shopId, 
        });

        return NextResponse.json(newProduct, { status: 201 });

    } catch (error: any) {
        console.error("Error Create Product:", error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ error: "Data produk tidak valid. Cek skema Mongoose Anda (kemungkinan kurang field wajib)." }, { status: 422 });
        }
        return NextResponse.json({ error: "Gagal menyimpan produk. Error internal server." }, { status: 500 });
    }
}

// --- 3. DELETE: Hapus Produk (DENGAN OTORISASI PEMILIK) ---
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = request.nextUrl;
        const id = searchParams.get("id"); 

        // 1. [OTORISASI] Ambil Seller ID dari Cookie Sesi
        const sellerId = await getUserIdFromSession(); 

        if (!sellerId) {
            return NextResponse.json({ error: "Otorisasi gagal: Anda harus login" }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ error: "ID Produk diperlukan" }, { status: 400 });
        }

        // 2. Cek kepemilikan produk
        const product = await Product.findOne({ _id: id, sellerId: sellerId });

        if (!product) {
            return NextResponse.json({ error: "Akses ditolak: Produk tidak ditemukan atau Anda bukan pemilik produk ini" }, { status: 403 });
        }

        // 3. Hapus Produk
        await Product.findByIdAndDelete(id);

        return NextResponse.json({ message: "Produk berhasil dihapus" });
    } catch (error: any) {
        console.error("Error Delete Product:", error);
        return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
    }
}