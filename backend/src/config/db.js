import mongoose from 'mongoose';

const connectDB = async () => {
    const options = {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 1,
        heartbeatFrequencyMS: 10000,
    };

    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ MONGO_URI is not set. Check your environment variables.");
        process.exit(1);
    }

    let isConnecting = false;
    const connectWithRetry = async (attempt = 1) => {
        if (isConnecting) return;
        isConnecting = true;
        try {
            await mongoose.connect(uri, options);
            console.log("✅ MongoDB connected successfully");
            console.log(`📊 Database: ${mongoose.connection.name}`);
            console.log(`🌐 Host: ${mongoose.connection.host}`);
        } catch (error) {
            console.error(`❌ MongoDB connection error (attempt ${attempt}):`, error.message);

            if (error.message.includes('authentication failed')) {
                console.error("💡 Tip: Check your database username and password in .env file");
            } else if (error.message.includes('IP')) {
                console.error("💡 Tip: Add your IP address to MongoDB Atlas Network Access whitelist");
            } else if (error.message.includes('ENOTFOUND')) {
                console.error("💡 Tip: Check your connection string and cluster name");
            }

            const backoffMs = Math.min(30000, 1000 * attempt);
            setTimeout(() => connectWithRetry(attempt + 1), backoffMs);
        } finally {
            isConnecting = false;
        }
    };

    await connectWithRetry();
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected. Attempting reconnect...');
    // Try reconnect in background
    setTimeout(() => {
        if (mongoose.connection.readyState !== 1) {
            mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 10000,
                maxPoolSize: 10,
                minPoolSize: 1,
                heartbeatFrequencyMS: 10000,
            }).catch(() => {});
        }
    }, 2000);
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

export default connectDB;
