import { sendPasswordResetEmail } from './src/utils/emailService.js';
import dotenv from 'dotenv';
dotenv.config();

async function testOTP() {
    try {
        console.log('🧪 Testing OTP email with Brevo...\n');
        
        const testOTP = '123456';
        const testEmail = process.env.SENDER_EMAIL; // Send to yourself
        
        console.log('📧 Sending to:', testEmail);
        console.log('🔢 OTP:', testOTP);
        console.log('');
        
        const result = await sendPasswordResetEmail(testEmail, testOTP);
        
        if (result.success) {
            console.log('\n🎉 SUCCESS! OTP email sent via Brevo!');
            console.log('📨 Check your inbox:', testEmail);
            console.log('📬 Also check spam folder if not in inbox');
            console.log('');
            process.exit(0);
        } else {
            console.log('\n❌ Failed to send OTP email');
            process.exit(1);
        }
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('');
        console.error('💡 Troubleshooting:');
        console.error('   1. Check BREVO_API_KEY in .env');
        console.error('   2. Check SENDER_EMAIL in .env');
        console.error('   3. Verify sender email in Brevo dashboard');
        console.error('');
        process.exit(1);
    }
}

console.log('═══════════════════════════════════════════');
console.log('   🧪 BREVO OTP EMAIL TEST');
console.log('═══════════════════════════════════════════\n');

testOTP();
