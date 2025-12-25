import dotenv from "dotenv";
import { sendPasswordResetEmail } from "../src/utils/emailService.js";

dotenv.config();

console.log("\n🧪 Testing Email Configuration...\n");

// Check configuration
console.log("📋 Email Configuration Check:");
console.log("   EMAIL_SERVICE:", process.env.EMAIL_SERVICE || "not set");
console.log("   EMAIL_USER:", process.env.EMAIL_USER || "❌ not set");
console.log("   EMAIL_FROM:", process.env.EMAIL_FROM || "❌ not set");
console.log("   SMTP_HOST:", process.env.SMTP_HOST || "not set");
console.log("   SMTP_USER:", process.env.SMTP_USER || "not set");
console.log("");

// Validate configuration
if (!process.env.EMAIL_USER && !process.env.SMTP_USER) {
  console.error("❌ =========================================");
  console.error("❌ EMAIL NOT CONFIGURED!");
  console.error("❌ =========================================");
  console.error("❌ You need to configure email in backend/.env");
  console.error("");
  console.error("💡 For Gmail, add:");
  console.error("   EMAIL_SERVICE=gmail");
  console.error("   EMAIL_USER=your-email@gmail.com");
  console.error("   EMAIL_PASSWORD=your-app-password");
  console.error("   EMAIL_FROM=your-email@gmail.com");
  console.error("");
  console.error("📚 See EMAIL_AUTHORIZATION_GUIDE.md for detailed instructions");
  console.error("========================================\n");
  process.exit(1);
}

// Test email sending
const testEmail = process.env.EMAIL_USER || process.env.SMTP_USER || "test@example.com";
const testOTP = "123456";

console.log("📧 Attempting to send test email...");
console.log("   From:", process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.SMTP_USER);
console.log("   To:", testEmail);
console.log("   OTP:", testOTP);
console.log("");

try {
  await sendPasswordResetEmail(testEmail, testOTP);
  console.log("\n✅ =========================================");
  console.log("✅ EMAIL CONFIGURATION TEST PASSED!");
  console.log("✅ =========================================");
  console.log("✅ Email service is properly configured");
  console.log("✅ You can now send emails to users");
  console.log("✅ =========================================\n");
} catch (error) {
  console.error("\n❌ =========================================");
  console.error("❌ EMAIL CONFIGURATION TEST FAILED!");
  console.error("❌ =========================================");
  console.error("❌ Error:", error.message);
  console.error("");
  
  if (error.message.includes("Authentication")) {
    console.error("💡 Authentication failed!");
    console.error("   - Check your EMAIL_PASSWORD (use App Password, not regular password)");
    console.error("   - Make sure 2FA is enabled on Gmail");
    console.error("   - Verify credentials in .env file");
  } else if (error.message.includes("Connection")) {
    console.error("💡 Connection failed!");
    console.error("   - Check your SMTP settings");
    console.error("   - Verify network/firewall");
  } else {
    console.error("💡 Check error details above");
  }
  
  console.error("");
  console.error("📚 See EMAIL_AUTHORIZATION_GUIDE.md for help");
  console.error("========================================\n");
  process.exit(1);
}

process.exit(0);



