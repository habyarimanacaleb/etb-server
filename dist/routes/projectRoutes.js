"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const router = express_1.default.Router();
router.post("/", projectController_1.createProject);
router.get("/", projectController_1.getProjects);
router.get("/:id", projectController_1.getProjectById);
router.put("/:id", projectController_1.updateProject);
router.delete("/:id", projectController_1.deleteProject);
router.put("/:id/complete", projectController_1.markProjectAsCompleted);
router.put("/:id/ongoing", projectController_1.markProjectAsOngoing);
router.get("/status/ongoing", projectController_1.getOngoingProjects);
router.get("/status/completed", projectController_1.getCompletedProjects);
exports.default = router;
