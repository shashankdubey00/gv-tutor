import fs from "fs";
import path from "path";
import multer from "multer";

const uploadsRoot = path.resolve("backend", "uploads", "resumes");

if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}

const sanitizeFileName = (name = "") =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsRoot);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.userId || "user";
    const timestamp = Date.now();
    const safeName = sanitizeFileName(file.originalname);
    cb(null, `${userId}-${timestamp}-${safeName}`);
  },
});

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const fileFilter = (_req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(new Error("Only PDF or Word documents are allowed"));
  }
  return cb(null, true);
};

export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
