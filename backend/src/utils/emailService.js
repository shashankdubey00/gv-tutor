import * as brevo from '@getbrevo/brevo';

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
if (process.env.BREVO_API_KEY) {
  apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );
}

// Send password reset email with OTP
export const sendPasswordResetEmail = async (email, otp) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.warn("BREVO_API_KEY is not set. Skipping email send.");
      return { success: false, messageId: null };
    }
    console.log('🔍 DEBUG: Using Brevo verified sender: no-reply@brevo.com');
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.sender = {
      name: process.env.SENDER_NAME || 'GV Tutor',
      email: process.env.SENDER_EMAIL || 'no-reply@brevo.com'  // Use Brevo's verified sender
    };
    
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.subject = 'Password Reset OTP - GV Tutor';
    
    sendSmtpEmail.htmlContent = `
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
    `;

    sendSmtpEmail.textContent = `
      Password Reset OTP - GV Tutor
      
      Hello,
      
      You requested to reset your password for your GV Tutor account.
      
      Your OTP (One-Time Password) is: ${otp}
      
      Enter this OTP on the password reset page to continue.
      
      ⚠️ This OTP will expire in 10 minutes.
      
      If you didn't request this password reset, please ignore this email.
      
      © 2025 GV Tutor. All rights reserved.
    `;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("\n✅ =========================================");
    console.log("✅ PASSWORD RESET EMAIL SENT (Brevo)");
    console.log("✅ =========================================");
    console.log("✅ From:", process.env.SENDER_EMAIL);
    console.log("✅ To:", email);
    console.log("✅ Message ID:", result.messageId);
    console.log("✅ =========================================\n");

    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error("\n❌ =========================================");
    console.error("❌ ERROR SENDING EMAIL (Brevo)");
    console.error("❌ =========================================");
    console.error("❌ Error:", error.message);
    
    if (error.response) {
      console.error("❌ Status:", error.response.status);
      console.error("❌ Details:", error.response.body);
    }
    
    console.error("========================================\n");
    throw new Error("Failed to send password reset email");
  }
};
