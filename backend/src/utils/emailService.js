import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For development, you can use Gmail or other SMTP services
  // For production, use a service like SendGrid, Mailgun, or AWS SES
  
  // Option 1: Gmail (requires app-specific password)
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // App-specific password, not regular password
      },
    });
  }

  // Option 2: Custom SMTP (works with most email providers)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Option 3: Development - Ethereal Email (for testing, doesn't send real emails)
  // This creates a test account and logs the email URL
  // Use Ethereal if no email config AND (development mode OR NODE_ENV not set)
  const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
  const hasNoEmailConfig = !process.env.EMAIL_USER && !process.env.SMTP_HOST;
  
  if (isDevelopment && hasNoEmailConfig) {
    console.log("\n⚠️  =========================================");
    console.log("⚠️  NO EMAIL CONFIGURATION FOUND!");
    console.log("⚠️  =========================================");
    console.log("📧 Using Ethereal Email (TEST MODE - doesn't send real emails)");
    console.log("📧 Check console for preview URL after sending");
    console.log("\n💡 To send REAL emails, configure Gmail in backend/.env:");
    console.log("   EMAIL_SERVICE=gmail");
    console.log("   EMAIL_USER=your-email@gmail.com");
    console.log("   EMAIL_PASSWORD=your-app-password");
    console.log("   EMAIL_FROM=your-email@gmail.com");
    console.log("========================================\n");
    // Return null - we'll create transporter on demand for Ethereal
    return null;
  }

  return null;
};

// Send password reset email with OTP
export const sendPasswordResetEmail = async (email, otp) => {
  try {
    let transporter = createTransporter();

    // If no transporter (development without config), use Ethereal
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
    if (!transporter && isDevelopment) {
      console.log("📧 Creating Ethereal test account...");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    if (!transporter) {
      console.error("❌ Email transporter not configured");
      throw new Error("Email service not configured");
    }

    // Determine sender email address
    const senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.SMTP_USER;
    
    if (!senderEmail) {
      console.error("❌ No sender email configured. Set EMAIL_FROM or EMAIL_USER in .env");
      throw new Error("Email sender not configured");
    }

    const mailOptions = {
      from: senderEmail.includes("@") 
        ? `GV Tutor <${senderEmail}>` 
        : senderEmail, // Format: "Name <email@domain.com>"
      to: email,
      subject: "Password Reset OTP - GV Tutor",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
          </div>
          <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">Hello,</p>
            <p style="color: #374151; font-size: 16px; margin-bottom: 30px;">
              You requested to reset your password for your GV Tutor account.
            </p>
            <p style="color: #374151; font-size: 16px; margin-bottom: 10px;">Your OTP (One-Time Password) is:</p>
            <div style="background: white; border: 2px dashed #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #10b981; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Enter this OTP on the password reset page to continue.
            </p>
            <p style="color: #ef4444; font-size: 14px; margin-top: 20px; font-weight: bold;">
              ⚠️ This OTP will expire in 10 minutes.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              If you didn't request this password reset, please ignore this email. Your account remains secure.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px; text-align: center;">
              © 2025 GV Tutor. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
        Password Reset OTP - GV Tutor
        
        Hello,
        
        You requested to reset your password for your GV Tutor account.
        
        Your OTP (One-Time Password) is: ${otp}
        
        Enter this OTP on the password reset page to continue.
        
        ⚠️ This OTP will expire in 10 minutes.
        
        If you didn't request this password reset, please ignore this email.
        
        © 2025 GV Tutor. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    // If using Ethereal, log the preview URL
    const hasNoEmailConfig = !process.env.EMAIL_USER && !process.env.SMTP_HOST;
    if (isDevelopment && hasNoEmailConfig) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("\n📧 =========================================");
      console.log("📧 EMAIL PREVIEW (Ethereal - Test Mode)");
      console.log("📧 =========================================");
      console.log("📧 Preview URL:", previewUrl);
      console.log("📧 Click the URL above to see the email");
      console.log("📧 This is a TEST email - not sent to real inbox");
      console.log("📧 =========================================\n");
    } else {
      console.log("\n✅ =========================================");
      console.log("✅ PASSWORD RESET EMAIL SENT");
      console.log("✅ =========================================");
      const senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.SMTP_USER || "Unknown";
      console.log("✅ From (Your Email):", senderEmail);
      console.log("✅ To (User Email):", email);
      console.log("✅ Message ID:", info.messageId);
      console.log("✅ Email sent from YOUR account to user's inbox");
      console.log("✅ Check recipient's inbox (and spam folder)");
      console.log("✅ =========================================\n");
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("\n❌ =========================================");
    console.error("❌ ERROR SENDING EMAIL");
    console.error("❌ =========================================");
    console.error("❌ Error:", error.message);
    
    // Provide helpful error messages
    if (error.code === "EAUTH") {
      console.error("❌ Authentication failed!");
      console.error("💡 Check your email credentials in .env file");
      console.error("💡 For Gmail: Use App Password, not regular password");
    } else if (error.code === "ECONNECTION") {
      console.error("❌ Connection failed!");
      console.error("💡 Check your SMTP settings");
      console.error("💡 Verify network/firewall settings");
    } else {
      console.error("❌ Full error:", error);
    }
    console.error("========================================\n");
    throw new Error("Failed to send password reset email");
  }
};

