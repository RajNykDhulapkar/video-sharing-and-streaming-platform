import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import HttpException from "../core/exceptions/http.exception";

export default function requireUserMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.user) {
        return next(new HttpException("Unauthorized", StatusCodes.FORBIDDEN));
    }
    return next();
}
