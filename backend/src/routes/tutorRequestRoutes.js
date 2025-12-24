import express from "express";
import {
  createTutorRequest,
  getPostedTutorRequests,
} from "../controllers/tutorRequestController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkProfileComplete } from "../middleware/checkProfileComplete.js";

const router = express.Router();

// Create tutor request (no auth required - for parents/students)
router.post("/", createTutorRequest);

// Get posted tutor requests (auth required + profile complete - for tutors)
router.get("/posted", protect, checkProfileComplete, getPostedTutorRequests);

export default router;

