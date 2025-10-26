"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const programSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    skills: [{ type: String }], // e.g. ["React", "Node.js", "MongoDB"]
    projects: [{ type: String }], // e.g. ["E-commerce Platform"]
    outcomes: [{ type: String }], // e.g. ["Professional Portfolio Site"]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Program", programSchema);
