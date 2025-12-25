import crypto from "crypto";

// In-memory store for CSRF tokens (use Redis in production for scalability)
const csrfTokens = new Map();

// Clean up expired tokens every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of csrfTokens.entries()) {
    if (data.expires < now) {
      csrfTokens.delete(token);
    }
  }
}, 10 * 60 * 1000);

/**
 * Generate CSRF token
 * Token expires in 1 hour
 */
export function generateCSRFToken() {
  const token = crypto.randomBytes(32).toString("hex");
  csrfTokens.set(token, {
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
    createdAt: Date.now(),
  });
  return token;
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token) {
  if (!token) {
    return false;
  }

  const tokenData = csrfTokens.get(token);
  
  if (!tokenData) {
    return false;
  }

  // Check if token expired
  if (tokenData.expires < Date.now()) {
    csrfTokens.delete(token);
    return false;
  }

  return true;
}

/**
 * Middleware to get CSRF token (for GET requests)
 */
export function getCSRFToken(req, res, next) {
  // Generate token for GET requests to auth endpoints
  if (req.method === "GET" && (req.path.includes("/auth/") || req.path.includes("/csrf-token"))) {
    const token = generateCSRFToken();
    res.cookie("csrf-token", token, {
      httpOnly: false, // Must be accessible to JavaScript
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    });
    res.locals.csrfToken = token;
  }
  next();
}

/**
 * Middleware to verify CSRF token (for POST/PUT/DELETE requests)
 * User-friendly: Only validates for state-changing operations
 */
export function verifyCSRF(req, res, next) {
  // Skip CSRF for certain endpoints (like OAuth callbacks)
  const skipPaths = ["/auth/google/callback", "/auth/verify"];
  if (skipPaths.some(path => req.path.includes(path))) {
    return next();
  }

  // Only verify for state-changing methods
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    return next();
  }

  // Get token from header or body
  const token = req.headers["x-csrf-token"] || req.body.csrfToken;
  const cookieToken = req.cookies["csrf-token"];

  // Verify token matches cookie
  if (!token || !cookieToken || token !== cookieToken) {
    return res.status(403).json({
      success: false,
      message: "Invalid security token. Please refresh the page and try again.",
    });
  }

  // Verify token is valid
  if (!verifyCSRFToken(token)) {
    return res.status(403).json({
      success: false,
      message: "Security token expired. Please refresh the page and try again.",
    });
  }

  next();
}

