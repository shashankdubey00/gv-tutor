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

// Password validation - at least 8 characters, any characters allowed
const isStrongPassword = (password) => {
  // At least 8 characters, any characters allowed
  return password.length >= 8;
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
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      // Check if user signed up with Google
      const hasGoogleAuth = existingUser.authProviders && existingUser.authProviders.includes("google");
      if (hasGoogleAuth && !existingUser.passwordHash) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists via Google. Please use 'Login with Google' or set a password first.",
        });
      }
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Validate role if provided - default to "user" if not provided or invalid
    const validRoles = ["user", "tutor", "admin"];
    // Only use provided role if it's valid, otherwise default to "user"
    const userRole = (role && validRoles.includes(role.toLowerCase())) ? role.toLowerCase() : "user";

    console.log("📝 Creating user with role:", userRole, "from provided role:", role);

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

    console.log("✅ User and UserProfile created successfully");

    return res.status(201).json({
      success: true,
      message: "User created successfully",
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

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user has password (local authentication)
    if (!user.passwordHash) {
      // User exists but doesn't have password - might have signed up with Google
      const hasGoogleAuth = user.authProviders && user.authProviders.includes("google");
      if (hasGoogleAuth) {
        return res.status(401).json({
          success: false,
          message: "This account was created with Google. Please use 'Login with Google' instead.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1d" }
    );

    console.log("🔐 Setting login cookie for user:", user.email, "Role:", user.role);

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

    console.log("✅ Login cookie set successfully");

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

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });

    console.log(`📧 Forgot password request for: ${normalizedEmail}`);
    
    // Check if user exists and has password
    if (user && user.passwordHash) {
      console.log(`✅ User found with password. Generating OTP...`);
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`🔢 Generated OTP: ${otp} (for debugging - remove in production)`);
      
      // Hash OTP for storage
      const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
      
      // Set OTP expiration (10 minutes from now)
      user.resetPasswordOTP = otpHash;
      user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      user.resetPasswordOTPAttempts = 0; // Reset attempts
      await user.save();
      console.log(`💾 OTP saved to database`);

      let emailSent = false;
      try {
        // Send password reset email with OTP
        console.log(`📤 Attempting to send email to: ${normalizedEmail}`);
        await sendPasswordResetEmail(normalizedEmail, otp);
        console.log(`✅ Password reset OTP sent successfully to: ${normalizedEmail}`);
        emailSent = true;
        console.log(`\n🔑 =========================================`);
        console.log(`🔑 OTP FOR TESTING: ${otp}`);
        console.log(`🔑 Email: ${normalizedEmail}`);
        console.log(`🔑 Valid for 10 minutes`);
        console.log(`🔑 =========================================\n`);
      } catch (emailError) {
        console.error("❌ Failed to send email:", emailError);
        console.error("❌ Email error details:", emailError.message);
        console.error(`\n🔑 =========================================`);
        console.error(`🔑 OTP GENERATED BUT EMAIL FAILED: ${otp}`);
        console.error(`🔑 Email: ${normalizedEmail}`);
        console.error(`🔑 OTP will be available via fallback method`);
        console.error(`🔑 =========================================\n`);
        // Don't clear OTP if email fails - allow fallback method
        emailSent = false;
      }
      
      // Return response with OTP as fallback if email failed or in development
      return res.status(200).json({
        success: true,
        message: emailSent 
          ? "OTP has been sent to your email. Check your inbox (and spam folder)." 
          : "OTP generated. Check the options below if you didn't receive the email.",
        // Include OTP as fallback if email failed or in development mode
        ...((!emailSent || process.env.NODE_ENV === "development") && {
          fallbackOtp: otp,
          emailSent: emailSent,
          message: emailSent 
            ? "OTP sent to email. If not received, use the OTP shown below as fallback."
            : "Email sending failed. Use the OTP shown below."
        })
      });
    } else if (user && !user.passwordHash) {
      // User exists but signed up with Google only
      console.log(`⚠️ User found but no password (Google account only): ${normalizedEmail}`);
      return res.status(400).json({
        success: false,
        message: "This account was created with Google. Please use 'Login with Google' or set a password first by logging in and going to account settings.",
      });
    }
    
    // Always return success for non-existent users (security best practice)
    // This prevents email enumeration attacks
    return res.status(200).json({
      success: true,
      message: "If an account exists with this email, an OTP has been sent.",
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
        message: "Password must be at least 8 characters",
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

    console.log(`✅ OTP verified for: ${normalizedEmail}`);

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
        message: "Password must be at least 8 characters",
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

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

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

    console.log(`✅ Password reset successful for: ${user.email}`);

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
        message: "New password must be at least 8 characters",
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

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    user.passwordHash = passwordHash;
    await user.save();

    // Ensure local auth provider is in the list
    if (!user.authProviders.includes("local")) {
      user.authProviders.push("local");
      await user.save();
    }

    console.log(`✅ Password changed successfully for: ${user.email}`);

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
