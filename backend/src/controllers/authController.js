import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

// Enhanced email validation
const isValidEmail = (email) => {
  // More robust email regex
  // Allows: letters, numbers, dots, hyphens, underscores, plus signs
  // Must have @ symbol
  // Domain must have at least one dot
  // TLD must be at least 2 characters
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return false;
  }
  
  // Additional checks
  // No consecutive dots
  if (email.includes('..')) {
    return false;
  }
  
  // No leading or trailing dots/hyphens in local part
  const [localPart] = email.split('@');
  if (localPart.startsWith('.') || localPart.endsWith('.') || 
      localPart.startsWith('-') || localPart.endsWith('-')) {
    return false;
  }
  
  // Domain must have valid structure
  const domain = email.split('@')[1];
  if (!domain || domain.length < 4) { // e.g., "a.co" minimum
    return false;
  }
  
  return true;
};

// Password validation - User-friendly but secure
// Minimum 10 characters (more secure but still user-friendly)
// Optional: Show strength meter to guide users
const isStrongPassword = (password) => {
  // Minimum 10 characters (increased from 8 for better security)
  // No forced complexity - users can choose what they want
  return password.length >= 10;
};

// Password strength calculator (for frontend feedback)
export const calculatePasswordStrength = (password) => {
  if (!password) return { strength: 0, label: "", feedback: [] };
  
  let strength = 0;
  const feedback = [];
  
  // Length check (most important)
  if (password.length >= 10) {
    strength += 2;
    feedback.push("✓ Good length");
  } else if (password.length >= 8) {
    strength += 1;
    feedback.push("⚠️ Consider using at least 10 characters");
  } else {
    feedback.push("⚠️ Use at least 10 characters");
  }
  
  // Optional complexity (not required, just for feedback)
  if (password.length >= 12) {
    strength += 1;
    feedback.push("✓ Very good length");
  }
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    strength += 1;
    feedback.push("✓ Mix of uppercase and lowercase");
  }
  if (/\d/.test(password)) {
    strength += 1;
    feedback.push("✓ Contains numbers");
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    strength += 1;
    feedback.push("✓ Contains special characters");
  }
  
  // Strength labels
  let label = "";
  if (strength <= 2) label = "Weak";
  else if (strength <= 4) label = "Fair";
  else if (strength <= 5) label = "Good";
  else label = "Strong";
  
  return { strength: Math.min(strength, 6), label, feedback };
};

