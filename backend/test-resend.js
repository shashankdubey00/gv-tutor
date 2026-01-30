import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

async function testResend() {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: 'Test Email from GV Tutor - Resend',
            html: '<h1>Test Email</h1><p>This is a test email from the Resend notification system.</p>'
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log('✅ Resend test email sent:', data.id);
        process.exit(0);
    } catch (error) {
        console.error('❌ Resend test failed:', error.message);
        process.exit(1);
    }
}

testResend();
