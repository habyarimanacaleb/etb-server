import { Request, Response } from "express";
import Program from "../models/program";

/**
 * Create a new program — no duplication, optimized insert
 */
export const createProgram = async (req: Request, res: Response) => {
  try {
    const { title, description, duration, skills, projects, outcomes } = req.body;

    if (!title || !description || !duration) {
      return res.status(400).json({ message: "Title, description, and duration are required" });
    }

    // 🔍 Prevent duplicate title (case-insensitive)
    const existingProgram = await Program.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    }).lean();

    if (existingProgram) {
      return res.status(409).json({ message: "Program with this title already exists" });
    }

    // ✅ Create new program
    const newProgram = await Program.create({
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
  } catch (error: any) {
    res.status(500).json({
      message: "Error creating program",
      error: error.message,
    });
  }
};

/**
 * Get all programs — optimized read with lean
 */
export const getPrograms = async (_req: Request, res: Response) => {
  try {
    const programs = await Program.find({}, "title description duration skills projects outcomes")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(programs);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching programs",
      error: error.message,
    });
  }
};

/**
 * Get single program by ID
 */
export const getProgramById = async (req: Request, res: Response) => {
  try {
    const program = await Program.findById(req.params.id).lean();
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.status(200).json(program);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching program",
      error: error.message,
    });
  }
};

/**
 * Update a program — prevent duplicate title, allow array updates
 */
export const updateProgram = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (title) {
      const duplicate = await Program.findOne({
        title: { $regex: new RegExp(`^${title}$`, "i") },
        _id: { $ne: req.params.id },
      }).lean();

      if (duplicate) {
        return res.status(409).json({
          message: "Another program with this title already exists",
        });
      }
    }

    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProgram) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.status(200).json({
      message: "Program updated successfully",
      program: updatedProgram,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating program",
      error: error.message,
    });
  }
};

/**
 * Delete a program
 */
export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const deleted = await Program.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Program not found" });

    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "Error deleting program",
      error: error.message,
    });
  }
};
