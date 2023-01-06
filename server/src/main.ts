import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { CORS_ORIGIN } from "./constants";
import helmet from "helmet";

const PORT = process.env.PORT || 3000;

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

const server = app.listen(PORT, () => {
    console.log("Server listening on http://localhost:" + PORT);
});

const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

function gracefulShutdown(signal: NodeJS.Signals) {
    process.on(signal, () => {
        console.log(`Received ${signal}. Shutting down gracefully...`);
        server.close(() => {
            console.log("Server closed.");
        });
        // todo disconnect from db

        console.log("Exiting process...");

        process.exit(0);
    });
}

signals.forEach((signal) => {
    gracefulShutdown(signal);
});
