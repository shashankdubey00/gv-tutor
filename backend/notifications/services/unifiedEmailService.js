import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

class UnifiedEmailService {
    constructor() {
        // Gmail transporter (for password reset, OTP)
        this.gmailTransporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Resend client (for bulk notifications)
        this.resendClient = new Resend(process.env.RESEND_API_KEY);
    }

    async sendWithGmail({ to, subject, html, text }) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: to,
                subject: subject,
                html: html,
                text: text || this.stripHtml(html)
            };

            const info = await this.gmailTransporter.sendMail(mailOptions);
            
            console.log(`✅ Gmail sent to ${to}`);  // ✅ Add this log
            
            return { 
                success: true, 
                messageId: info.messageId,
                service: 'gmail'
            };
        } catch (error) {
            console.error('Gmail sending failed:', error);
            return { 
                success: false, 
                error: error.message,
                service: 'gmail'
            };
        }
    }

    async sendWithResend({ to, subject, html, text }) {
        try {
            const { data, error } = await this.resendClient.emails.send({
                from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
                to: to,
                subject: subject,
                html: html,
                text: text || this.stripHtml(html)
            });

            if (error) {
                throw new Error(error.message);
            }

            return { 
                success: true, 
                messageId: data.id,
                service: 'resend'
            };
        } catch (error) {
            console.error('Resend sending failed:', error);
            return { 
                success: false, 
                error: error.message,
                service: 'resend'
            };
        }
    }

    async sendPasswordResetEmail({ to, resetToken, userName }) {
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
                .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔒 Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hi ${userName || 'there'},</p>
                    <p>Click the button below to reset your password:</p>
                    <center><a href="${resetUrl}" class="button">Reset Password</a></center>
                    <p style="margin-top: 20px; color: #666; font-size: 14px;">
                        This link expires in 1 hour.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        return await this.sendWithGmail({
            to,
            subject: 'Password Reset Request',
            html,
            text: `Reset your password: ${resetUrl}` 
        });
    }

    stripHtml(html) {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    async verifyGmailConnection() {
        try {
            await this.gmailTransporter.verify();
            console.log('✅ Gmail SMTP connected');
            return true;
        } catch (error) {
            console.error('❌ Gmail SMTP failed:', error.message);
            return false;
        }
    }
}

export default new UnifiedEmailService();
