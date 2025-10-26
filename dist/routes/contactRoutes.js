"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const router = express_1.default.Router();
router.post("/send", contactController_1.sendQuery); // User contact form submission
router.get("/", contactController_1.getAllQueries); // Admin fetch all queries
router.get("/:id", contactController_1.getQueryById); // Admin get one query
router.delete("/:id", contactController_1.deleteQuery); // Admin delete a query
router.post("/reply/:id", contactController_1.replyToQuery); // Admin reply manually
exports.default = router;
