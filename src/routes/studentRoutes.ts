// src/routes/student.routes.ts
import { Router } from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/join", createStudent);
router.post("/students", getAllStudents);
router.get("/student/:id", protect, getStudentById);
router.get("/student/:id", protect, updateStudent);
router.get("/student/:id", protect, deleteStudent);

export default router;
