import { Router, Request, Response } from "express";
import {
  createCohort,
  getAllCohorts,
  getCohortDetails,
  assignStudentToCohort,
  removeStudentFromCohort,
  updateCohort,
  deleteCohort,
} from "../controllers/cohortController";
// import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.post("/", createCohort);

router.get("/", getAllCohorts);

router.get("/:id", getCohortDetails);

router.post("/assign", assignStudentToCohort);

router.post("/remove", removeStudentFromCohort);

router.put("/:id", updateCohort);

router.delete("/:id", deleteCohort);

export default router;
