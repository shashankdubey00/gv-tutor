import express from "express";
import {
  createOrUpdateTutorProfile,
  getTutorProfile,
  uploadTutorResumeOnly,
  downloadOwnTutorResume,
} from "../controllers/tutorProfileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createResumeMulter } from "../config/resumeUpload.js";

const router = express.Router();
const resumeUpload = createResumeMulter();

function isMultipartRequest(req) {
  const ct = String(req.headers["content-type"] || "").toLowerCase();
  if (ct.includes("multipart/form-data")) return true;
  if (typeof req.is === "function") {
    try {
      return req.is("multipart/form-data");
    } catch {
      return false;
    }
  }
  return false;
}

function resumeUploadOnMultipart(req, res, next) {
  if (isMultipartRequest(req)) {
    return resumeUpload.single("resume")(req, res, (err) => {
      if (err) {
        let message =
          err.code === "LIMIT_FILE_SIZE"
            ? "Resume must be 5MB or smaller"
            : err.message || "Invalid resume upload";
        if (err.code === "EACCES" || err.code === "EROFS") {
          message = "Server could not save the file. Set RESUME_UPLOAD_DIR to a writable path.";
        }
        return res.status(400).json({ success: false, message });
      }
      next();
    });
  }
  return next();
}

function resumeUploadRequired(req, res, next) {
  return resumeUpload.single("resume")(req, res, (err) => {
    if (err) {
      let message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Resume must be 5MB or smaller"
          : err.message || "Invalid resume upload";
      if (err.code === "EACCES" || err.code === "EROFS") {
        message = "Server could not save the file. Set RESUME_UPLOAD_DIR to a writable path.";
      }
      return res.status(400).json({ success: false, message });
    }
    next();
  });
}

// All routes require authentication
router.use(protect);

router.post("/resume", resumeUploadRequired, uploadTutorResumeOnly);

router.get("/resume", downloadOwnTutorResume);

router.post("/", resumeUploadOnMultipart, createOrUpdateTutorProfile);
router.put("/", resumeUploadOnMultipart, createOrUpdateTutorProfile);

router.get("/", getTutorProfile);

export default router;




