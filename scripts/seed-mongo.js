const { MongoClient } = require('mongodb');
const mock = require('./mockDataForSeed');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Please set MONGODB_URI environment variable');
    process.exit(1);
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  console.log('Clearing collections...');
  await Promise.all([
    db.collection('users').deleteMany({}).catch(() => {}),
    db.collection('stores').deleteMany({}).catch(() => {}),
    db.collection('products').deleteMany({}).catch(() => {}),
    db.collection('reviews').deleteMany({}).catch(() => {}),
  ]);

  console.log('Inserting users...');
  await db.collection('users').insertMany(mock.users.map(u => ({...u, createdAt: new Date()})));

  console.log('Inserting stores...');
  await db.collection('stores').insertMany(mock.stores);

  console.log('Inserting products...');
  const products = mock.listProducts();
  // map products to include store assignment
  const stores = mock.stores;
  const docs = products.map((p, idx) => ({
    ...p,
    price: Number(p.price),
    storeId: stores[idx % stores.length].id,
    createdAt: new Date(),
  }));
  await db.collection('products').insertMany(docs);

  console.log('Inserting reviews...');
  await db.collection('reviews').insertMany(mock.listReviews());

  console.log('Seeding complete.');
  await client.close();
}

main().catch(err => { console.error(err); process.exit(1); });
