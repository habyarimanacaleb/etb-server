"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.getStudentById = exports.getAllStudents = exports.createStudent = void 0;
const mongoose_1 = require("mongoose");
const student_1 = __importDefault(require("../models/student"));
const cohort_1 = __importDefault(require("../models/cohort"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
const createStudent = async (req, res) => {
    try {
        const { name, email, phone, education, program, experience, startDate, motivation, referral, cohortId, } = req.body;
        // ✅ Step 1: Check if student already exists
        let student = await student_1.default.findOne({ email });
        if (student) {
            // Check if already part of this cohort
            const alreadyInCohort = await cohort_1.default.findOne({
                _id: cohortId,
                "students.email": email,
            });
            if (alreadyInCohort) {
                return res
                    .status(400)
                    .json({ message: "Student already joined this cohort" });
            }
        }
        else {
            // Create new student record
            student = new student_1.default({
                name,
                email,
                phone,
                education,
                program,
                experience,
                startDate,
                motivation,
                referral,
                cohort: cohortId ? new mongoose_1.Types.ObjectId(cohortId) : undefined,
            });
        }
        // ✅ Step 2: Assign student to a cohort if cohortId is provided
        if (cohortId) {
            const cohort = await cohort_1.default.findById(cohortId);
            if (!cohort) {
                return res.status(404).json({ message: "Cohort not found" });
            }
            // Push full student object snapshot (embedded)
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
            });
            await cohort.save();
            student.cohort = cohort._id;
        }
        await student.save();
        await transporter.sendMail({
            from: `"ETB Club" <${process.env.EMAIL_USER}>`,
            to: student.email,
            subject: "Welcome to ETB Club 🎉",
            text: `Hello ${student.name}, welcome to the ETB Club! We're excited to have you in the ${program} program.`,
        });
        return res.status(201).json({
            message: "Student successfully created and assigned to cohort",
            student,
        });
    }
    catch (err) {
        console.error("Error creating student:", err);
        return res.status(500).json({ message: err.message });
    }
};
exports.createStudent = createStudent;
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
