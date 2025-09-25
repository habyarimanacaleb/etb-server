"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollStudent = exports.getCohortDetails = exports.getAllCohorts = exports.createCohort = void 0;
const cohort_1 = __importDefault(require("../models/cohort"));
// Create a new cohort (admin only)
const createCohort = async (req, res) => {
    try {
        const cohort = await cohort_1.default.create(req.body);
        res.status(201).json({ message: "Cohort created", cohort });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createCohort = createCohort;
// List all cohorts
const getAllCohorts = async (req, res) => {
    try {
        const cohorts = await cohort_1.default.find().sort({ startDate: 1 }).populate("students", "name email");
        res.status(200).json({ cohorts });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllCohorts = getAllCohorts;
// Get cohort details
const getCohortDetails = async (req, res) => {
    try {
        const cohort = await cohort_1.default.findById(req.params.id).populate("students");
        if (!cohort)
            return res.status(404).json({ message: "Cohort not found" });
        res.status(200).json({ cohort });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCohortDetails = getCohortDetails;
// Enroll student
const enrollStudent = async (req, res) => {
    try {
        const cohort = await cohort_1.default.findById(req.params.id);
        if (!cohort)
            return res.status(404).json({ message: "Cohort not found" });
        const student = req.student;
        if (cohort.students.includes(student._id))
            return res.status(400).json({ message: "Already enrolled" });
        cohort.students.push(student._id);
        await cohort.save();
        student.cohorts.push(cohort._id);
        await student.save();
        res.status(200).json({ message: "Enrolled successfully", cohort });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.enrollStudent = enrollStudent;
