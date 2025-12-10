// Script untuk seed data wilayah ke MongoDB
// Jalankan dengan: node scripts/seed-regions.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI tidak ditemukan di .env.local');
  process.exit(1);
}

const ProvinceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cities: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    shippingCost: { type: Number, default: 10000 },
  }],
  baseShippingCost: { type: Number, default: 15000 },
  createdAt: { type: Date, default: Date.now },
});

const Region = mongoose.models.Region || mongoose.model("Region", ProvinceSchema);

const regionsData = [
  {
    id: "11",
    name: "Aceh",
    baseShippingCost: 50000,
    cities: [
      { id: "1101", name: "Banda Aceh", shippingCost: 45000 },
      { id: "1102", name: "Sabang", shippingCost: 55000 },
      { id: "1103", name: "Lhokseumawe", shippingCost: 50000 },
      { id: "1104", name: "Langsa", shippingCost: 52000 },
      { id: "1105", name: "Aceh Besar", shippingCost: 48000 },
      { id: "1106", name: "Aceh Barat", shippingCost: 53000 },
      { id: "1107", name: "Aceh Selatan", shippingCost: 55000 },
      { id: "1108", name: "Aceh Timur", shippingCost: 54000 },
    ]
  },
  {
    id: "12",
    name: "Sumatera Utara",
    baseShippingCost: 35000,
    cities: [
      { id: "1201", name: "Medan", shippingCost: 30000 },
      { id: "1202", name: "Binjai", shippingCost: 32000 },
      { id: "1203", name: "Pematangsiantar", shippingCost: 35000 },
      { id: "1204", name: "Tebing Tinggi", shippingCost: 33000 },
      { id: "1205", name: "Tanjungbalai", shippingCost: 34000 },
      { id: "1206", name: "Deli Serdang", shippingCost: 31000 },
      { id: "1207", name: "Langkat", shippingCost: 36000 },
      { id: "1208", name: "Karo", shippingCost: 38000 },
    ]
  },
  {
    id: "13",
    name: "Sumatera Barat",
    baseShippingCost: 40000,
    cities: [
      { id: "1301", name: "Padang", shippingCost: 38000 },
      { id: "1302", name: "Bukittinggi", shippingCost: 40000 },
      { id: "1303", name: "Payakumbuh", shippingCost: 41000 },
      { id: "1304", name: "Padang Panjang", shippingCost: 40000 },
      { id: "1305", name: "Solok", shippingCost: 42000 },
      { id: "1306", name: "Agam", shippingCost: 41000 },
      { id: "1307", name: "Tanah Datar", shippingCost: 40000 },
    ]
  },
  {
    id: "31",
    name: "DKI Jakarta",
    baseShippingCost: 15000,
    cities: [
      { id: "3171", name: "Jakarta Selatan", shippingCost: 15000 },
      { id: "3172", name: "Jakarta Timur", shippingCost: 15000 },
      { id: "3173", name: "Jakarta Pusat", shippingCost: 12000 },
      { id: "3174", name: "Jakarta Barat", shippingCost: 15000 },
      { id: "3175", name: "Jakarta Utara", shippingCost: 18000 },
      { id: "3176", name: "Kepulauan Seribu", shippingCost: 50000 },
    ]
  },
  {
    id: "32",
    name: "Jawa Barat",
    baseShippingCost: 20000,
    cities: [
      { id: "3201", name: "Bandung", shippingCost: 18000 },
      { id: "3202", name: "Bekasi", shippingCost: 16000 },
      { id: "3203", name: "Bogor", shippingCost: 17000 },
      { id: "3204", name: "Depok", shippingCost: 15000 },
      { id: "3205", name: "Cirebon", shippingCost: 25000 },
      { id: "3206", name: "Sukabumi", shippingCost: 22000 },
      { id: "3207", name: "Tasikmalaya", shippingCost: 24000 },
      { id: "3208", name: "Cimahi", shippingCost: 18000 },
      { id: "3209", name: "Banjar", shippingCost: 23000 },
      { id: "3210", name: "Bandung Barat", shippingCost: 19000 },
      { id: "3211", name: "Karawang", shippingCost: 20000 },
      { id: "3212", name: "Purwakarta", shippingCost: 21000 },
      { id: "3213", name: "Subang", shippingCost: 22000 },
    ]
  },
  {
    id: "33",
    name: "Jawa Tengah",
    baseShippingCost: 25000,
    cities: [
      { id: "3301", name: "Semarang", shippingCost: 22000 },
      { id: "3302", name: "Surakarta", shippingCost: 24000 },
      { id: "3303", name: "Magelang", shippingCost: 25000 },
      { id: "3304", name: "Salatiga", shippingCost: 24000 },
      { id: "3305", name: "Pekalongan", shippingCost: 26000 },
      { id: "3306", name: "Tegal", shippingCost: 28000 },
      { id: "3307", name: "Kudus", shippingCost: 23000 },
      { id: "3308", name: "Cilacap", shippingCost: 30000 },
      { id: "3309", name: "Banyumas", shippingCost: 28000 },
      { id: "3310", name: "Purbalingga", shippingCost: 29000 },
      { id: "3311", name: "Kebumen", shippingCost: 30000 },
    ]
  },
  {
    id: "34",
    name: "DI Yogyakarta",
    baseShippingCost: 23000,
    cities: [
      { id: "3401", name: "Yogyakarta", shippingCost: 22000 },
      { id: "3402", name: "Sleman", shippingCost: 22000 },
      { id: "3403", name: "Bantul", shippingCost: 23000 },
      { id: "3404", name: "Kulon Progo", shippingCost: 25000 },
      { id: "3405", name: "Gunung Kidul", shippingCost: 26000 },
    ]
  },
  {
    id: "35",
    name: "Jawa Timur",
    baseShippingCost: 28000,
    cities: [
      { id: "3501", name: "Surabaya", shippingCost: 25000 },
      { id: "3502", name: "Malang", shippingCost: 27000 },
      { id: "3503", name: "Kediri", shippingCost: 28000 },
      { id: "3504", name: "Blitar", shippingCost: 29000 },
      { id: "3505", name: "Mojokerto", shippingCost: 26000 },
      { id: "3506", name: "Madiun", shippingCost: 30000 },
      { id: "3507", name: "Pasuruan", shippingCost: 27000 },
      { id: "3508", name: "Probolinggo", shippingCost: 28000 },
      { id: "3509", name: "Banyuwangi", shippingCost: 35000 },
      { id: "3510", name: "Jember", shippingCost: 32000 },
      { id: "3511", name: "Sidoarjo", shippingCost: 25000 },
      { id: "3512", name: "Gresik", shippingCost: 26000 },
    ]
  },
  {
    id: "36",
    name: "Banten",
    baseShippingCost: 18000,
    cities: [
      { id: "3601", name: "Serang", shippingCost: 20000 },
      { id: "3602", name: "Tangerang", shippingCost: 15000 },
      { id: "3603", name: "Tangerang Selatan", shippingCost: 14000 },
      { id: "3604", name: "Cilegon", shippingCost: 22000 },
      { id: "3605", name: "Lebak", shippingCost: 25000 },
      { id: "3606", name: "Pandeglang", shippingCost: 27000 },
    ]
  },
  {
    id: "51",
    name: "Bali",
    baseShippingCost: 35000,
    cities: [
      { id: "5101", name: "Denpasar", shippingCost: 32000 },
      { id: "5102", name: "Badung", shippingCost: 33000 },
      { id: "5103", name: "Gianyar", shippingCost: 34000 },
      { id: "5104", name: "Tabanan", shippingCost: 35000 },
      { id: "5105", name: "Buleleng", shippingCost: 38000 },
      { id: "5106", name: "Jembrana", shippingCost: 40000 },
      { id: "5107", name: "Karangasem", shippingCost: 37000 },
      { id: "5108", name: "Klungkung", shippingCost: 35000 },
    ]
  },
];

async function seedRegions() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Region.deleteMany({});
    console.log('Cleared existing region data');

    // Insert new data
    await Region.insertMany(regionsData);
    console.log(`Successfully seeded ${regionsData.length} provinces with cities`);

    const count = await Region.countDocuments();
    console.log(`Total provinces in database: ${count}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding regions:', error);
    process.exit(1);
  }
}

seedRegions();
