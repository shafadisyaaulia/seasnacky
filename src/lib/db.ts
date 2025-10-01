import mongoose from "mongoose";

const globalConnection = globalThis as typeof globalThis & {
  _mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (!globalConnection._mongoose) {
    globalConnection._mongoose = { conn: null, promise: null };
  }

  const cached = globalConnection._mongoose;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);

    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
