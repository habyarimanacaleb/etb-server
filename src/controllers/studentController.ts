import { Request, Response } from "express";
import Student from "../models/student";
import Cohort from "../models/cohort";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Create a new student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.create(req.body);
    if(student){
        res.status(402).json({mess:"Student already exist"})
    }
    await student.save()
    res.status(201).json(student);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get all students
export const getAllStudents = async (_req: Request, res: Response) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get student by ID with cohorts
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const cohorts = await Cohort.find({ students: student._id });
    res.json({ student, cohorts });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update student info
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete student
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

