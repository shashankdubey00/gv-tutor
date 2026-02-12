const parseBoolean = (value, defaultValue) => {
  if (value === undefined || value === null || value === "") return defaultValue;
  const normalized = String(value).toLowerCase().trim();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return defaultValue;
};

const buildCsp = (allowedOrigins = []) => {
  const connectSrc = Array.from(
    new Set(["'self'", ...allowedOrigins.filter(Boolean), "https://accounts.google.com", "https://apis.google.com"])
  ).join(" ");

  return [
    "default-src 'self'",
    `connect-src ${connectSrc}`,
    "img-src 'self' data: https: blob:",
    "style-src 'self' 'unsafe-inline' https:",
    "font-src 'self' data: https:",
    "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com",
    "frame-src 'self' https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
};

export const securityHeaders = (allowedOrigins = []) => (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

  const hstsEnabled = parseBoolean(process.env.ENABLE_HSTS, process.env.NODE_ENV === "production");
  if (hstsEnabled && req.secure) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  const cspEnabled = parseBoolean(process.env.ENABLE_CSP, process.env.NODE_ENV === "production");
  if (cspEnabled) {
    res.setHeader("Content-Security-Policy", buildCsp(allowedOrigins));
  }

  next();
};
