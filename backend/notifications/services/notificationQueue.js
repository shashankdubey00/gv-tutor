import Queue from 'bull';
import unifiedEmailService from './unifiedEmailService.js';
import EmailQueue from '../models/EmailQueue.js';
import NotificationDelivery from '../models/NotificationDelivery.js';

const emailQueue = new Queue('email-notifications', {
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_HOST.includes('upstash') ? {} : undefined
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        },
        removeOnComplete: true,
        removeOnFail: false
    }
});

emailQueue.process(async (job) => {
    const { tutorId, notificationId, emailData } = job.data;

    try {
        const result = await unifiedEmailService.sendWithResend(emailData);

        await EmailQueue.findOneAndUpdate(
            { tutorId, notificationId },
            {
                status: result.success ? 'sent' : 'failed',
                sentAt: result.success ? new Date() : null,
                $inc: { attempts: 1 },
                lastAttemptAt: new Date()
            }
        );

        if (result.success) {
            await NotificationDelivery.findOneAndUpdate(
                { tutorId, notificationId },
                {
                    emailSent: true,
                    emailSentAt: new Date()
                }
            );
        }

        return result;
    } catch (error) {
        console.error(`Email failed for tutor ${tutorId}:`, error);
        
        await EmailQueue.findOneAndUpdate(
            { tutorId, notificationId },
            {
                status: 'failed',
                errorMessage: error.message,
                $inc: { attempts: 1 },
                lastAttemptAt: new Date()
            }
        );

        throw error;
    }
});

emailQueue.on('completed', (job) => {
    console.log(`✅ Email sent to tutor ${job.data.tutorId}`);
});

emailQueue.on('failed', (job, err) => {
    console.error(`❌ Email failed for tutor ${job.data.tutorId}:`, err.message);
});

export default emailQueue;
