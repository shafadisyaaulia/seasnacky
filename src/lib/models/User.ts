import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    address: { type: String, default: "" },
    avatarUrl: { type: String },
    loyaltyPoints: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 }, { unique: true });

export type User = InferSchemaType<typeof UserSchema>;
export type UserModel = Model<User>;

export default (models.User as UserModel) || model<User>("User", UserSchema);
