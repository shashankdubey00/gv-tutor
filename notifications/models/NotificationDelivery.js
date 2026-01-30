import mongoose from 'mongoose';

const notificationDeliverySchema = new mongoose.Schema({
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
        required: true
    },
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    emailSentAt: {
        type: Date,
        default: null
    },
    emailOpened: {
        type: Boolean,
        default: false
    },
    inAppRead: {
        type: Boolean,
        default: false
    },
    inAppReadAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

notificationDeliverySchema.index({ notificationId: 1, tutorId: 1 }, { unique: true });
notificationDeliverySchema.index({ tutorId: 1, inAppRead: 1 });

export default mongoose.model('NotificationDelivery', notificationDeliverySchema);
