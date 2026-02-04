import { sendPasswordResetEmail } from './src/utils/emailService.js';
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Debugging OTP Service\n');
console.log('📧 API Key:', process.env.BREVO_API_KEY ? 'Present' : 'Missing');
console.log('📧 Sender Email:', process.env.SENDER_EMAIL);
console.log('📧 Sender Name:', process.env.SENDER_NAME);
console.log('');

// Test with the same working approach as our successful test
import * as brevo from '@getbrevo/brevo';

async function debugOTP() {
    try {
        console.log('🔄 Testing OTP with direct Brevo API...');
        
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );
        
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        
        sendSmtpEmail.sender = {
            name: 'GV Tutor',
            email: 'no-reply@brevo.com'  // Use working sender
        };
        
        sendSmtpEmail.to = [{ email: process.env.SENDER_EMAIL }];
        sendSmtpEmail.subject = '🔐 Password Reset OTP - GV Tutor';
        
        const otp = '123456';
        
        sendSmtpEmail.htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
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

        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

        console.log('✅ SUCCESS! OTP email sent via Brevo!');
        console.log('📨 Message ID:', result.messageId);
        console.log('📬 Check your inbox:', process.env.SENDER_EMAIL);
        console.log('🔢 OTP sent:', otp);
        
    } catch (error) {
        console.error('❌ Direct OTP test failed:');
        console.error('   Error:', error.message);
        
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Details:', JSON.stringify(error.response.body, null, 2));
        }
    }
}

debugOTP();
