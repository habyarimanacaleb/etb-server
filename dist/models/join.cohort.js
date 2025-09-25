"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cohortSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String },
    program: { type: String, required: true },
    motivation: { type: String, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Cohort", cohortSchema);
