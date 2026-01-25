# 📖 Manual Implementation Guide
## Step-by-Step Authentication Setup (Do It Yourself)

This guide will walk you through implementing the authentication system **manually**, step by step, with explanations for each part.

---

## 📋 Table of Contents

1. [Backend Setup](#backend-setup)
2. [Database Models](#database-models)
3. [Authentication Controller](#authentication-controller)
4. [Middleware](#middleware)
5. [Routes](#routes)
6. [Frontend Setup](#frontend-setup)
7. [Testing](#testing)

---

## 🚀 Backend Setup

### Step 1: Initialize Project

```bash
mkdir my-auth-project
cd my-auth-project
mkdir backend frontend
cd backend
npm init -y
```

### Step 2: Install Dependencies

```bash
npm install express mongoose bcryptjs jsonwebtoken cookie-parser cors dotenv passport passport-google-oauth20
```

### Step 3: Create Folder Structure

```bash
mkdir -p src/models src/controllers src/middleware src/routes src/config src/utils
```

### Step 4: Create `.env` File

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/my-auth-db
JWT_SECRET=your_super_secret_key_min_32_characters_long
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📊 Database Models

### Step 1: Create User Model

Create `backend/src/models/User.js`:

```javascript
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
    // Password History (last 3 passwords)
    passwordHistory: {
      type: [String],
      default: [],
      maxlength: 3,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
```

**What this does:**
- Defines user schema with all fields
- Email is unique and lowercase
- Supports both local and Google auth
- Includes security features (lockout, password history)

### Step 2: Create UserProfile Model

Create `backend/src/models/UserProfile.js`:

```javascript
import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserProfile", userProfileSchema);
```

**What this does:**
- Stores additional user information
- Linked to User via userId
- One profile per user (unique)

---

## 🔧 Configuration Files

### Step 1: Database Connection

Create `backend/src/config/db.js`:

```javascript
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected");
});

export default connectDB;
```

**What this does:**
- Connects to MongoDB
- Handles connection errors
- Sets timeouts for reliability

### Step 2: Environment Validation

Create `backend/src/config/env.js`:

```javascript
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
];

const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  process.exit(1);
}

if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET must be at least 32 characters in production");
  process.exit(1);
}

console.log("✅ Environment variables validated");
```

**What this does:**
- Loads environment variables
- Validates required variables exist
- Checks JWT_SECRET strength in production

### Step 3: Google OAuth Strategy

Create `backend/src/config/passport.js`:

```javascript
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
          return done(new Error("No email found in Google profile"), null);
        }

        const email = profile.emails[0].value.toLowerCase().trim();
        let user = await User.findOne({ email });

        if (!user) {
          // New user - create account
          user = await User.create({
            email,
            googleId: profile.id,
            authProviders: ["google"],
            role: "user",
          });
          console.log(`✅ New user created via Google: ${email}`);
        } else {
          // Existing user - link Google account
          if (!user.authProviders.includes("google")) {
            user.authProviders.push("google");
          }
          if (!user.googleId) {
            user.googleId = profile.id;
          }
          await user.save();
          console.log(`✅ Google account linked: ${email}`);
        }

        done(null, user);
      } catch (err) {
        console.error("Passport Google Strategy error:", err);
        done(err, null);
      }
    }
  )
);

export default passport;
```

**What this does:**
- Configures Google OAuth
- Creates new users or links existing accounts
- Handles account linking

---

## 🛡️ Middleware

### Step 1: Authentication Middleware

Create `backend/src/middleware/authMiddleware.js`:

```javascript
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
```

**What this does:**
- Extracts JWT from cookie
- Verifies token is valid
- Adds user info to request object

### Step 2: Rate Limiter

Create `backend/src/middleware/rateLimiter.js`:

```javascript
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
```

**What this does:**
- Limits requests per IP address
- Prevents brute force attacks
- Cleans up old entries automatically

### Step 3: CSRF Middleware

Create `backend/src/middleware/csrfMiddleware.js`:

```javascript
import crypto from "crypto";

const csrfTokens = new Map();

// Clean up expired tokens
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of csrfTokens.entries()) {
    if (data.expires < now) {
      csrfTokens.delete(token);
    }
  }
}, 10 * 60 * 1000);

export function generateCSRFToken() {
  const token = crypto.randomBytes(32).toString("hex");
  csrfTokens.set(token, {
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
    createdAt: Date.now(),
  });
  return token;
}

export function verifyCSRFToken(token) {
  if (!token) return false;
  const tokenData = csrfTokens.get(token);
  if (!tokenData || tokenData.expires < Date.now()) {
    return false;
  }
  return true;
}

export function getCSRFToken(req, res, next) {
  if (req.method === "GET" && req.path.includes("/auth/")) {
    const token = generateCSRFToken();
    res.cookie("csrf-token", token, {
      httpOnly: false, // Must be accessible to JavaScript
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });
    res.locals.csrfToken = token;
  }
  next();
}

export function verifyCSRF(req, res, next) {
  const skipPaths = ["/auth/google/callback", "/auth/verify"];
  if (skipPaths.some((path) => req.path.includes(path))) {
    return next();
  }

  if (!["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    return next();
  }

  const token = req.headers["x-csrf-token"] || req.body.csrfToken;
  const cookieToken = req.cookies["csrf-token"];

  if (!token || !cookieToken || token !== cookieToken) {
    return res.status(403).json({
      success: false,
      message: "Invalid security token. Please refresh the page.",
    });
  }

  if (!verifyCSRFToken(token)) {
    return res.status(403).json({
      success: false,
      message: "Security token expired. Please refresh the page.",
    });
  }

  next();
}
```

**What this does:**
- Generates CSRF tokens
- Verifies tokens match cookie
- Protects against CSRF attacks

---

## 🎮 Authentication Controller

Create `backend/src/controllers/authController.js`:

This is a large file. I'll break it into sections:

### Part 1: Imports and Helpers

```javascript
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;
  if (email.includes("..")) return false;
  const [localPart] = email.split("@");
  if (localPart.startsWith(".") || localPart.endsWith(".")) return false;
  return true;
};

// Password validation (10 characters minimum)
const isStrongPassword = (password) => {
  return password.length >= 10;
};
```

### Part 2: Signup Function

```javascript
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 10 characters",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    // Prevent account enumeration
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      email: normalizedEmail,
      passwordHash,
      authProviders: ["local"],
      role: "user",
    });

    // Create profile
    const nameFromEmail = normalizedEmail.split("@")[0];
    await UserProfile.create({
      userId: newUser._id,
      fullName: nameFromEmail,
      phone: "",
      address: "",
    });

    // Generate JWT and set cookie
    const token = jwt.sign(
      { userId: newUser._id.toString(), role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
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
```

### Part 3: Login Function

```javascript
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Timing attack protection
    const dummyHash = "$2a$12$dummy.hash.to.prevent.timing.attacks";
    const user = await User.findOne({ email: normalizedEmail });
    const passwordHashToCheck = user?.passwordHash || dummyHash;

    // Check account lockout
    if (user) {
      if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
        const minutesRemaining = Math.ceil(
          (user.accountLockedUntil - new Date()) / (1000 * 60)
        );
        return res.status(423).json({
          success: false,
          message: `Account locked. Try again in ${minutesRemaining} minutes.`,
        });
      }

      if (user.accountLockedUntil && user.accountLockedUntil <= new Date()) {
        user.failedLoginAttempts = 0;
        user.accountLockedUntil = null;
        await user.save();
      }
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, passwordHashToCheck);

    if (!user || !isMatch || !user.passwordHash) {
      if (user) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        if (user.failedLoginAttempts >= 5) {
          user.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
          await user.save();
          return res.status(423).json({
            success: false,
            message: "Account locked for 30 minutes.",
          });
        }
        await user.save();
      }
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Reset failed attempts
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.accountLockedUntil = null;
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
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
```

**Continue with other functions (forgotPassword, verifyOTP, resetPassword, changePassword) - see full file in your project**

---

## 🛣️ Routes

Create `backend/src/routes/authRoutes.js`:

```javascript
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signup, login, forgotPassword, verifyOTP, resetPassword, changePassword } from "../controllers/authController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { protect } from "../middleware/authMiddleware.js";
import { getCSRFToken, verifyCSRF } from "../middleware/csrfMiddleware.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

const router = express.Router();
const authRateLimit = rateLimiter(30, 15 * 60 * 1000);

// CSRF token endpoint
router.get("/csrf-token", getCSRFToken, (req, res) => {
  res.json({
    success: true,
    csrfToken: res.locals.csrfToken,
  });
});

// Auth routes
router.post("/signup", authRateLimit, verifyCSRF, signup);
router.post("/login", authRateLimit, verifyCSRF, login);
router.post("/forgot-password", authRateLimit, verifyCSRF, forgotPassword);
router.post("/verify-otp", authRateLimit, verifyCSRF, verifyOTP);
router.post("/reset-password", authRateLimit, verifyCSRF, resetPassword);
router.post("/change-password", authRateLimit, protect, verifyCSRF, changePassword);

// Verify authentication
router.get("/verify", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: process.env.CLIENT_URL + "/login?error=google_auth_failed" }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(process.env.CLIENT_URL + "/login?error=no_user");
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.redirect(process.env.CLIENT_URL + "/login?error=user_not_found");
      }

      // Create profile if doesn't exist
      let userProfile = await UserProfile.findOne({ userId: user._id });
      if (!userProfile) {
        const nameFromEmail = user.email.split("@")[0];
        userProfile = await UserProfile.create({
          userId: user._id,
          fullName: nameFromEmail,
          phone: "",
          address: "",
        });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.redirect(process.env.CLIENT_URL + "/?auth=success&provider=google");
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect(process.env.CLIENT_URL + "/login?error=server_error");
    }
  }
);

// Logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
```

---

## 🖥️ Server Entry Point

Create `backend/src/index.js`:

```javascript
import "./config/env.js"; // MUST be first
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./config/passport.js";

connectDB();

const app = express();

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  exposedHeaders: ["Set-Cookie"],
}));

app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
```

---

## 🎨 Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install react-router-dom
```

### Step 2: Create API Service

Create `frontend/src/services/api.js`:

```javascript
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function getCSRFToken() {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrf-token") {
      return value;
    }
  }
  return null;
}

export async function apiRequest(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  // Add CSRF token for POST/PUT/DELETE
  if (["POST", "PUT", "DELETE", "PATCH"].includes(options.method)) {
    const token = getCSRFToken();
    if (token) {
      headers["X-CSRF-Token"] = token;
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include",
      headers,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    throw error;
  }
}
```

### Step 3: Create Auth Service

Create `frontend/src/services/authService.js`:

```javascript
import { apiRequest } from "./api";

export function loginUser(formData) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export function signupUser(formData) {
  return apiRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export function verifyAuth() {
  return apiRequest("/api/auth/verify", {
    method: "GET",
  });
}

export function logoutUser() {
  return apiRequest("/api/auth/logout", {
    method: "POST",
  });
}

// Add other functions (forgotPassword, verifyOTP, etc.)
```

### Step 4: Create Login Page

Create `frontend/src/pages/Login.jsx`:

```javascript
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, verifyAuth } from "../services/authService";
import { apiRequest } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize CSRF token
  useState(() => {
    apiRequest("/api/auth/csrf-token", { method: "GET" });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(formData);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const authData = await verifyAuth();
      
      if (authData.success) {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              className="mr-2"
            />
            Remember me
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Login with Google
          </button>
        </div>

        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
```

**Create similar pages for Signup, ForgotPassword, etc. (see your project files)**

---

## ✅ Testing Checklist

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   Check: Server runs, MongoDB connects

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Check: Frontend loads

3. **Test Signup:**
   - Go to `/signup`
   - Create account
   - Should auto-login

4. **Test Login:**
   - Go to `/login`
   - Login with credentials
   - Should redirect

5. **Test Google OAuth:**
   - Click "Login with Google"
   - Should redirect to Google
   - After approval, should login

---

## 🎯 Key Points to Remember

1. **Always hash passwords** - Never store plain text
2. **Use httpOnly cookies** - Prevents XSS attacks
3. **Validate on backend** - Never trust frontend
4. **Use environment variables** - Never hardcode secrets
5. **Test thoroughly** - Test all flows before production

---

## 📚 Next Steps

1. Complete all controller functions (forgotPassword, verifyOTP, etc.)
2. Create all frontend pages
3. Add password strength meter component
4. Test all authentication flows
5. Deploy to production

---

**You now have a complete manual implementation guide!** Follow each step carefully, and you'll have a production-ready authentication system.















