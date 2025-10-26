"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["ongoing", "completed", "opened"], default: "opened" },
    tools: [{ type: String }],
}, { timestamps: true });
// Optimize query performance
projectSchema.index({ title: 1 });
exports.default = (0, mongoose_1.model)("Project", projectSchema);
