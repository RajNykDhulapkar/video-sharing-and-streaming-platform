import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { CORS_ORIGIN } from "./constants";
import helmet from "helmet";
import errorMiddleware from "./middlewares/error.middleware";
import logger from "./utils/logger";
import { connectToDatabase, disconnectFromDatabase } from "./utils/database";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: CORS_ORIGIN,
        credentials: true,
    })
);
app.use(helmet());

app.use(errorMiddleware);

const server = app.listen(PORT, async () => {
    await connectToDatabase();
    logger.info("Server listening on http://localhost:" + PORT);
});

const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

function gracefulShutdown(signal: NodeJS.Signals) {
    process.on(signal, async () => {
        logger.info(`Received ${signal}. Shutting down gracefully...`);
        server.close(() => {
            logger.info("Server closed.");
        });

        // disconnect from database
        await disconnectFromDatabase();

        logger.info("Exiting process...");

        process.exit(0);
    });
}

signals.forEach((signal) => {
    gracefulShutdown(signal);
});
