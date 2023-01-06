import mongoose from "mongoose";
import logger from "./logger";

// Then the connection to localhost is refused on the IPv6 address ::1 . Mongoose per default uses IPv6. Set the IPv4 address explicit
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/vssDB";

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
