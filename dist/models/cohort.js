"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cohortSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    program: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    students: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Student" }],
    description: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Cohort", cohortSchema);
