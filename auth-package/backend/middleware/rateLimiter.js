// Simple in-memory rate limiter (no external dependencies)
const requestCounts = new Map();

// Clean up old entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now - value.resetTime > 15 * 60 * 1000) {
      requestCounts.delete(key);
    }
  }
}, 15 * 60 * 1000);

export const rateLimiter = (maxRequests = 10, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    // In development, be more lenient
    if (process.env.NODE_ENV === "development") {
      const devMaxRequests = maxRequests * 10;
      const key = req.ip || req.connection.remoteAddress;
      const now = Date.now();

      if (!requestCounts.has(key)) {
        requestCounts.set(key, { count: 1, resetTime: now + windowMs });
        return next();
      }

      const record = requestCounts.get(key);

      if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + windowMs;
        return next();
      }

      if (record.count >= devMaxRequests) {
        return res.status(429).json({
          success: false,
          message: "Too many requests, please try again later",
        });
      }

      record.count++;
      return next();
    }

    // Production rate limiting
    const key = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const now = Date.now();

    if (!requestCounts.has(key)) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const record = requestCounts.get(key);

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later",
      });
    }

    record.count++;
    next();
  };
};

