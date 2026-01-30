import mongoose from 'mongoose';
import { notificationService } from '../notifications/index.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await notificationService.notifyAllTutors({
            type: 'new_job',
            title: 'TEST: Math Tutor Needed',
            message: 'This is a test notification',
            relatedId: new mongoose.Types.ObjectId(),
            relatedCollection: 'jobs',
            createdBy: new mongoose.Types.ObjectId(),
            templateData: {
                jobId: '123',
                jobTitle: 'Math Tutor for Grade 10',
                subject: 'Mathematics',
                location: 'Mumbai',
                budget: '5000',
                jobDetails: 'Need experienced math tutor'
            }
        });

        console.log('✅ Test completed:', result);
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

test();
