// Notification system entry point
// This file exports all notification models and services for easy importing

// Models
const Notification = require('./models/Notification');
const NotificationDelivery = require('./models/NotificationDelivery');
const EmailQueue = require('./models/EmailQueue');

// Services
const notificationService = require('./services/notificationService');
const unifiedEmailService = require('./services/unifiedEmailService');
const emailTemplates = require('./services/emailTemplates');
const emailQueue = require('./services/notificationQueue');

module.exports = {
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
