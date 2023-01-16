import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { CORS_ORIGIN } from "./constants";
import helmet from "helmet";
import responseTime from "response-time";
import errorMiddleware from "./middlewares/error.middleware";
import logger from "./utils/logger";
import { connectToDatabase, disconnectFromDatabase } from "./utils/database";

import userRouter from "./modules/user/user.route";
import authRouter from "./modules/auth/auth.route";
import videoRouter from "./modules/video/video.route";

import requestLoggerMiddleware from "./middlewares/requestLogger.middleware";
import deserializeUserMiddleware from "./middlewares/deserializeUser.middleware";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(responseTime());

app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: CORS_ORIGIN,
        credentials: true,
    })
);
app.use(helmet());
app.use(deserializeUserMiddleware);

app.use(requestLoggerMiddleware);

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/video", videoRouter);

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

// q: git clear cache command
// a: git rm -r --cached .
