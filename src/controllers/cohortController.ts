import { Request, Response } from "express";
import Cohort from "../models/cohort";
import Student from "../models/student";
import { Types } from "mongoose";
import User from "../models/user.model";
import Jwt from "jsonwebtoken";


export const createCohort = async (req: Request, res: Response) => {
  try {
    const { name, program, startDate, endDate, description } = req.body;

    const cohort = await Cohort.create({
      name,
      program,
      startDate,
      endDate,
      description,
    });

    res.status(201).json({ message: "Cohort created successfully", cohort });
  } catch (error) {
    console.error("Error creating cohort:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCohorts = async (req: Request, res: Response) => {
  try {
    const cohorts = await Cohort.find()
      .sort({ startDate: 1 })
      .populate("students", "name email");

    res.status(200).json({ cohorts });
  } catch (error) {
    console.error("Error fetching cohorts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCohortById = async (req: Request, res: Response) => {
  try {
    const cohort = await Cohort.findById(req.params.id).populate("students");
    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }
    res.status(200).json({ cohort });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCohortDetails = async (req: Request, res: Response) => {
  try {
    const cohort = await Cohort.findById(req.params.id).populate("students", "name email");
    if (!cohort) return res.status(404).json({ message: "Cohort not found" });

    res.status(200).json({ cohort });
  } catch (error) {
    console.error("Error fetching cohort:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const assignStudentToCohort = async (req: Request, res: Response) => {
  try {
    // 1. Get token and verify
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded: any = Jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    const userId = decoded.id;

    // 2. Find the logged-in user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Find the student record linked to user email
    const student = await Student.findOne({ email: user.email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 4. Ensure student is assigned to a cohort
    const cohortId = student.cohort?.toString();
    if (!cohortId) {
      return res.status(400).json({ message: "Student is not assigned to any cohort" });
    }

    const cohort = await Cohort.findById(cohortId).populate("students");
    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }

    // 5. Check if student already joined the cohort
    if (cohort.students.some((s: any) => s._id.toString() === student._id)) {
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
    const updatedCohort = await Cohort.findById(cohortId).populate("students");

    return res.status(200).json({
      message: "You successfully joined the cohort",
      cohort: updatedCohort,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error joining cohort", error: error.message });
  }
};

export const removeStudentFromCohort = async (req: Request, res: Response) => {
  try {
    const { studentId, cohortId } = req.body;

    const student = await Student.findById(studentId);
    const cohort = await Cohort.findById(cohortId);

    if (!student || !cohort) {
      return res.status(404).json({ message: "Student or Cohort not found" });
    }

    // Remove student from cohort
    cohort.students = cohort.students.filter((s: any) => s._id.toString() !== studentId);
    await cohort.save();

    // Remove cohort from student
    student.cohort = undefined;
    await student.save();

    res.status(200).json({ message: "Student removed from cohort successfully", cohort });
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateCohort = async (req: Request, res: Response) => {
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCohort) return res.status(404).json({ message: "Cohort not found" });

    res.status(200).json({ message: "Cohort updated successfully", cohort: updatedCohort });
  } catch (error) {
    console.error("Error updating cohort:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCohort = async (req: Request, res: Response) => {
  try {
    const deleted = await Cohort.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Cohort not found" });

    // Optionally, remove cohort reference from all students that were part of it
    await Student.updateMany({ cohort: deleted._id }, { $unset: { cohort: "" } });

    res.status(200).json({ message: "Cohort deleted successfully" });
  } catch (error) {
    console.error("Error deleting cohort:", error);
    res.status(500).json({ message: "Server error" });
  }
};
