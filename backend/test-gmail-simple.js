import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testGmail() {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.verify();
        console.log('✅ Gmail SMTP connected successfully');
        
        // Test sending a test email
        const testResult = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: 'Test Email from GV Tutor',
            html: '<h1>Test Email</h1><p>This is a test email from the notification system.</p>'
        });
        
        console.log('✅ Test email sent:', testResult.messageId);
        process.exit(0);
    } catch (error) {
        console.error('❌ Gmail test failed:', error.message);
        process.exit(1);
    }
}

testGmail();
