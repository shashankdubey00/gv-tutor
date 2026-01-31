import express from "express";
import {
  createContactMessage,
  getAllContactMessages,
  updateMessageStatus,
  deleteContactMessage,
} from "../controllers/contactController.js";

const router = express.Router();

// Public route - submit contact form
router.post("/submit", createContactMessage);

// Admin routes - manage messages
router.get("/all", getAllContactMessages);
router.patch("/:messageId/status", updateMessageStatus);
router.delete("/:messageId", deleteContactMessage);

export default router;
