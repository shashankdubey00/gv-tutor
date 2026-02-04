import * as brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

async function simpleTest() {
    console.log('🔍 Simple Brevo Test\n');
    
    // Show the API key (first few chars only for security)
    const apiKey = process.env.BREVO_API_KEY;
    console.log('📧 API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'MISSING');
    console.log('📧 API Key Length:', apiKey ? apiKey.length : 0);
    console.log('📧 API Key starts with xkeysib:', apiKey?.startsWith('xkeysib-') ? 'YES' : 'NO');
    console.log('📧 Sender Email:', process.env.SENDER_EMAIL || 'MISSING');
    console.log('');
    
    if (!apiKey) {
        console.log('❌ API Key is missing from .env');
        return;
    }
    
    if (!apiKey.startsWith('xkeysib-')) {
        console.log('❌ API Key should start with xkeysib-');
        return;
    }
    
    try {
        // Test with minimal API call
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            apiKey
        );
        
        console.log('🔄 Testing API connection...');
        
        // Try to get sender list (simpler call)
        const sendersApi = new brevo.SendersApi();
        sendersApi.setApiKey(
            brevo.SendersApiApiKeys.apiKey,
            apiKey
        );
        
        const senders = await sendersApi.getSenders();
        
        console.log('✅ SUCCESS! API connection working');
        console.log('📨 Verified senders:', senders.senders?.length || 0);
        
        // Check if our sender is verified
        const ourSender = senders.senders?.find(s => s.email === process.env.SENDER_EMAIL);
        if (ourSender) {
            console.log('✅ Sender email is verified:', ourSender.email);
            console.log('📊 Sender status:', ourSender.status);
        } else {
            console.log('❌ Sender email not found in verified senders');
            console.log('💡 Please verify your sender email in Brevo dashboard');
        }
        
    } catch (error) {
        console.error('❌ API Test Failed:');
        console.error('   Error:', error.message);
        
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Details:', JSON.stringify(error.response.body, null, 2));
        }
    }
}

console.log('═══════════════════════════════════════════');
console.log('   🔍 SIMPLE BREVO TEST');
console.log('═══════════════════════════════════════════\n');

simpleTest();
