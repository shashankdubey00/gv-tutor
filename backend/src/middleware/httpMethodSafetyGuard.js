const parseBoolean = (value, defaultValue) => {
  if (value === undefined || value === null || value === "") return defaultValue;
  const normalized = String(value).toLowerCase().trim();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return defaultValue;
};

const hasRequestBody = (body) =>
  body &&
  typeof body === "object" &&
  !Array.isArray(body) &&
  Object.keys(body).length > 0;

const isMethodOverrideAttempt = (req) => {
  const headerOverride = req.headers["x-http-method-override"];
  const queryOverride = req.query?._method || req.query?.method;
  const bodyOverride = req.body?._method || req.body?.method;
  const candidate = (headerOverride || queryOverride || bodyOverride || "").toString().toUpperCase();
  return ["POST", "PUT", "PATCH", "DELETE"].includes(candidate);
};

export const httpMethodSafetyGuard = (req, res, next) => {
  const enforce = parseBoolean(
    process.env.ENFORCE_SAFE_HTTP_METHODS,
    process.env.NODE_ENV === "production"
  );

  if (!enforce) {
    return next();
  }

  if (req.method !== "GET") {
    return next();
  }

  if (isMethodOverrideAttempt(req)) {
    return res.status(405).json({
      success: false,
      message: "Method override via GET is not allowed",
    });
  }

  if (hasRequestBody(req.body)) {
    return res.status(400).json({
      success: false,
      message: "GET requests must not contain a request body",
    });
  }

  return next();
};
