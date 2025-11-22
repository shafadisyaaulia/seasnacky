import { MongoClient } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient__: MongoClient | undefined;
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  // no-op when not configured
}

export function getMongoClient(): MongoClient | null {
  if (!uri) return null;
  if (global.__mongoClient__) return global.__mongoClient__ as MongoClient;
  const client = new MongoClient(uri);
  global.__mongoClient__ = client;
  return client;
}

export async function getDb(dbName = undefined) {
  const client = getMongoClient();
  if (!client) return null;
  if (!client.isConnected && typeof (client as any).connect === 'function') {
    await client.connect();
  }
  return client.db(dbName ?? undefined);
}
