// src/app/api/checkdb/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // Path ke fungsi koneksi Anda
import mongoose from 'mongoose';

/**
 * Endpoint GET: Menguji koneksi database secara langsung
 */
export async function GET() {
    try {
        await connectDB();
        
        // Pastikan koneksi Mongoose statusnya 'open' atau 'connected'
        if (mongoose.connection.readyState === 1) {
            return NextResponse.json({ 
                message: 'Database Connected Successfully!',
                dbName: mongoose.connection.name
            }, { status: 200 });
        } else {
             throw new Error("Koneksi gagal atau status tidak siap.");
        }

    } catch (error: any) {
        console.error('DATABASE CHECK FAILED:', error);
        return NextResponse.json({ 
            message: 'Database Connection Failed', 
            details: error.message || 'Check your MONGODB_URI in .env' 
        }, { status: 500 });
    }
}