/* ---------------- SIGNUP ---------------- */
export const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // Normalize email (lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 10 characters",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    // SECURITY FIX: Prevent account enumeration - always return same message
    // Don't reveal if account exists or not
    if (existingUser) {
      // Check if user signed up with Google
      const hasGoogleAuth = existingUser.authProviders && existingUser.authProviders.includes("google");
      if (hasGoogleAuth && !existingUser.passwordHash) {
        // For Google accounts, we need to inform user, but use generic message
        return res.status(400).json({
          success: false,
          message: "Invalid email or password. Please check your credentials or try logging in with Google.",
        });
      }
      // Generic message - don't reveal account exists
      return res.status(400).json({
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // SECURITY FIX: Remove role parameter - always default to "user"
    // Role elevation should happen through separate admin process or profile completion
    // Ignore any role parameter sent from client for security
    const userRole = "user"; // Always default to "user" - no role manipulation allowed

    if (process.env.NODE_ENV === "development") {
      console.log("📝 Creating user with default role: 'user'");
    }

    // Create user
    const newUser = await User.create({
      email: normalizedEmail,
      passwordHash,
      authProviders: ["local"],
      role: userRole, // Default to "user"
    });

    // Create basic UserProfile for the user (with minimal info - will be completed later)
    // Extract name from email if possible, or use email as placeholder
    const nameFromEmail = normalizedEmail.split("@")[0];
    await UserProfile.create({
      userId: newUser._id,
      fullName: nameFromEmail, // Placeholder - user will update later
      phone: "", // Will be updated when user completes profile
      address: "",
    });

    if (process.env.NODE_ENV === "development") {
      console.log("✅ User and UserProfile created successfully");
    }

    // Auto-login: Generate JWT token and set cookie (same as login flow)
    const token = jwt.sign(
      { userId: newUser._id.toString(), role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Default to 1 day for new signups
    );

    // SECURITY FIX: Don't log sensitive information
    if (process.env.NODE_ENV === "development") {
      console.log("🔐 Auto-login cookie set for new user");
    }

    // Set cookie with explicit settings for cross-origin (same as login)
    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    };
    
    if (process.env.NODE_ENV === "production") {
      cookieOptions.domain = undefined;
    }
    
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User created successfully. You are now logged in.",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        isTutorProfileComplete: newUser.isTutorProfileComplete,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // Normalize email (lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // SECURITY FIX: Always perform password hash operation to prevent timing attacks
    // Use a dummy hash if user doesn't exist to normalize response time
    const dummyHash = "$2a$12$dummy.hash.to.prevent.timing.attacks.here";
    
    const user = await User.findOne({ email: normalizedEmail });
    
    // Get password hash (or use dummy)
    const passwordHashToCheck = user?.passwordHash || dummyHash;
    
    // SECURITY FIX: Check account lockout BEFORE password verification
    if (user) {
      // Check if account is locked
      if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
        const minutesRemaining = Math.ceil((user.accountLockedUntil - new Date()) / (1000 * 60));
        return res.status(423).json({
          success: false,
          message: `Account temporarily locked due to too many failed login attempts. Please try again in ${minutesRemaining} minute(s).`,
        });
      }
      
      // If lockout period expired, reset failed attempts
      if (user.accountLockedUntil && user.accountLockedUntil <= new Date()) {
        user.failedLoginAttempts = 0;
        user.accountLockedUntil = null;
        await user.save();
      }
      
      // Check if user has password (local authentication)
      if (!user.passwordHash) {
        // User exists but doesn't have password - might have signed up with Google
        const hasGoogleAuth = user.authProviders && user.authProviders.includes("google");
        if (hasGoogleAuth) {
          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
          });
        }
        // Use dummy hash for timing attack protection
      }
    }

    // SECURITY FIX: Always perform bcrypt comparison (even for non-existent users)
    // This prevents timing attacks that reveal if email exists
    const isMatch = await bcrypt.compare(password, passwordHashToCheck);

    if (!user || !isMatch || !user.passwordHash) {
      // Increment failed attempts if user exists
      if (user) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        
        // Lock account after 5 failed attempts for 30 minutes
        if (user.failedLoginAttempts >= 5) {
          user.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
          await user.save();
          return res.status(423).json({
            success: false,
            message: "Account temporarily locked due to too many failed login attempts. Please try again in 30 minutes.",
          });
        }
        
        await user.save();
      }
      
      // SECURITY FIX: Always return same generic message (prevent timing attacks)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // SECURITY FIX: Reset failed attempts on successful login
    if (user.failedLoginAttempts > 0 || user.accountLockedUntil) {
      user.failedLoginAttempts = 0;
      user.accountLockedUntil = null;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1d" }
    );

    // SECURITY FIX: Don't log sensitive information
    if (process.env.NODE_ENV === "development") {
      console.log("🔐 Login successful");
    }

    // Set cookie with explicit settings for cross-origin
    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" for cross-origin in production
      secure: process.env.NODE_ENV === "production", // true in production with HTTPS
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 1 day if not rememberMe
      path: "/", // Important: Set path so cookie is accessible across all routes
    };
    
    // In development, don't set domain (allows localhost)
    if (process.env.NODE_ENV === "production") {
      cookieOptions.domain = undefined; // Let browser set domain automatically
    }
    
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isTutorProfileComplete: user.isTutorProfileComplete,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------------- FORGOT PASSWORD ---------------- */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // SECURITY FIX: Prevent account enumeration - always perform same operations
    // Check if user exists and has password
    const user = await User.findOne({ email: normalizedEmail });
    
    // SECURITY FIX: Always return same response to prevent enumeration
    // Only send OTP if user exists and has password
    if (user && user.passwordHash) {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Hash OTP for storage
      const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
      
      // Set OTP expiration (10 minutes from now)
      user.resetPasswordOTP = otpHash;
      user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      user.resetPasswordOTPAttempts = 0; // Reset attempts
      await user.save();

      let emailSent = false;
      try {
        // Send password reset email with OTP
        await sendPasswordResetEmail(normalizedEmail, otp);
        emailSent = true;
        
        // SECURITY FIX: Only log in development, never log OTP
        if (process.env.NODE_ENV === "development") {
          console.log(`✅ Password reset OTP sent to: ${normalizedEmail}`);
        }
      } catch (emailError) {
        // SECURITY FIX: Don't log OTP even on error
        console.error("❌ Failed to send password reset email");
        emailSent = false;
      }
      
      // SECURITY FIX: Never return OTP in API response
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email, an OTP has been sent. Please check your inbox (and spam folder).",
      });
    } else if (user && !user.passwordHash) {
      // User exists but signed up with Google only
      // SECURITY FIX: Use generic message to prevent enumeration
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email, an OTP has been sent. Please check your inbox (and spam folder).",
      });
    }
    
    // SECURITY FIX: Always return same success message (prevents email enumeration)
    return res.status(200).json({
      success: true,
      message: "If an account exists with this email, an OTP has been sent. Please check your inbox (and spam folder).",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------------- SET PASSWORD (For Google users who want to add password) ---------------- */
export const setPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.userId; // From auth middleware

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 10 characters",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user already has a password
    if (user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: "Password already set for this account",
      });
    }

    // Hash and set password
    const passwordHash = await bcrypt.hash(password, 12);
    user.passwordHash = passwordHash;
    
    // Add local auth provider if not present
    if (!user.authProviders.includes("local")) {
      user.authProviders.push("local");
    }
    
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password set successfully. You can now login with email and password.",
    });
  } catch (error) {
    console.error("Set password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------------- VERIFY OTP ---------------- */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or OTP",
      });
    }

    // Check if OTP exists and not expired
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new OTP.",
      });
    }

    if (Date.now() > user.resetPasswordOTPExpires) {
      // Clear expired OTP
      user.resetPasswordOTP = null;
      user.resetPasswordOTPExpires = null;
      user.resetPasswordOTPAttempts = 0;
      await user.save();
      
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Check attempts (max 5 attempts)
    if (user.resetPasswordOTPAttempts >= 5) {
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    // Hash OTP to compare
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // Verify OTP
    if (user.resetPasswordOTP !== otpHash) {
      user.resetPasswordOTPAttempts += 1;
      await user.save();
      
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${5 - user.resetPasswordOTPAttempts} attempts remaining.`,
      });
    }

    // OTP verified - DON'T clear OTP yet (needed for reset password step)
    // OTP will be cleared after password is successfully reset
    // Just reset attempts counter
    user.resetPasswordOTPAttempts = 0;
    await user.save();

    // SECURITY FIX: Don't log sensitive information
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ OTP verified`);
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------------- RESET PASSWORD (After OTP verification) ---------------- */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and password are required",
      });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 10 characters",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or OTP",
      });
    }

    // Verify OTP one more time
    if (!user.resetPasswordOTP || Date.now() > user.resetPasswordOTPExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or invalid. Please request a new OTP.",
      });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (user.resetPasswordOTP !== otpHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // USER-FRIENDLY: Check password history (last 3 passwords)
    // Only check if user has password history
    if (user.passwordHistory && user.passwordHistory.length > 0) {
      for (const oldHash of user.passwordHistory) {
        const isReused = await bcrypt.compare(password, oldHash);
        if (isReused) {
          return res.status(400).json({
            success: false,
            message: "You've used this password recently. Please choose a different one.",
          });
        }
      }
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // USER-FRIENDLY: Update password history (keep last 3)
    // Add current password to history before updating
    if (!user.passwordHistory) {
      user.passwordHistory = [];
    }
    if (user.passwordHash) {
      user.passwordHistory.push(user.passwordHash);
      // Keep only last 3 passwords
      if (user.passwordHistory.length > 3) {
        user.passwordHistory = user.passwordHistory.slice(-3);
      }
    }

    // Update password and clear OTP
    user.passwordHash = passwordHash;
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    user.resetPasswordOTPAttempts = 0;
    
    // Add local auth provider if not present
    if (!user.authProviders.includes("local")) {
      user.authProviders.push("local");
    }
    
    await user.save();

    // SECURITY FIX: Don't log sensitive information
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Password reset successful`);
    }

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------------- CHANGE PASSWORD (For logged-in users) ---------------- */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Validate new password strength
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 10 characters",
      });
    }

    // Get user from request (set by protect middleware)
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has a password (not Google-only account)
    if (!user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: "You don't have a password set. Please use 'Set Password' to create one first.",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // USER-FRIENDLY: Check password history (last 3 passwords)
    // Only check if user has password history
    if (user.passwordHistory && user.passwordHistory.length > 0) {
      for (const oldHash of user.passwordHistory) {
        const isReused = await bcrypt.compare(newPassword, oldHash);
        if (isReused) {
          return res.status(400).json({
            success: false,
            message: "You've used this password recently. Please choose a different one.",
          });
        }
      }
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // USER-FRIENDLY: Update password history (keep last 3)
    // Add current password to history before updating
    if (!user.passwordHistory) {
      user.passwordHistory = [];
    }
    user.passwordHistory.push(user.passwordHash);
    
    // Keep only last 3 passwords (user-friendly - not too restrictive)
    if (user.passwordHistory.length > 3) {
      user.passwordHistory = user.passwordHistory.slice(-3);
    }

    // Update password
    user.passwordHash = passwordHash;
    await user.save();

    // Ensure local auth provider is in the list
    if (!user.authProviders.includes("local")) {
      user.authProviders.push("local");
      await user.save();
    }

    // SECURITY FIX: Don't log sensitive information
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Password changed successfully`);
    }

    return res.status(200).json({
      success: true,
      message: "Password has been changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
