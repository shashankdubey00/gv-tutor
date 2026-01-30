import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();
import { notificationService } from '../notifications/index.js';

// NOTE: Replace 'tutorAuth' with your actual tutor authentication middleware
// const { tutorAuth } = require('../middleware/auth'); // Adjust path as needed

// Temporary auth middleware - replace with your actual tutor auth
const tutorAuth = (req, res, next) => {
  // For now, we'll use a simple check - replace with your actual auth
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'tutor') {
      return res.status(403).json({ success: false, message: 'Tutor access required' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

router.get('/tutor/notifications', tutorAuth, async (req, res) => {
    try {
        const tutorId = req.user._id; // Adjust based on your auth setup
        
        const notifications = await notificationService.getTutorNotifications(tutorId);
        const unreadCount = await notificationService.getUnreadCount(tutorId);

        res.json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
});

router.put('/tutor/notifications/:notificationId/read', tutorAuth, async (req, res) => {
    try {
        const tutorId = req.user._id;
        const { notificationId } = req.params;

        await notificationService.markAsRead(tutorId, notificationId);

        res.json({ success: true, message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to mark as read' });
    }
});

export default router;
