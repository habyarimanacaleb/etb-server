"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.getStudentById = exports.getAllStudents = exports.createStudent = void 0;
const student_1 = __importDefault(require("../models/student"));
const cohort_1 = __importDefault(require("../models/cohort"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
// Create a new student
const createStudent = async (req, res) => {
    try {
        const student = await student_1.default.create(req.body);
        if (student) {
            res.status(402).json({ mess: "Student already exist" });
        }
        await student.save();
        res.status(201).json(student);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.createStudent = createStudent;
// Get all students
const getAllStudents = async (_req, res) => {
    try {
        const students = await student_1.default.find();
        res.json(students);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getAllStudents = getAllStudents;
// Get student by ID with cohorts
const getStudentById = async (req, res) => {
    try {
        const student = await student_1.default.findById(req.params.id);
        if (!student)
            return res.status(404).json({ message: "Student not found" });
        const cohorts = await cohort_1.default.find({ students: student._id });
        res.json({ student, cohorts });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getStudentById = getStudentById;
// Update student info
const updateStudent = async (req, res) => {
    try {
        const student = await student_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student)
            return res.status(404).json({ message: "Student not found" });
        res.json(student);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateStudent = updateStudent;
// Delete student
const deleteStudent = async (req, res) => {
    try {
        const student = await student_1.default.findByIdAndDelete(req.params.id);
        if (!student)
            return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student deleted" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.deleteStudent = deleteStudent;
