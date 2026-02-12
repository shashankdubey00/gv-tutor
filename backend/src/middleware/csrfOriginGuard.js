const isStateChangingMethod = (method) => ["POST", "PUT", "PATCH", "DELETE"].includes(method);

const normalizeOriginFromHeader = (value) => {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const parseBoolean = (value, defaultValue) => {
  if (value === undefined || value === null || value === "") return defaultValue;
  const normalized = String(value).toLowerCase().trim();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return defaultValue;
};

export const csrfOriginGuard = (allowedOrigins = []) => {
  const originSet = new Set(allowedOrigins.filter(Boolean));

  return (req, res, next) => {
    const enforceCsrfOrigin = parseBoolean(
      process.env.ENFORCE_CSRF_ORIGIN,
      process.env.NODE_ENV === "production"
    );

    if (!enforceCsrfOrigin) {
      return next();
    }

    if (!isStateChangingMethod(req.method)) {
      return next();
    }

    if (req.method === "OPTIONS") {
      return next();
    }

    // CSRF is relevant for cookie-authenticated requests.
    const hasAuthCookie = Boolean(req.cookies?.token);
    if (!hasAuthCookie) {
      return next();
    }

    const origin = normalizeOriginFromHeader(req.headers.origin);
    const refererOrigin = normalizeOriginFromHeader(req.headers.referer);
    const requestOrigin = origin || refererOrigin;

    if (requestOrigin && originSet.has(requestOrigin)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Request blocked by CSRF protection",
    });
  };
};
