import express from "express";
import {
  sendQuery,
  getAllQueries,
  getQueryById,
  deleteQuery,
  replyToQuery,
} from "../controllers/contactController";

const router = express.Router();

router.post("/send", sendQuery);           // User contact form submission
router.get("/", getAllQueries);            // Admin fetch all queries
router.get("/:id", getQueryById);          // Admin get one query
router.delete("/:id", deleteQuery);        // Admin delete a query
router.post("/reply/:id", replyToQuery);   // Admin reply manually

export default router;
