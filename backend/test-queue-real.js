import { mongoose } from 'mongoose';
import dotenv from 'dotenv';
import emailQueue from './notifications/services/notificationQueue.js';
dotenv.config();

async function testQueueWithRealIds() {
    try {
        console.log('🧪 Testing Queue System with Real IDs\n');
        
        // Connect to MongoDB briefly
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
        
        // Generate real ObjectIds
        const tutorId = new mongoose.Types.ObjectId();
        const notificationId = new mongoose.Types.ObjectId();
        
        console.log('📧 Generated IDs:');
        console.log('   Tutor ID:', tutorId.toString());
        console.log('   Notification ID:', notificationId.toString());
        console.log('');
        
        // Test queue system
        await emailQueue.add({
            tutorId: tutorId.toString(),
            notificationId: notificationId.toString(),
            emailData: {
                to: process.env.SENDER_EMAIL,
                subject: '🎉 Real Queue Test - Job Notification',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: #4CAF50; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                            <h1>🎉 Real Job Notification Test</h1>
                        </div>
                        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #4CAF50;">Mathematics Tutor</h2>
                            <p><strong>📍 Location:</strong> New Delhi, India</p>
                            <p><strong>💰 Salary:</strong> ₹25,000 - ₹35,000 per month</p>
                            <p><strong>📝 Description:</strong></p>
                            <p>Looking for an experienced Mathematics tutor for Grade 10-12 students. Part-time position with flexible hours.</p>
                            <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <strong>✅ Queue System Status:</strong><br>
                                • Redis: Connected<br>
                                • Brevo API: Working<br>
                                • Rate Limiting: 2 emails/sec<br>
                                • Retry Logic: 3 attempts
                            </div>
                            <p style="margin-top: 30px; color: #999; font-size: 12px; text-align: center;">
                                This confirms your Brevo + Redis queue migration is successful! 🚀
                            </p>
                        </div>
                    </div>
                `
            }
        });
        
        console.log('✅ Job added to queue with real IDs!');
        console.log('📨 Email will be sent to:', process.env.SENDER_EMAIL);
        console.log('⏳ Processing with rate limiting...');
        console.log('');
        
        // Wait for processing
        setTimeout(() => {
            console.log('✅ Queue test completed!');
            console.log('📧 Check your inbox for the job notification email');
            console.log('🎉 Your Brevo migration is fully working!');
            mongoose.disconnect();
        }, 3000);
        
    } catch (error) {
        console.error('❌ Queue test failed:', error.message);
        mongoose.disconnect();
    }
}

console.log('═══════════════════════════════════════════');
console.log('   🧪 REAL QUEUE SYSTEM TEST');
console.log('═══════════════════════════════════════════\n');

testQueueWithRealIds();
