"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const programSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String },
    mentor: { type: mongoose_1.Schema.Types.ObjectId, ref: "Mentor" },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Program", programSchema);
