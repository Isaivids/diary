import mongoose from 'mongoose';
let isConnected = false;
export async function connectToDatabase() {
    if (isConnected) {
        console.log("Reusing existing database connection");
        return;
    }

    if (mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error;
    }
}

