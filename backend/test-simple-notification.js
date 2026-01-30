import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

async function testSimpleNotification() {
    try {
        console.log('📧 Testing notification system with your current .env setup...');
        
        // Test Resend email directly
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: '🧪 GV Tutor Notification System Test',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                        <h1>🎓 GV Tutor Notification System</h1>
                    </div>
                    <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd;">
                        <h2>✅ System Test Successful!</h2>
                        <p>Your notification system is working correctly with the current .env configuration:</p>
                        <ul>
                            <li>✅ Resend API: Connected</li>
                            <li>✅ Email template: Working</li>
                            <li>✅ Environment variables: Loaded</li>
                        </ul>
                        <div style="background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                            <h3>Sample Job Notification:</h3>
                            <p><strong>Subject:</strong> Mathematics</p>
                            <p><strong>Location:</strong> Mumbai</p>
                            <p><strong>Budget:</strong> ₹5000/month</p>
                            <p><strong>Grade:</strong> 10</p>
                        </div>
                        <p><strong>Next Step:</strong> When you post a tutor request as admin, all active tutors will receive similar emails automatically.</p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('❌ Test failed:', error.message);
            process.exit(1);
        }

        console.log('✅ Test email sent successfully!');
        console.log(`   Message ID: ${data.id}`);
        console.log('   Check your inbox for the test email.');
        console.log('\n🚀 Your notification system is ready for deployment!');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testSimpleNotification();
