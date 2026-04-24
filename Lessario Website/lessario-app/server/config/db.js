import mongoose from 'mongoose';

/**
 * connectDB()
 * 
 * Connects to MongoDB Atlas using the connection string from .env
 * 
 * HOW IT WORKS:
 * - mongoose.connect() establishes a persistent connection pool to your Atlas cluster
 * - Once connected, all Mongoose models (like User) can read/write to the database
 * - If the connection fails, the server exits with an error (fail-fast principle)
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit the server — no point running without a database
    }
};

export default connectDB;
