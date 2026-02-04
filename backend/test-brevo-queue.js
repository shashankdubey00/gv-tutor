import emailQueue from './notifications/services/notificationQueue.js';
import dotenv from 'dotenv';
dotenv.config();

async function testQueue() {
    try {
        console.log('🧪 Testing Email Queue with Brevo...\n');
        console.log('📧 Adding test notification to queue...\n');
        
        const testEmail = process.env.SENDER_EMAIL; // Send to yourself
        
        await emailQueue.add({
            tutorId: 'test-tutor-' + Date.now(),
            notificationId: 'test-notification-' + Date.now(),
            emailData: {
                to: testEmail,
                subject: '🎉 Test Job Notification - Brevo Queue',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: #4CAF50; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                            <h1>🎉 New Job Posted!</h1>
                        </div>
                        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #4CAF50;">Senior Full Stack Developer</h2>
                            <p><strong>📍 Location:</strong> Remote</p>
                            <p><strong>💰 Salary:</strong> $120,000 - $150,000</p>
                            <p><strong>📝 Description:</strong></p>
                            <p>This is a test job notification sent via Brevo queue system. If you're seeing this, your email queue is working perfectly!</p>
                            <p style="margin-top: 30px; color: #999; font-size: 12px;">
                                This is a test email. Your Brevo + Bull Queue integration is working! 🚀
                            </p>
                        </div>
                    </div>
                `
            }
        });
        
        console.log('✅ Job added to queue successfully!');
        console.log('📨 Email will be sent to:', testEmail);
        console.log('⏳ Processing...\n');
        console.log('💡 Queue will:');
        console.log('   1. Rate limit to 2 emails/second');
        console.log('   2. Send via Brevo API');
        console.log('   3. Retry up to 3 times if failed');
        console.log('   4. Update EmailQueue model in MongoDB\n');
        console.log('📬 Check your inbox (and spam) in a few seconds!\n');
        
        // Wait to see the result
        setTimeout(() => {
            console.log('✅ Test complete! Check console above for send confirmation.');
            console.log('📧 If you see "✅ Brevo sent to..." then it worked!\n');
            process.exit(0);
        }, 5000);
        
    } catch (error) {
        console.error('\n❌ Queue test failed:', error.message);
        console.error('');
        console.error('💡 Troubleshooting:');
        console.error('   1. Check Redis connection (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)');
        console.error('   2. Check BREVO_API_KEY in .env');
        console.error('   3. Verify MongoDB connection');
        console.error('');
        process.exit(1);
    }
}

console.log('═══════════════════════════════════════════');
console.log('   🧪 BREVO EMAIL QUEUE TEST');
console.log('═══════════════════════════════════════════\n');

testQueue();
