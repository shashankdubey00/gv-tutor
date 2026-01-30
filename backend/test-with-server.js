import { Resend } from 'resend';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function testWithServer() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get tutor count
        const User = mongoose.model('User');
        const tutors = await User.find({ 
            role: 'tutor', 
            email: { $exists: true, $ne: null },
            isActive: true 
        });
        
        console.log(`📧 Found ${tutors.length} active tutors`);
        
        // Test Resend email directly
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        for (const tutor of tutors.slice(0, 2)) { // Test first 2 tutors
            const { data, error } = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
                to: tutor.email,
                subject: '🧪 TEST: New Tutor Opportunity Available',
                html: `
                    <h1>🎓 New Tutoring Opportunity!</h1>
                    <p>Hi ${tutor.name || 'Tutor'},</p>
                    <p>A new tutoring job has been posted:</p>
                    <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                        <h2>Math Tutor for Grade 10</h2>
                        <div><strong>📚 Subject:</strong> Mathematics</div>
                        <div><strong>📍 Location:</strong> Mumbai</div>
                        <div><strong>💰 Budget:</strong> ₹5000/month</div>
                    </div>
                    <p>This is a test email from the GV Tutor notification system.</p>
                    <p><strong>System Status:</strong> ✅ Working correctly</p>
                `
            });

            if (error) {
                console.error(`❌ Failed to send to ${tutor.email}:`, error.message);
            } else {
                console.log(`✅ Test email sent to ${tutor.email}:`, data.id);
            }
        }

        console.log('🎉 Test completed! Check tutor emails for test messages.');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testWithServer();
