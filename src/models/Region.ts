import mongoose from "mongoose";

const CitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  shippingCost: { type: Number, default: 10000 }, // Ongkos kirim dalam Rupiah
});

const ProvinceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cities: [CitySchema],
  baseShippingCost: { type: Number, default: 15000 }, // Base ongkir untuk provinsi
  createdAt: { type: Date, default: Date.now },
});

const Region = mongoose.models.Region || mongoose.model("Region", ProvinceSchema);

export default Region;
