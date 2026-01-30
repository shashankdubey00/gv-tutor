// Notification system entry point
// This file exports all notification models and services for easy importing

// Models
import Notification from './models/Notification.js';
import NotificationDelivery from './models/NotificationDelivery.js';
import EmailQueue from './models/EmailQueue.js';

// Services
import notificationService from './services/notificationService.js';
import unifiedEmailService from './services/unifiedEmailService.js';
import emailTemplates from './services/emailTemplates.js';
import emailQueue from './services/notificationQueue.js';

export {
    // Models
    Notification,
    NotificationDelivery,
    EmailQueue,
    
    // Services
    notificationService,
    unifiedEmailService,
    emailTemplates,
    emailQueue
};
