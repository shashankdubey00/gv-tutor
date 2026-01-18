import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies?.token;
  const cookiesReceived = req.cookies ? Object.keys(req.cookies) : [];
  const isVerifyEndpoint = req.path.includes('/verify');

  if (isVerifyEndpoint) {
    console.log("🔵 STEP 7 (Backend): /api/auth/verify endpoint hit");
    console.log("   - Cookies received:", cookiesReceived.length > 0 ? cookiesReceived : "NONE");
    console.log("   - Token present:", !!token);
    console.log("   - Request origin:", req.headers.origin);
    console.log("   - Request host:", req.headers.host);
    console.log("   - Cookie header:", req.headers.cookie || "NONE");
  }

  if (!token) {
    if (isVerifyEndpoint) {
      console.error("   - ❌ NO TOKEN FOUND - Cookie was not sent or not set");
      console.error("   - CHECK: Cookie domain in Set-Cookie response");
      console.error("   - CHECK: Cookie sameSite (must be 'none' for cross-origin)");
      console.error("   - CHECK: Cookie secure (must be 'true' for HTTPS)");
      console.error("   - CHECK: Frontend uses credentials: 'include' in fetch");
    }
    return res.status(401).json({ 
      success: false,
      message: "Not authenticated" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    
    if (isVerifyEndpoint) {
      console.log("   - ✅ TOKEN VERIFIED SUCCESSFULLY");
      console.log("   - User ID:", decoded.userId);
      console.log("   - User Role:", decoded.role);
    }
    
    // Only log in development for debugging (for other endpoints)
    if (process.env.NODE_ENV === "development" && !isVerifyEndpoint) {
      console.log("✅ Auth verified - User:", decoded.userId, "Role:", decoded.role);
    }
    next();
  } catch (err) {
    if (isVerifyEndpoint) {
      console.error("   - ❌ TOKEN VERIFICATION FAILED");
      console.error("   - Error:", err.message);
      console.error("   - Token exists but is invalid/expired");
    }
    // Only log actual token verification errors (expired, invalid, etc.)
    console.error("❌ Token verification failed:", err.message);
    res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};
