const mongoose = require('mongoose');
require('dotenv').config();

async function migrateTutors() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const result = await mongoose.connection.db.collection('users').updateMany(
            { 
                role: 'tutor',
                notificationEnabled: { $exists: false } 
            },
            { 
                $set: { 
                    emailVerified: false,
                    notificationEnabled: true,
                    lastNotificationSent: null
                } 
            }
        );
        
        console.log(`✅ Updated ${result.modifiedCount} tutors`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateTutors();
