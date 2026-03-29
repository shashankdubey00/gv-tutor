import express from "express";
import {
  createOrUpdateTutorProfile,
  getTutorProfile,
} from "../controllers/tutorProfileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { resumeUpload } from "../middleware/resumeUpload.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create or update tutor profile
router.post("/", resumeUpload.single("resume"), createOrUpdateTutorProfile);
router.put("/", resumeUpload.single("resume"), createOrUpdateTutorProfile);

// Get tutor profile
router.get("/", getTutorProfile);

export default router;




