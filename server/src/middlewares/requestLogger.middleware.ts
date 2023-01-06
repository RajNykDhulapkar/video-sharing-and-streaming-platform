import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const responseTime = res.getHeaders()["x-response-time"];
        logger.info(
            `[${req.method}] ${req.originalUrl} ${req.protocol.toUpperCase()}/${req.httpVersion} ${
                res.statusCode
            } ${responseTime}`
        );
    });
    next();
}

export default requestLoggerMiddleware;
