import dotenv from "dotenv";
import { sendPasswordResetEmail } from "../src/utils/emailService.js";

dotenv.config();

console.log("\n🧪 Testing Email Configuration...\n");

// Check environment variables
console.log("📋 Environment Check:");
console.log("   NODE_ENV:", process.env.NODE_ENV || "not set");
console.log("   EMAIL_SERVICE:", process.env.EMAIL_SERVICE || "not set");
console.log("   EMAIL_USER:", process.env.EMAIL_USER ? "✅ set" : "❌ not set");
console.log("   SMTP_HOST:", process.env.SMTP_HOST || "not set");
console.log("   SMTP_USER:", process.env.SMTP_USER ? "✅ set" : "❌ not set");
console.log("");

// Test email sending
const testEmail = process.env.EMAIL_USER || "test@example.com";
const testToken = "test-token-12345";

console.log("📧 Attempting to send test email to:", testEmail);
console.log("");

try {
  await sendPasswordResetEmail(testEmail, testToken);
  console.log("\n✅ Email test completed successfully!");
  console.log("   Check the messages above for email preview URL or confirmation.");
} catch (error) {
  console.error("\n❌ Email test failed:");
  console.error("   Error:", error.message);
  console.error("\n💡 Make sure you have email configuration in .env file");
  console.error("   See QUICK_EMAIL_SETUP.md for instructions");
}

process.exit(0);



