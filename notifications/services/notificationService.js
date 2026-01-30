import Notification from '../models/Notification.js';
import NotificationDelivery from '../models/NotificationDelivery.js';
import EmailQueue from '../models/EmailQueue.js';
import emailQueue from './notificationQueue.js';
import emailTemplates from './emailTemplates.js';
import mongoose from 'mongoose';

class NotificationService {
    async notifyAllTutors({ type, title, message, relatedId = null, relatedCollection = null, createdBy, templateData }) {
        try {
            // 1. Create notification
            const notification = await Notification.create({
                type,
                title,
                message,
                relatedId,
                relatedCollection,
                createdBy,
                isActive: true
            });

            // 2. Get all active tutors
            const Tutor = mongoose.model('Tutor');
            
            const tutors = await Tutor.find({
                email: { $exists: true, $ne: null },
                isActive: true
            }).select('_id name email');

            console.log(`📧 Sending notification to ${tutors.length} tutors...`);

            // 3. Create deliveries and queue emails
            const deliveryPromises = tutors.map(async (tutor) => {
                await NotificationDelivery.create({
                    notificationId: notification._id,
                    tutorId: tutor._id,
                    emailSent: false,
                    inAppRead: false
                });

                let emailContent;
                if (type === 'new_job') {
                    emailContent = emailTemplates.newJobEmail({
                        tutorName: tutor.name,
                        ...templateData
                    });
                } else {
                    emailContent = emailTemplates.announcementEmail({
                        tutorName: tutor.name,
                        title: title,
                        message: message,
                        ...templateData
                    });
                }

                await EmailQueue.create({
                    tutorId: tutor._id,
                    notificationId: notification._id,
                    emailTo: tutor.email,
                    subject: emailContent.subject,
                    status: 'pending'
                });

                await emailQueue.add({
                    tutorId: tutor._id,
                    notificationId: notification._id,
                    emailData: {
                        to: tutor.email,
                        subject: emailContent.subject,
                        html: emailContent.html
                    }
                });
            });

            await Promise.all(deliveryPromises);

            return {
                success: true,
                notificationId: notification._id,
                tutorsNotified: tutors.length
            };

        } catch (error) {
            console.error('Notification service error:', error);
            throw error;
        }
    }

    async getTutorNotifications(tutorId, limit = 20) {
        const notifications = await NotificationDelivery.find({ tutorId })
            .populate({
                path: 'notificationId',
                match: { isActive: true }
            })
            .sort({ createdAt: -1 })
            .limit(limit);

        return notifications.filter(n => n.notificationId !== null);
    }

    async markAsRead(tutorId, notificationId) {
        await NotificationDelivery.findOneAndUpdate(
            { tutorId, notificationId },
            {
                inAppRead: true,
                inAppReadAt: new Date()
            }
        );
    }

    async getUnreadCount(tutorId) {
        const count = await NotificationDelivery.countDocuments({
            tutorId,
            inAppRead: false
        });

        return count;
    }
}

export default new NotificationService();
