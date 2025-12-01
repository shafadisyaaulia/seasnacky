import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  level: { type: String, enum: ["info", "warning", "error"], required: true },
  message: { type: String, required: true },
  source: { type: String }, 
  timestamp: { type: Date, default: Date.now },
});

// PERBAIKAN DISINI:
const Log = mongoose.models.Log || mongoose.model("Log", LogSchema);

export default Log;