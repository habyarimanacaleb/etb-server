import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  markProjectAsCompleted,
  markProjectAsOngoing,
  getOngoingProjects,
  getCompletedProjects,
} from "../controllers/projectController";

const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.put("/:id/complete", markProjectAsCompleted);
router.put("/:id/ongoing", markProjectAsOngoing);
router.get("/status/ongoing", getOngoingProjects);
router.get("/status/completed", getCompletedProjects);

export default router;
