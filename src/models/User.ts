import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
  hasShop: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// PERBAIKAN DISINI:
// Kita tampung dulu di variabel 'User', baru di-export
// Ini mencegah error "default.find is not a function"
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;