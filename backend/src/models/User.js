import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      default: null,
    },

    authProviders: {
      type: [String],
      enum: ["local", "google"],
      default: ["local"],
    },

    googleId: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "tutor", "admin"],
      default: "user",
    },

    isTutorProfileComplete: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Password Reset - OTP Based
    resetPasswordOTP: {
      type: String,
      default: null,
    },
    resetPasswordOTPExpires: {
      type: Date,
      default: null,
    },
    resetPasswordOTPAttempts: {
      type: Number,
      default: 0,
    },
    
    // Account Lockout Protection
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockedUntil: {
      type: Date,
      default: null,
    },
    
    // Password History (store last 3 password hashes)
    passwordHistory: {
      type: [String],
      default: [],
      maxlength: 3, // Only keep last 3 passwords
    },

    // Notification System Fields
    emailVerified: {
      type: Boolean,
      default: false,
    },
    notificationEnabled: {
      type: Boolean,
      default: true,
    },
    lastNotificationSent: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
