import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IOTP extends Document {
  email: string;
  otp: string;
  name: string;
  password: string;
  role: string;
  expiresAt: Date;
  attempts: number;
}

const otpSchema = new Schema<IOTP>(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true }, // will hash before creating final User
    role: { type: String, default: "user" },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash OTP before saving
otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
  next();
});

// Automatically remove expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<IOTP>("OTP", otpSchema);
