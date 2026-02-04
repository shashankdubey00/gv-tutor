import * as brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

class UnifiedEmailService {
    constructor() {
        // Initialize Brevo API
        this.apiInstance = new brevo.TransactionalEmailsApi();
        this.apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );
    }

    // Send with Brevo (replaces both Gmail and Resend)
    async sendWithBrevo({ to, subject, html, text }) {
        try {
            const sendSmtpEmail = new brevo.SendSmtpEmail();
            
            sendSmtpEmail.sender = {
                name: process.env.SENDER_NAME || 'Goodwill Team',
                email: process.env.SENDER_EMAIL
            };
            
            sendSmtpEmail.to = [{ email: to }];
            sendSmtpEmail.subject = subject;
            sendSmtpEmail.htmlContent = html;
            
            if (text) {
                sendSmtpEmail.textContent = text;
            }

            const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            
            console.log(`✅ Brevo sent to ${to}`);
            
            return { 
                success: true, 
                messageId: result.messageId,
                service: 'brevo'
            };
        } catch (error) {
            console.error('Brevo sending failed:', error.message);
            return { 
                success: false, 
                error: error.message,
                service: 'brevo'
            };
        }
    }

    // Keep the Gmail method name for backward compatibility
    // But internally it uses Brevo
    async sendWithGmail({ to, subject, html, text }) {
        return await this.sendWithBrevo({ to, subject, html, text });
    }

    // Keep the Resend method name for backward compatibility
    // But internally it uses Brevo
    async sendWithResend({ to, subject, html, text }) {
        return await this.sendWithBrevo({ to, subject, html, text });
    }

    // Password reset email (with OTP)
    async sendPasswordResetEmail({ to, resetToken, userName }) {
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
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
                    <p style="margin-top: 20px; color: #999; font-size: 12px;">
                        If you didn't request this, please ignore this email.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        return await this.sendWithBrevo({
            to,
            subject: 'Password Reset Request - GV Tutor',
            html,
            text: `Reset your password: ${resetUrl}` 
        });
    }

    // Job notification email
    async sendJobNotificationEmail({ to, jobTitle, jobDescription, jobLocation, jobSalary, jobId }) {
        const jobUrl = `${process.env.CLIENT_URL}/jobs/${jobId}`;
        
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
                .job-title { font-size: 24px; color: #4CAF50; margin-bottom: 15px; font-weight: bold; }
                .job-detail { margin: 10px 0; }
                .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 New Job Opportunity!</h1>
                </div>
                <div class="content">
                    <div class="job-title">${jobTitle}</div>
                    <div class="job-detail"><strong>📍 Location:</strong> ${jobLocation}</div>
                    <div class="job-detail"><strong>💰 Salary:</strong> ${jobSalary}</div>
                    <div class="job-detail">
                        <strong>📝 Description:</strong>
                        <p>${jobDescription}</p>
                    </div>
                    <center><a href="${jobUrl}" class="button">View Job Details</a></center>
                    <p style="margin-top: 30px; color: #999; font-size: 12px; text-align: center;">
                        You're receiving this because you're subscribed to job notifications.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        return await this.sendWithBrevo({
            to,
            subject: `🔔 New Job: ${jobTitle}`,
            html,
            text: `New Job Posted: ${jobTitle}\n\nLocation: ${jobLocation}\nSalary: ${jobSalary}\n\nDescription: ${jobDescription}\n\nView details: ${jobUrl}` 
        });
    }

    // Tutor notification email (for your existing notification system)
    async sendTutorNotificationEmail({ to, title, message, actionUrl }) {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📢 ${title}</h1>
                </div>
                <div class="content">
                    <p>${message}</p>
                    ${actionUrl ? `<center><a href="${actionUrl}" class="button">View Details</a></center>` : ''}
                    <p style="margin-top: 30px; color: #999; font-size: 12px; text-align: center;">
                        © 2025 GV Tutor. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        return await this.sendWithBrevo({
            to,
            subject: title,
            html,
            text: `${title}\n\n${message}${actionUrl ? `\n\nView details: ${actionUrl}` : ''}` 
        });
    }

    stripHtml(html) {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    async verifyBrevoConnection() {
        try {
            // Test by getting account info
            const accountApi = new brevo.AccountApi();
            accountApi.setApiKey(
                brevo.AccountApiApiKeys.apiKey,
                process.env.BREVO_API_KEY
            );
            await accountApi.getAccount();
            console.log('✅ Brevo API connected successfully');
            return true;
        } catch (error) {
            console.error('❌ Brevo API connection failed:', error.message);
            return false;
        }
    }

    // Backward compatibility alias
    async verifyGmailConnection() {
        return await this.verifyBrevoConnection();
    }
}

export default new UnifiedEmailService();
