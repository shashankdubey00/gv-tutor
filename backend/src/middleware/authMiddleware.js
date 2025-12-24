import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    // Don't log - this is expected when users aren't logged in
    return res.status(401).json({ 
      success: false,
      message: "Not authenticated" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    // Only log in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Auth verified - User:", decoded.userId, "Role:", decoded.role);
    }
    next();
  } catch (err) {
    // Only log actual token verification errors (expired, invalid, etc.)
    console.error("❌ Token verification failed:", err.message);
    res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};
