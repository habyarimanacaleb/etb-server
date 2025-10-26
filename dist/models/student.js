"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    education: { type: String },
    program: { type: String },
    experience: { type: String },
    startDate: { type: Date },
    motivation: { type: String },
    role: { type: String, enum: ["guest", "student", "admin"], default: "student" },
    referral: { type: String },
    cohort: { type: mongoose_1.Schema.Types.ObjectId, ref: "Cohort" },
    password: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Student", studentSchema);
