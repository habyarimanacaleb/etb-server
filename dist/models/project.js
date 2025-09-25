"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    tools: { type: [String] }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Project", projectSchema);
