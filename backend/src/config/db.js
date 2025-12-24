import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // MongoDB Atlas connection options
        const options = {
            // These options are recommended for MongoDB Atlas
            serverSelectionTimeoutMS: 10000, // Increased timeout to 10s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            connectTimeoutMS: 10000, // Connection timeout
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        console.log("✅ MongoDB connected successfully");
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🌐 Host: ${mongoose.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        
        // Provide helpful error messages
        if (error.message.includes('authentication failed')) {
            console.error("💡 Tip: Check your database username and password in .env file");
        } else if (error.message.includes('IP')) {
            console.error("💡 Tip: Add your IP address to MongoDB Atlas Network Access whitelist");
        } else if (error.message.includes('ENOTFOUND')) {
            console.error("💡 Tip: Check your connection string and cluster name");
        }
        
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

export default connectDB;