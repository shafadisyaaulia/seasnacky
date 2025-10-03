// src/lib/db.ts

import mongoose from "mongoose";

// Cek variabel lingkungan di awal
if (!process.env.MONGODB_URI) {
  throw new Error("Silakan tambahkan MONGODB_URI ke file .env.local Anda");
}

const MONGODB_URI = process.env.MONGODB_URI;

const globalConnection = globalThis as typeof globalThis & {
  _mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

export async function connectToDatabase() {
  if (!globalConnection._mongoose) {
    globalConnection._mongoose = { conn: null, promise: null };
  }

  const cached = globalConnection._mongoose;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(MONGODB_URI, {
      autoIndex: true,
    }).then(mongoose => {
      console.log("MongoDB terhubung!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}