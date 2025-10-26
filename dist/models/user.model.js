"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Cohort" },
    googleId: { type: String },
    role: {
        type: String,
        enum: ["student", "mentor", "admin"],
        default: "student",
    },
    avatar: { type: String },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active",
    },
    cohort: { type: mongoose_1.Schema.Types.ObjectId, ref: "Cohort" },
}, { timestamps: true });
// Hash password before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
exports.default = (0, mongoose_1.model)("User", userSchema);
