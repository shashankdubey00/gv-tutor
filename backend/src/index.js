import "./config/env.js";   // 🔥 MUST be FIRST import

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./config/passport.js";

connectDB();

const app = express();

// Simple security headers (no external dependency needed)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Security: Request body size limit (prevent DoS)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
}));

app.use(cookieParser());
app.use(passport.initialize());

// Mount auth routes at both /auth and /api/auth (for Google OAuth compatibility)
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

// Import and mount other routes
import tutorRequestRoutes from "./routes/tutorRequestRoutes.js";
import tutorProfileRoutes from "./routes/tutorProfileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

app.use("/api/tutor-requests", tutorRequestRoutes);
app.use("/api/tutor-profile", tutorProfileRoutes);
app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
