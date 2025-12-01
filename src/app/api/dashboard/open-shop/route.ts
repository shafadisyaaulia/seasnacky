import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session";
import { getDb } from "@/lib/mongodb";

  try {
    const session = await getAuthUser();
    if (!session?.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = session.sub;
    const { name, city, address, description } = await request.json();

    const db = await getDb();
    if (!db) throw new Error("MongoDB not available");

    // Cek apakah user sudah punya toko
    const existingStore = await db.collection("stores").findOne({ userId });
    if (existingStore) {
      return NextResponse.json({ message: "Anda sudah memiliki toko." }, { status: 400 });
    }

    // Update role user menjadi SELLER
    await db.collection("users").updateOne({ _id: userId }, { $set: { role: "SELLER" } });

    // Buat data toko baru dan relasikan ke user
    const storeData = {
      name,
      city,
      address,
      description,
      userId,
      createdAt: new Date(),
    };
    const result = await db.collection("stores").insertOne(storeData);
    const store = await db.collection("stores").findOne({ _id: result.insertedId });

    return NextResponse.json({ message: "Toko berhasil dibuat.", data: store }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
