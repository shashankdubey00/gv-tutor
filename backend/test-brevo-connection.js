import * as brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

async function testBrevoConnection() {
    try {
        console.log('🔍 Testing Brevo API connection...\n');
        
        // Test API key by getting account info
        const accountApi = new brevo.AccountApi();
        accountApi.setApiKey(
            brevo.AccountApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );
        
        console.log('📧 API Key:', process.env.BREVO_API_KEY ? 'Present' : 'MISSING');
        console.log('📧 Sender Email:', process.env.SENDER_EMAIL || 'MISSING');
        console.log('📧 Sender Name:', process.env.SENDER_NAME || 'MISSING');
        console.log('');
        
        const account = await accountApi.getAccount();
        
        console.log('✅ SUCCESS! Brevo API connected');
        console.log('📊 Account Info:');
        console.log('   - Email:', account.email);
        console.log('   - Plan:', account.planType);
        console.log('   - Credits:', account.credits);
        console.log('');
        
        // Now test sending capabilities
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );
        
        console.log('📤 Testing email sending capabilities...');
        
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.sender = {
            name: process.env.SENDER_NAME || 'Test',
            email: process.env.SENDER_EMAIL
        };
        sendSmtpEmail.to = [{ email: process.env.SENDER_EMAIL }];
        sendSmtpEmail.subject = '🧪 Brevo Connection Test';
        sendSmtpEmail.htmlContent = '<h1>Test Email</h1><p>If you see this, Brevo is working!</p>';
        
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        
        console.log('✅ Email sent successfully!');
        console.log('📨 Message ID:', result.messageId);
        console.log('📬 Check your inbox:', process.env.SENDER_EMAIL);
        
    } catch (error) {
        console.error('❌ Brevo connection failed:');
        console.error('   Error:', error.message);
        
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Details:', error.response.body);
        }
        
        console.error('\n💡 Troubleshooting:');
        console.error('   1. Check BREVO_API_KEY is correct');
        console.error('   2. Verify sender email in Brevo dashboard');
        console.error('   3. Ensure API key has email permissions');
    }
}

console.log('═══════════════════════════════════════════');
console.log('   🔍 BREVO CONNECTION TEST');
console.log('═══════════════════════════════════════════\n');

testBrevoConnection();
