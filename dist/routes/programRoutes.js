"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const programController_1 = require("../controllers/programController");
const router = express_1.default.Router();
router.post("/create-program", programController_1.createProgram);
router.get("/program-records", programController_1.getPrograms);
router.get("/:id", programController_1.getProgramById);
router.put("/:id", programController_1.updateProgram);
router.delete("/:id", programController_1.deleteProgram);
exports.default = router;
