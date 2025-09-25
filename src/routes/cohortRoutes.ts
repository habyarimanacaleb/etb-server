// src/routes/cohort.routes.ts
import { Router } from "express";
import {
  createCohort,
  getAllCohorts,
  getCohortDetails,
  enrollStudent,
} from "../controllers/cohortController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, authorizeRoles("admin"), createCohort);
router.get("/", protect, getAllCohorts);
router.get("/:id", protect, getCohortDetails);
router.post("/:id/enroll", protect, enrollStudent);

export default router;
