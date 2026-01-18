import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signup, login, forgotPassword, verifyOTP, resetPassword, setPassword, changePassword, calculatePasswordStrength } from "../controllers/authController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

const router = express.Router();

// Rate limiting for auth routes (30 requests per 15 minutes per IP - more lenient for normal usage)
const authRateLimit = rateLimiter(30, 15 * 60 * 1000);

// Password strength checker (user-friendly feedback)
router.post("/check-password-strength", (req, res) => {
  try {
    const { password } = req.body;
    const strength = calculatePasswordStrength(password);
    res.json({
      success: true,
      ...strength,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking password strength",
    });
  }
});

// Auth routes (CSRF removed for better user experience)
router.post("/signup", authRateLimit, signup);
router.post("/login", authRateLimit, login);
router.post("/forgot-password", authRateLimit, forgotPassword);
router.post("/verify-otp", authRateLimit, verifyOTP); // Verify OTP
router.post("/reset-password", authRateLimit, resetPassword); // Reset password with OTP
router.post("/set-password", authRateLimit, protect, setPassword); // Protected - user must be logged in
router.post("/change-password", authRateLimit, protect, changePassword); // Protected - change password (requires current password)

// Verify authentication endpoint
router.get("/verify", protect, async (req, res) => {
  try {
    // First get user with passwordHash to check if password exists
    const userWithPassword = await User.findById(req.user.userId).select("passwordHash");
    if (!userWithPassword) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Then get user without passwordHash for response
    const user = await User.findById(req.user.userId).select("-passwordHash");
    
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isTutorProfileComplete: user.isTutorProfileComplete,
        authProviders: user.authProviders,
        hasPassword: !!userWithPassword.passwordHash, // Check from userWithPassword
      },
    });
  } catch (error) {
    console.error("Verify auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Redirect to Google
router.get(
  "/google",
  (req, res, next) => {
    // Log Google OAuth initiation for debugging
    console.log("🔍 Google OAuth initiated:", {
      clientId: process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Missing",
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
      clientUrl: process.env.CLIENT_URL,
    });
    
    // Get role from query parameter and pass via state
    const role = req.query.role || "user";
    const state = Buffer.from(JSON.stringify({ role })).toString("base64");
    
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: state, // Pass role via state parameter
    })(req, res, next);
  }
);

// Logout endpoint
router.post("/logout", (req, res) => {
  // Clear cookie with all possible configurations to ensure it's deleted
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
    expires: new Date(0), // Set expiration to epoch time
  };
  
  // Clear cookie multiple ways to ensure it works
  res.cookie("token", "", cookieOptions);
  res.clearCookie("token", cookieOptions);
  
  // Also try with different SameSite values
  res.cookie("token", "", { ...cookieOptions, sameSite: "none", secure: true });
  res.clearCookie("token", { ...cookieOptions, sameSite: "none", secure: true });
  
  // Try without secure flag for HTTP
  if (process.env.NODE_ENV !== "production") {
    res.cookie("token", "", { ...cookieOptions, secure: false });
    res.clearCookie("token", { ...cookieOptions, secure: false });
  }
  
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

router.get(
  "/google/callback",
  (req, res, next) => {
    // Log callback attempt for debugging
    console.log("🔍 Google OAuth callback received:", {
      query: req.query,
      hasState: !!req.query.state,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
      clientUrl: process.env.CLIENT_URL,
    });
    next();
  },
  passport.authenticate("google", {
    session: false,
    failureRedirect: process.env.CLIENT_URL + "/login?error=google_auth_failed",
  }),
  async (req, res) => {
    try {
      // Verify user exists after Google authentication
      if (!req.user) {
        console.error("Google OAuth: No user found after authentication");
        return res.redirect(process.env.CLIENT_URL + "/login?error=no_user");
      }

      // Extract role from state parameter
      let roleFromState = "user";
      try {
        if (req.query.state) {
          const decoded = JSON.parse(Buffer.from(req.query.state, "base64").toString());
          roleFromState = decoded.role || "user";
        }
      } catch (err) {
        console.error("Error decoding OAuth state:", err);
      }

      // Double-check user exists in database
      let user = await User.findById(req.user._id);
      
      if (!user) {
        console.error("Google OAuth: User not found in database");
        return res.redirect(process.env.CLIENT_URL + "/login?error=user_not_found");
      }

      // Ensure user has UserProfile
      let userProfile = await UserProfile.findOne({ userId: user._id });
      if (!userProfile) {
        const nameFromEmail = user.email.split("@")[0];
        userProfile = await UserProfile.create({
          userId: user._id,
          fullName: nameFromEmail,
          phone: "",
          address: "",
        });
        console.log("✅ Created UserProfile for Google OAuth user");
      }

      // Update user role if it was passed via state and user is new or role is user
      if (roleFromState === "tutor" && user.role === "user") {
        user.role = "tutor";
        await user.save();
      }

      console.log("Google OAuth: Successfully authenticated user:", user.email, "Role:", user.role);

      // Create JWT token (same as login endpoint)
      const token = jwt.sign(
        { userId: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Set cookie with explicit settings for cross-origin (EXACT same as login endpoint)
      const cookieOptions = {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" for cross-origin in production
        secure: process.env.NODE_ENV === "production", // true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: "/", // Important: Set path so cookie is accessible across all routes
      };
      
      // In development, don't set domain (allows localhost) - same as login endpoint
      if (process.env.NODE_ENV === "production") {
        cookieOptions.domain = undefined; // Let browser set domain automatically
      }
      
      res.cookie("token", token, cookieOptions);

      // Redirect to home page - frontend will handle routing based on user state
      res.redirect(process.env.CLIENT_URL + "/?auth=success&provider=google");
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect(process.env.CLIENT_URL + "/login?error=server_error");
    }
  }
);


export default router;
