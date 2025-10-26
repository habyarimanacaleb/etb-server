"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const otpSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true }, // will hash before creating final User
    role: { type: String, default: "user" },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
}, { timestamps: true });
// Hash OTP before saving
otpSchema.pre("save", async function (next) {
    if (!this.isModified("otp"))
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.otp = await bcryptjs_1.default.hash(this.otp, salt);
    next();
});
// Automatically remove expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.default = (0, mongoose_1.model)("OTP", otpSchema);
