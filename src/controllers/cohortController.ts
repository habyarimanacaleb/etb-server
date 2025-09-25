// src/controllers/cohortController.ts
import { Request, Response } from "express";
import Cohort from "../models/cohort";
import Student from "../models/student";

// Create a new cohort (admin only)
export const createCohort = async (req: Request, res: Response) => {
  try {
    const cohort = await Cohort.create(req.body);
    res.status(201).json({ message: "Cohort created", cohort });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};

// List all cohorts
export const getAllCohorts = async (req: Request, res: Response) => {
  try {
const cohorts = await Cohort.find().sort({ startDate: 1 }).populate("students", "name email");    res.status(200).json({ cohorts });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};

// Get cohort details
export const getCohortDetails = async (req: Request, res: Response) => {
  try {
    const cohort = await Cohort.findById(req.params.id).populate("students");
    if (!cohort) return res.status(404).json({ message: "Cohort not found" });
    res.status(200).json({ cohort });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Enroll student
export const enrollStudent = async (req: any, res: Response) => {
  try {
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) return res.status(404).json({ message: "Cohort not found" });

    const student = req.student;

    if (cohort.students.includes(student._id))
      return res.status(400).json({ message: "Already enrolled" });

    cohort.students.push(student._id);
    await cohort.save();

    student.cohorts.push(cohort._id);
    await student.save();

    res.status(200).json({ message: "Enrolled successfully", cohort });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
