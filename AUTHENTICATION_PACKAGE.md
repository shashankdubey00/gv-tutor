# Complete Authentication System - Reusable Package

This document contains a complete, production-ready authentication system that you can use in any project. It includes JWT-based authentication with httpOnly cookies, password hashing, rate limiting, and role-based access control.

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Features](#features)
3. [File Structure](#file-structure)
4. [Backend Files](#backend-files)
5. [Frontend Files](#frontend-files)
6. [Setup Instructions](#setup-instructions)
7. [How It Works](#how-it-works)
8. [Usage Examples](#usage-examples)

---

## 🏗️ Architecture Overview

### Authentication Flow

```
User → Frontend → Backend API → Database
  ↓
1. Signup/Login → JWT Token Generated
  ↓
2. Token Stored in httpOnly Cookie
  ↓
3. All Protected Routes Check Cookie
  ↓
4. Middleware Validates Token → Grants Access
```

### Key Components

- **JWT Tokens**: Secure, stateless authentication
- **httpOnly Cookies**: Prevents XSS attacks
- **bcrypt**: Password hashing (12 rounds)
- **Rate Limiting**: Prevents brute force attacks
- **Role-Based Access**: user, tutor, admin roles
- **CORS**: Configured for cross-origin requests

---

## ✨ Features

✅ Email/Password Authentication  
✅ Password Strength Validation  
✅ JWT Token-Based Sessions  
✅ httpOnly Cookie Storage  
✅ Rate Limiting (30 requests/15min)  
✅ Role-Based Access Control  
✅ Protected Routes Middleware  
✅ Automatic User Profile Creation  
✅ Secure Password Hashing (bcrypt)  
✅ CORS Configuration  
✅ Development/Production Environment Support  

---

## 📁 File Structure

```
your-project/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── UserProfile.js
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── rateLimiter.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   └── index.js (server setup)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── services/
    │   │   ├── api.js
    │   │   └── authService.js
    │   └── utils/
    │       └── authHelper.js
    └── package.json
```

---

## 🔧 Backend Files

### 1. User Model (`backend/src/models/User.js`)

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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
```

### 2. UserProfile Model (`backend/src/models/UserProfile.js`)

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
      required: false,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserProfile", userProfileSchema);
```

### 3. Auth Controller (`backend/src/controllers/authController.js`)

See the complete file in the code section below.

**Key Functions:**
- `signup()`: Creates new user, hashes password, creates profile
- `login()`: Validates credentials, generates JWT, sets cookie

### 4. Auth Middleware (`backend/src/middleware/authMiddleware.js`)

```javascript
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Not authenticated" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};
```

### 5. Rate Limiter (`backend/src/middleware/rateLimiter.js`)

See complete file below - prevents brute force attacks.

### 6. Auth Routes (`backend/src/routes/authRoutes.js`)

```javascript
import express from "express";
import { signup, login } from "../controllers/authController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();
const authRateLimit = rateLimiter(30, 15 * 60 * 1000); // 30 requests per 15 minutes

router.post("/signup", authRateLimit, signup);
router.post("/login", authRateLimit, login);

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
        isTutorProfileComplete: user.isTutorProfileComplete,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

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

### 7. Server Setup (`backend/src/index.js` - Auth Part)

```javascript
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Mount auth routes
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
```

---

## 🎨 Frontend Files

### 1. API Service (`frontend/src/services/api.js`)

```javascript
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export async function apiRequest(endpoint, options = {}) {
  const timeoutDuration = 30000; // 30 seconds
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include", // Important: Include cookies
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new Error(data?.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error("Request timed out. Please try again.");
    }
    if (error.message.includes('Failed to fetch')) {
      throw new Error("Cannot connect to server. Please check your connection.");
    }
    throw error;
  }
}
```

### 2. Auth Service (`frontend/src/services/authService.js`)

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
```

### 3. Auth Helper (`frontend/src/utils/authHelper.js`)

```javascript
import { verifyAuth } from "../services/authService";

export async function checkAuthAndRedirect(navigate) {
  try {
    const authData = await verifyAuth();
    if (authData.success) {
      return authData.user;
    }
    return null;
  } catch (error) {
    return null;
  }
}
```

---

## 🚀 Setup Instructions

### Backend Setup

1. **Install Dependencies:**
```bash
npm install express mongoose bcryptjs jsonwebtoken cookie-parser cors
```

2. **Environment Variables (.env):**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

3. **Database Connection:**
```javascript
// backend/src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
```

### Frontend Setup

1. **Environment Variables (.env):**
```env
VITE_BACKEND_URL=http://localhost:5000
```

2. **Install Dependencies:**
```bash
npm install react-router-dom
```

---

## 🔐 How It Works

### 1. Signup Process

```
User submits form
  ↓
Backend validates email & password
  ↓
Password hashed with bcrypt (12 rounds)
  ↓
User created in database
  ↓
UserProfile automatically created
  ↓
Success response sent
```

### 2. Login Process

```
User submits credentials
  ↓
Backend finds user by email
  ↓
Password compared with bcrypt
  ↓
JWT token generated (contains userId & role)
  ↓
Token stored in httpOnly cookie
  ↓
Cookie sent to browser automatically
  ↓
Success response with user data
```

### 3. Protected Route Access

```
User makes request to protected route
  ↓
Browser automatically sends cookie
  ↓
protect middleware extracts token
  ↓
JWT verified & decoded
  ↓
req.user set with { userId, role }
  ↓
Route handler executes
```

### 4. Cookie Security

- **httpOnly**: JavaScript cannot access (prevents XSS)
- **sameSite**: "lax" in dev, "none" in production (CSRF protection)
- **secure**: true in production (HTTPS only)
- **path**: "/" (accessible across all routes)

---

## 💡 Usage Examples

### Backend: Protect a Route

```javascript
import { protect } from "../middleware/authMiddleware.js";

router.get("/protected-route", protect, (req, res) => {
  // req.user contains { userId, role }
  res.json({ 
    message: "Access granted",
    user: req.user 
  });
});
```

### Frontend: Check Authentication

```javascript
import { verifyAuth } from "./services/authService";

useEffect(() => {
  async function checkAuth() {
    try {
      const data = await verifyAuth();
      if (data.success) {
        console.log("User:", data.user);
        // User is authenticated
      }
    } catch (error) {
      // User is not authenticated
      navigate("/login");
    }
  }
  checkAuth();
}, []);
```

### Frontend: Login Form

```javascript
import { loginUser } from "./services/authService";

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const result = await loginUser({ 
      email, 
      password,
      rememberMe: false 
    });
    if (result.success) {
      // Redirect to dashboard
      navigate("/dashboard");
    }
  } catch (error) {
    setError(error.message);
  }
};
```

### Frontend: Protected Component

```javascript
import { useEffect, useState } from "react";
import { verifyAuth } from "./services/authService";

function ProtectedComponent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await verifyAuth();
        if (data.success) {
          setUser(data.user);
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Welcome, {user.email}!</div>;
}
```

---

## 📝 Complete Code Files

See the attached code files for complete implementations.

---

## 🔒 Security Features

1. **Password Hashing**: bcrypt with 12 rounds
2. **JWT Tokens**: Secure, signed tokens
3. **httpOnly Cookies**: XSS protection
4. **Rate Limiting**: Prevents brute force
5. **CORS**: Configured for your domain
6. **Input Validation**: Email format, password strength
7. **Environment Variables**: Secrets not in code

---

## 🎯 Customization

### Add More Roles

1. Update User model enum:
```javascript
role: {
  type: String,
  enum: ["user", "tutor", "admin", "moderator"], // Add new role
  default: "user",
}
```

### Change Password Requirements

Edit `authController.js`:
```javascript
const isStrongPassword = (password) => {
  // Customize regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return passwordRegex.test(password);
};
```

### Adjust Rate Limits

Edit `authRoutes.js`:
```javascript
const authRateLimit = rateLimiter(50, 15 * 60 * 1000); // 50 requests per 15 min
```

---

## ✅ Testing Checklist

- [ ] User can signup with valid email/password
- [ ] User cannot signup with existing email
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong password
- [ ] Protected routes require authentication
- [ ] Logout clears cookie
- [ ] Rate limiting works
- [ ] CORS allows frontend domain
- [ ] Cookies are httpOnly
- [ ] JWT tokens expire correctly

---

## 🐛 Troubleshooting

### Cookie Not Being Set

1. Check CORS credentials: `true`
2. Check cookie sameSite setting
3. Verify frontend URL matches CLIENT_URL
4. Check browser console for errors

### Token Invalid Errors

1. Verify JWT_SECRET matches
2. Check token expiration
3. Verify cookie is being sent
4. Check middleware order

### CORS Errors

1. Verify CLIENT_URL in backend .env
2. Check CORS origin matches frontend URL
3. Ensure credentials: true is set

---

## 📚 Additional Resources

- [JWT.io](https://jwt.io/) - JWT Debugger
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)
- [Express Cookie Parser](https://www.npmjs.com/package/cookie-parser)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Created for GV Tutor Project**  
**Ready for Production Use**

