"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/student.routes.ts
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/join", studentController_1.createStudent);
router.post("/students", studentController_1.getAllStudents);
router.get("/student/:id", authMiddleware_1.protect, studentController_1.getStudentById);
router.get("/student/:id", authMiddleware_1.protect, studentController_1.updateStudent);
router.get("/student/:id", authMiddleware_1.protect, studentController_1.deleteStudent);
exports.default = router;
