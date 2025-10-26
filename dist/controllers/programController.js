"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProgram = exports.updateProgram = exports.getProgramById = exports.getPrograms = exports.createProgram = void 0;
const program_1 = __importDefault(require("../models/program"));
/**
 * Create a new program — no duplication, optimized insert
 */
const createProgram = async (req, res) => {
    try {
        const { title, description, duration, skills, projects, outcomes } = req.body;
        if (!title || !description || !duration) {
            return res.status(400).json({ message: "Title, description, and duration are required" });
        }
        // 🔍 Prevent duplicate title (case-insensitive)
        const existingProgram = await program_1.default.findOne({
            title: { $regex: new RegExp(`^${title}$`, "i") },
        }).lean();
        if (existingProgram) {
            return res.status(409).json({ message: "Program with this title already exists" });
        }
        // ✅ Create new program
        const newProgram = await program_1.default.create({
            title,
            description,
            duration,
            skills: skills || [],
            projects: projects || [],
            outcomes: outcomes || [],
        });
        await newProgram.save();
        res.status(201).json({
            message: "Program created successfully",
            program: newProgram,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating program",
            error: error.message,
        });
    }
};
exports.createProgram = createProgram;
/**
 * Get all programs — optimized read with lean
 */
const getPrograms = async (_req, res) => {
    try {
        const programs = await program_1.default.find({}, "title description duration skills projects outcomes")
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json(programs);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching programs",
            error: error.message,
        });
    }
};
exports.getPrograms = getPrograms;
/**
 * Get single program by ID
 */
const getProgramById = async (req, res) => {
    try {
        const program = await program_1.default.findById(req.params.id).lean();
        if (!program)
            return res.status(404).json({ message: "Program not found" });
        res.status(200).json(program);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching program",
            error: error.message,
        });
    }
};
exports.getProgramById = getProgramById;
/**
 * Update a program — prevent duplicate title, allow array updates
 */
const updateProgram = async (req, res) => {
    try {
        const { title } = req.body;
        if (title) {
            const duplicate = await program_1.default.findOne({
                title: { $regex: new RegExp(`^${title}$`, "i") },
                _id: { $ne: req.params.id },
            }).lean();
            if (duplicate) {
                return res.status(409).json({
                    message: "Another program with this title already exists",
                });
            }
        }
        const updatedProgram = await program_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProgram) {
            return res.status(404).json({ message: "Program not found" });
        }
        res.status(200).json({
            message: "Program updated successfully",
            program: updatedProgram,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating program",
            error: error.message,
        });
    }
};
exports.updateProgram = updateProgram;
/**
 * Delete a program
 */
const deleteProgram = async (req, res) => {
    try {
        const deleted = await program_1.default.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Program not found" });
        res.status(200).json({ message: "Program deleted successfully" });
    }
    catch (error) {
        res.status(500).json({
            message: "Error deleting program",
            error: error.message,
        });
    }
};
exports.deleteProgram = deleteProgram;
