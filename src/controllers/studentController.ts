import { Request, Response } from "express";
import { Types } from "mongoose";
import Student from "../models/student";
import Cohort from "../models/cohort";
import nodemailer from "nodemailer";

 const transporter = nodemailer.createTransport({
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



export const createStudent = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      education,
      program,
      experience,
      startDate,
      motivation,
      referral,
      cohortId,
    } = req.body;

    // ✅ Step 1: Check if student already exists
    let student = await Student.findOne({ email });

    if (student) {
      // Check if already part of this cohort
      const alreadyInCohort = await Cohort.findOne({
        _id: cohortId,
        "students.email": email,
      });

      if (alreadyInCohort) {
        return res
          .status(400)
          .json({ message: "Student already joined this cohort" });
      }
    } else {
      // Create new student record
      student = new Student({
        name,
        email,
        phone,
        education,
        program,
        experience,
        startDate,
        motivation,
        referral,
        cohort: cohortId ? new Types.ObjectId(cohortId) : undefined,
      });
    }

    // ✅ Step 2: Assign student to a cohort if cohortId is provided
    if (cohortId) {
      const cohort = await Cohort.findById(cohortId);
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

      student.cohort = cohort._id as Types.ObjectId;
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
  } catch (err: any) {
    console.error("Error creating student:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getAllStudents = async (_req: Request, res: Response) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

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

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

