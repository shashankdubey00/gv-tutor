import express from "express";
import {
  createTutorRequest,
  getPostedTutorRequests,
  applyToTutorRequest,
} from "../controllers/tutorRequestController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkProfileComplete } from "../middleware/checkProfileComplete.js";

const router = express.Router();

// Create tutor request (no auth required - for parents/students)
router.post("/", createTutorRequest);

// Get posted tutor requests (auth required + profile complete - for tutors)
// This must come before /:requestId/apply to avoid route conflicts
router.get("/posted", protect, checkProfileComplete, getPostedTutorRequests);

// Apply to a tutor request (auth required + profile complete - for tutors)
router.post("/:requestId/apply", protect, checkProfileComplete, applyToTutorRequest);

export default router;

