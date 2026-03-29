import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const RESUME_UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "resumes");

const ALLOWED_EXT = new Set([".pdf", ".doc", ".docx"]);

export function ensureResumeUploadDir() {
  fs.mkdirSync(RESUME_UPLOAD_DIR, { recursive: true });
}

function extFromOriginal(originalname) {
  const ext = path.extname(originalname || "").toLowerCase();
  return ALLOWED_EXT.has(ext) ? ext : "";
}

export function createResumeMulter() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        ensureResumeUploadDir();
      } catch (err) {
        return cb(err);
      }
      cb(null, RESUME_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      const userId = req.user?.userId?.toString() || "unknown";
      const ext = extFromOriginal(file.originalname) || ".pdf";
      cb(null, `${userId}-${Date.now()}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (extFromOriginal(file.originalname)) {
      return cb(null, true);
    }
    cb(new Error("Only PDF, DOC, or DOCX files are allowed"));
  };

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
  });
}
