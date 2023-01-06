import mongoose from "mongoose";
import logger from "./logger";

const DB_CONNECTION_STRING =
    process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/your-database-name";

export async function connectToDatabase() {
    try {
        await mongoose.connect(DB_CONNECTION_STRING);
        logger.info("Connected to database.");
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}

export async function disconnectFromDatabase() {
    try {
        await mongoose.connection.close();
        await mongoose.disconnect();
        logger.info("Disconnected from database.");
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}
