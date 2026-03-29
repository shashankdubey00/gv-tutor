import jwt from "jsonwebtoken";

/** Always store a hex string so Mongoose never gets a bad CastError from JWT payloads. */
function normalizeUserId(raw) {
  if (raw == null) return null;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (typeof raw === "object") {
    if (typeof raw.$oid === "string") return raw.$oid;
    if (typeof raw.toHexString === "function") return raw.toHexString();
  }
  try {
    const s = String(raw);
    return s && s !== "[object Object]" ? s : null;
  } catch {
    return null;
  }
}

export const protect = (req, res, next) => {
  let token = req.cookies?.token;

  // Fallback for privacy browsers where cookie auth can fail.
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.substring(7);
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = normalizeUserId(decoded.userId ?? decoded.id);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    req.user = { ...decoded, userId };
    return next();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Token verification failed:", err.message);
    }
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

