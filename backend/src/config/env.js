import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
];

// Google OAuth is optional (only required if using Google login)
const optionalEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error("\nPlease check your .env file.");
  process.exit(1);
}

// Warn if Google OAuth vars are missing (but don't exit)
const missingGoogleVars = optionalEnvVars.filter((varName) => !process.env[varName]);
if (missingGoogleVars.length > 0) {
  console.warn("⚠️  Google OAuth variables missing (Google login will not work):");
  missingGoogleVars.forEach((varName) => console.warn(`   - ${varName}`));
  console.warn("   Email/password authentication will still work.\n");
}

// Validate JWT_SECRET strength in production
if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET must be at least 32 characters in production");
  process.exit(1);
}