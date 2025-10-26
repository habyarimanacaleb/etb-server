"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cohortSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    program: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
    students: [
        {
            name: { type: String },
            email: { type: String },
            phone: { type: String },
            education: { type: String },
            program: { type: String },
            experience: { type: String },
            startDate: { type: Date },
            motivation: { type: String },
            referral: { type: String },
        },
    ],
    status: {
        type: String,
        enum: ["upcoming", "active", "completed"],
        default: "upcoming",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Cohort", cohortSchema);
