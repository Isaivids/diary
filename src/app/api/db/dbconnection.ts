import mongoose from 'mongoose';

let isConnected = false; // Keep track of the connection status

export async function connectToDatabase() {
    if (isConnected) {
        return; // Prevent multiple connections
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        isConnected = true; // Set the connection status
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to the database");
    }
}
