import crypto from "crypto";

const parseBoolean = (value, defaultValue) => {
  if (value === undefined || value === null || value === "") return defaultValue;
  const normalized = String(value).toLowerCase().trim();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return defaultValue;
};

const getCsrfCookieOptions = () => ({
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
});

const shouldSkipPath = (path) => {
  const skipPaths = ["/health", "/health/email", "/api/auth/google/callback", "/auth/google/callback"];
  return skipPaths.some((p) => path.startsWith(p));
};

export const issueCsrfToken = (res) => {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie("csrf-token", token, getCsrfCookieOptions());
  return token;
};

export const csrfTokenGuard = (req, res, next) => {
  const tokenMode = (process.env.CSRF_MODE || "off").toLowerCase().trim();
  const tokenModeEnabled = tokenMode === "token";
  const enforceInProd = parseBoolean(process.env.ENFORCE_CSRF_TOKEN, false);

  if (!tokenModeEnabled && !enforceInProd) {
    return next();
  }

  if (shouldSkipPath(req.path)) {
    return next();
  }

  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return next();
  }

  const hasAuthCookie = Boolean(req.cookies?.token);
  if (!hasAuthCookie) {
    return next();
  }

  const headerToken = req.headers["x-csrf-token"];
  const cookieToken = req.cookies["csrf-token"];

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return res.status(403).json({
      success: false,
      message: "CSRF token missing or invalid",
    });
  }

  return next();
};
