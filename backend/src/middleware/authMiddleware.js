import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    console.log("❌ protect middleware: No token found in cookies");
    return res.status(401).json({ 
      success: false,
      message: "Not authenticated" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    console.log("✅ protect middleware: Token verified for user:", decoded.userId, "Role:", decoded.role);
    next();
  } catch (err) {
    console.error("❌ protect middleware: Token verification failed:", err.message);
    res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};
