import * as brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

async function testEmailSending() {
    try {
        console.log('🧪 Testing Email Sending with Brevo\n');
        
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );
        
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        
        // Try with a Brevo sandbox email first
        sendSmtpEmail.sender = {
            name: 'GV Tutor Test',
            email: 'no-reply@brevo.com' // Use Brevo's default sender for testing
        };
        
        sendSmtpEmail.to = [{ 
            email: process.env.SENDER_EMAIL 
        }];
        
        sendSmtpEmail.subject = '🧪 Brevo Email Test - ' + new Date().toLocaleString();
        sendSmtpEmail.htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1>🎉 Brevo Email Test Successful!</h1>
                </div>
                <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #4CAF50;">✅ Your Brevo Integration is Working!</h2>
                    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>From:</strong> Brevo API</p>
                    <p><strong>To:</strong> ${process.env.SENDER_EMAIL}</p>
                    <p style="margin-top: 20px; color: #666;">
                        This email confirms that your Brevo API connection is working perfectly. 
                        Your email migration from Gmail/Resend to Brevo is successful!
                    </p>
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>🚀 Next Steps:</strong>
                        <ol>
                            <li>Verify your sender email in Brevo dashboard</li>
                            <li>Test OTP emails with your verified sender</li>
                            <li>Test queue system</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;
        
        console.log('📤 Sending test email...');
        console.log('📧 To:', process.env.SENDER_EMAIL);
        console.log('📧 From: no-reply@brevo.com (Brevo sandbox)');
        console.log('');
        
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        
        console.log('✅ SUCCESS! Email sent via Brevo!');
        console.log('📨 Message ID:', result.messageId);
        console.log('📬 Check your inbox:', process.env.SENDER_EMAIL);
        console.log('📬 Also check spam folder');
        console.log('');
        console.log('🎉 Your Brevo integration is working!');
        console.log('💡 Now verify your sender email to use your custom sender');
        
    } catch (error) {
        console.error('❌ Email sending failed:');
        console.error('   Error:', error.message);
        
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Details:', JSON.stringify(error.response.body, null, 2));
        }
        
        console.error('\n💡 If sender verification is the issue:');
        console.error('   1. Go to Brevo Dashboard → Transactional Emails → Senders');
        console.error('   2. Add and verify your sender email');
        console.error('   3. Then test again with your verified sender');
    }
}

console.log('═══════════════════════════════════════════');
console.log('   🧪 BREVO EMAIL SENDING TEST');
console.log('═══════════════════════════════════════════\n');

testEmailSending();
