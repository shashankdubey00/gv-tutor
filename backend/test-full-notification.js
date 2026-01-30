import mongoose from 'mongoose';
import { notificationService } from '../notifications/index.js';
import dotenv from 'dotenv';
dotenv.config();

async function testFullNotification() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Test notification to all tutors
        const result = await notificationService.notifyAllTutors({
            type: 'new_job',
            title: '🧪 TEST: Math Tutor Needed',
            message: 'This is a test notification from the GV Tutor system.',
            relatedId: new mongoose.Types.ObjectId(),
            relatedCollection: 'test',
            createdBy: new mongoose.Types.ObjectId(),
            templateData: {
                jobId: 'test-123',
                jobTitle: 'Math Tutor for Grade 10',
                subject: 'Mathematics',
                location: 'Mumbai',
                budget: '5000',
                jobDetails: 'Need experienced math tutor for grade 10 student.'
            }
        });

        console.log('✅ Full notification test completed:');
        console.log(`   - Notification ID: ${result.notificationId}`);
        console.log(`   - Tutors notified: ${result.tutorsNotified}`);
        console.log('   - Check your email for the test notification!');
        
        // Wait a moment for queue processing
        setTimeout(() => {
            console.log('📧 Emails should be arriving now...');
            process.exit(0);
        }, 3000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testFullNotification();
