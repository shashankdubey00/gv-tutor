import express from "express";
import {
  adminLogin,
  getAllParentApplications,
  getAllTutorApplications,
  getAllTutorMembers,
  updateTutorRequestStatus,
  updateFieldVisibility,
  updateTutorRequest,
  postTutorRequest,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import User from "../models/User.js";

const router = express.Router();

// Admin login (rate limited)
const adminRateLimit = rateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

router.post("/login", adminRateLimit, adminLogin);

// All routes below require authentication and admin role
router.use(protect);

// Middleware to check if user is admin
router.use(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Admin dashboard routes
router.get("/parent-applications", getAllParentApplications);
router.get("/tutor-applications", getAllTutorApplications);
router.get("/tutor-members", getAllTutorMembers);
router.put("/tutor-requests/:requestId/status", updateTutorRequestStatus);
router.put("/tutor-requests/:requestId/visibility", updateFieldVisibility);
router.put("/tutor-requests/:requestId", updateTutorRequest);
router.post("/tutor-requests/:requestId/post", postTutorRequest);

export default router;

