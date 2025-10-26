"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCohort = exports.updateCohort = exports.removeStudentFromCohort = exports.assignStudentToCohort = exports.getCohortDetails = exports.getCohortById = exports.getAllCohorts = exports.createCohort = void 0;
const cohort_1 = __importDefault(require("../models/cohort"));
const student_1 = __importDefault(require("../models/student"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createCohort = async (req, res) => {
    try {
        const { name, program, startDate, endDate, description } = req.body;
        const cohort = await cohort_1.default.create({
            name,
            program,
            startDate,
            endDate,
            description,
        });
        res.status(201).json({ message: "Cohort created successfully", cohort });
    }
    catch (error) {
        console.error("Error creating cohort:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createCohort = createCohort;
const getAllCohorts = async (req, res) => {
    try {
        const cohorts = await cohort_1.default.find()
            .sort({ startDate: 1 })
            .populate("students", "name email");
        res.status(200).json({ cohorts });
    }
    catch (error) {
        console.error("Error fetching cohorts:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllCohorts = getAllCohorts;
const getCohortById = async (req, res) => {
    try {
        const cohort = await cohort_1.default.findById(req.params.id).populate("students");
        if (!cohort) {
            return res.status(404).json({ message: "Cohort not found" });
        }
        res.status(200).json({ cohort });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCohortById = getCohortById;
const getCohortDetails = async (req, res) => {
    try {
        const cohort = await cohort_1.default.findById(req.params.id).populate("students", "name email");
        if (!cohort)
            return res.status(404).json({ message: "Cohort not found" });
        res.status(200).json({ cohort });
    }
    catch (error) {
        console.error("Error fetching cohort:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCohortDetails = getCohortDetails;
const assignStudentToCohort = async (req, res) => {
    try {
        // 1. Get token and verify
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "supersecretkey");
        const userId = decoded.id;
        // 2. Find the logged-in user
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // 3. Find the student record linked to user email
        const student = await student_1.default.findOne({ email: user.email });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        // 4. Ensure student is assigned to a cohort
        const cohortId = student.cohort?.toString();
        if (!cohortId) {
            return res.status(400).json({ message: "Student is not assigned to any cohort" });
        }
        const cohort = await cohort_1.default.findById(cohortId).populate("students");
        if (!cohort) {
            return res.status(404).json({ message: "Cohort not found" });
        }
        // 5. Check if student already joined the cohort
        if (cohort.students.some((s) => s._id.toString() === student._id)) {
            return res.status(400).json({ message: "You already joined this cohort" });
        }
        // 6. Assign student to cohort
        cohort.students.push({
            name: student.name,
            email: student.email,
            phone: student.phone,
            education: student.education,
            program: student.program,
            experience: student.experience,
            startDate: student.startDate,
            motivation: student.motivation,
            referral: student.referral,
        }); // push only student ID
        await cohort.save();
        // 7. Return updated cohort info
        const updatedCohort = await cohort_1.default.findById(cohortId).populate("students");
        return res.status(200).json({
            message: "You successfully joined the cohort",
            cohort: updatedCohort,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error joining cohort", error: error.message });
    }
};
exports.assignStudentToCohort = assignStudentToCohort;
const removeStudentFromCohort = async (req, res) => {
    try {
        const { studentId, cohortId } = req.body;
        const student = await student_1.default.findById(studentId);
        const cohort = await cohort_1.default.findById(cohortId);
        if (!student || !cohort) {
            return res.status(404).json({ message: "Student or Cohort not found" });
        }
        // Remove student from cohort
        cohort.students = cohort.students.filter((s) => s._id.toString() !== studentId);
        await cohort.save();
        // Remove cohort from student
        student.cohort = undefined;
        await student.save();
        res.status(200).json({ message: "Student removed from cohort successfully", cohort });
    }
    catch (error) {
        console.error("Error removing student:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.removeStudentFromCohort = removeStudentFromCohort;
const updateCohort = async (req, res) => {
    try {
        const updatedCohort = await cohort_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCohort)
            return res.status(404).json({ message: "Cohort not found" });
        res.status(200).json({ message: "Cohort updated successfully", cohort: updatedCohort });
    }
    catch (error) {
        console.error("Error updating cohort:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateCohort = updateCohort;
const deleteCohort = async (req, res) => {
    try {
        const deleted = await cohort_1.default.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Cohort not found" });
        // Optionally, remove cohort reference from all students that were part of it
        await student_1.default.updateMany({ cohort: deleted._id }, { $unset: { cohort: "" } });
        res.status(200).json({ message: "Cohort deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting cohort:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteCohort = deleteCohort;
