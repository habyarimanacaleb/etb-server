"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/cohort.routes.ts
const express_1 = require("express");
const cohortController_1 = require("../controllers/cohortController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)("admin"), cohortController_1.createCohort);
router.get("/", authMiddleware_1.protect, cohortController_1.getAllCohorts);
router.get("/:id", authMiddleware_1.protect, cohortController_1.getCohortDetails);
router.post("/:id/enroll", authMiddleware_1.protect, cohortController_1.enrollStudent);
exports.default = router;
